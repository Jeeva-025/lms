const { AppDataSource } = require("../models/dbconfig");
const { generateRandomNumber, hashPassword } = require("../utils/helper");
const Employee = require("../models/entities/employee");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const LeaveRemaining = require("../models/entities/leaveBalance");
const LeaveRequest = require("../models/entities/leaveRequest");
const EmployeeType = require("../models/entities/employeeType");
const LeavePolicy = require("../models/entities/leavePolicy");
const { Not, In } = require("typeorm");
const ApprovalFlow = require("../models/entities/approvalFlow");
const { status } = require("../utils/constant");

dotenv.config();

const createEmployee = async (request, h) => {
  try {
    const { name, email, emp_type_id, manager_id, password } = request.payload;

    const employeeRepo = AppDataSource.getRepository(Employee);
    const leavePolicyRepo = AppDataSource.getRepository(LeavePolicy);
    const leaveBalanceRepo = AppDataSource.getRepository(LeaveRemaining);

    const employee_id = generateRandomNumber();
    const hashedPassword = await hashPassword(password);

    const newEmployee = employeeRepo.create({
      id: employee_id,
      name,
      emp_type_id,
      manager_id,
      email,
      password: hashedPassword,
    });
    await employeeRepo.save(newEmployee);
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();

    const policies = await leavePolicyRepo.find({
      where: {
        employee_type_id: emp_type_id,
        status: status.Active.toString(),
      },
    });

    for (const policy of policies) {
      let balance = await leaveBalanceRepo.findOne({
        where: {
          employee_id: newEmployee.id,
          leave_type_id: policy.leave_type_id,
          year: year,
        },
      });

      if (!balance) {
        balance = leaveBalanceRepo.create({
          employee_id: newEmployee.id,
          leave_type_id: policy.leave_type_id,
          year: year,
          no_of_leave_taken: 0,
          total_leaves: 0,
          status: status.Active,
        });
      }

      const newLeaves = policy.accrual_per_month * month;

      if (newLeaves > balance.total_leaves) {
        balance.total_leaves = newLeaves;
        await leaveBalanceRepo.save(balance);
      }
    }
    return h
      .response({ message: "Employee has been created successfully" })
      .code(201);
  } catch (err) {
    console.error("Error while creating employee:", err);
    return h.response({ error: "Failed to create employee" }).code(500);
  }
};

const changePassword = async (request, h) => {
  try {
    const { id, password } = request.payload;
    const employeeRepo = AppDataSource.getRepository(Employee);
    const employeeData = await employeeRepo.findOne({ where: { id } });
    if (!employeeData) {
      return h.response({ error: "Data not Found" }).code(404);
    }
    const hashpass = hashPassword(password);
    employeeData.password = hashpass;
    await employeeRepo.save(employeeData);
    return h
      .response({ message: "Password has been Changed successfully" })
      .code(201);
  } catch (err) {
    console.log(err);
    return h.response({ error: "Failed to change Password" }).code(500);
  }
};

const loginEmployee = async (request, h) => {
  try {
    const { email, password } = request.payload;
    const employeeRepo = AppDataSource.getRepository(Employee);

    const employeeData = await employeeRepo.findOne({
      where: { email, status: status.Active.toString() },
      relations: ["employeeType"],
    });

    if (!employeeData) {
      return h.response({ message: "Invalid email or password" }).code(401);
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      employeeData.password
    );
    if (!isPasswordValid) {
      return h.response({ message: "Invalid email or password" }).code(401);
    }
    const token = jwt.sign(
      {
        employee_id: employeeData.id,
        email: employeeData.email,
        designation: employeeData.employeeType.name,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: process.env.JWT_EXPIRATION }
    );
    const manager = await employeeRepo.findOne({
      where: { id: employeeData.manager_id },
    });

    return h
      .response({
        message: "Login successful",
        token,
        employee: {
          id: employeeData.id,
          name: employeeData.name,
          email: employeeData.email,
          designation: employeeData.employeeType.name,
          managerId: employeeData.manager_id,
          managerName: manager.name,
        },
      })
      .code(200);
  } catch (err) {
    console.error("Error during login", err);
    return h.response({ error: "Internal server error" }).code(500);
  }
};

const fetchAllPeople = async (request, h) => {
  try {
    const employeeTypeRepo = AppDataSource.getRepository(EmployeeType);

    const employeeTypeData = await employeeTypeRepo.find({
      where: {
        name: Not(In(["Hr", "Director"])),
        status: status.Active.toString(),
      },
      relations: ["employee", "employee.manager"],
    });

    if (!employeeTypeData) {
      return h.response({ message: "Data not Found" }).code(404);
    }

    const transformed = employeeTypeData.flatMap((designationObj) => {
      return designationObj.employee
        .filter((emp) => emp.status === status.Active)
        .map((emp) => ({
          id: emp.id,
          name: emp.name,
          email: emp.email,
          designation: designationObj.name,
          empTypeId: designationObj.id,
          manager_name: emp.manager ? emp.manager.name : null,
          manager_id: emp.manager ? emp.manager.id : null,
        }));
    });

    return h.response(transformed).code(200);
  } catch (err) {
    console.log(err);
    return h.response({ message: "Internal Server Error" }).code(500);
  }
};
const updateEmployee = async (request, h) => {
  try {
    const { employee_id, name, email, emp_type_id, manager_id } =
      request.payload;

    if (!employee_id) {
      return h.response({ message: "Employee ID is required" }).code(400);
    }

    const employeeRepo = AppDataSource.getRepository(Employee);

    const employee = await employeeRepo.findOne({ where: { id: employee_id } });

    if (!employee) {
      return h.response({ message: "Employee not found" }).code(404);
    }

    if (name) employee.name = name;
    if (email) employee.email = email;
    if (emp_type_id) employee.emp_type_id = emp_type_id;
    if (manager_id) employee.manager_id = manager_id;

    await employeeRepo.save(employee);

    return h
      .response({
        message: "Employee updated successfully",
        data: {
          employee_id: employee.id,
          name: employee.name,
          email: employee.email,
          manager_id: employee.manager_id,
          designation: employee.emp_type_id,
        },
      })
      .code(201);
  } catch (err) {
    console.error("Error updating employee:", err);
    return h.response({ message: "Failed to update employee" }).code(500);
  }
};

const deleteEmployee = async (request, h) => {
  try {
    const { employee_id } = request.payload;
    if (!employee_id) {
      return h.response({ message: "Employee ID is required" }).code(400);
    }

    const employeeRepo = AppDataSource.getRepository(Employee);
    const leaveRemainingRepo = AppDataSource.getRepository(LeaveRemaining);
    const leaveRequestRepo = AppDataSource.getRepository(LeaveRequest);
    const approvalFlowRepo = AppDataSource.getRepository(ApprovalFlow);

    const employeeData = await employeeRepo.findOne({
      where: { id: employee_id },
    });
    if (!employeeData) {
      return h.response({ message: "Data not found" }).code(404);
    }

    employeeData.status = status.Inactive;
    await employeeRepo.save(employeeData);

    const leaveRequestData = await leaveRequestRepo.find({
      where: { employee_id },
    });
    const leaveIds = leaveRequestData.map((leave) => leave.id);

    if (leaveIds.length > 0) {
      const allFlows = await approvalFlowRepo.find({
        where: { leave_id: In(leaveIds) },
      });
      allFlows.forEach((flow) => (flow.status = status.Inactive));
      await approvalFlowRepo.save(allFlows);

      leaveRequestData.forEach((leave) => (leave.status = status.Inactive));
      await leaveRequestRepo.save(leaveRequestData);
    }

    const leaveRemainingData = await leaveRemainingRepo.find({
      where: { employee_id },
    });
    leaveRemainingData.forEach((leave) => (leave.status = status.Inactive));
    await leaveRemainingRepo.save(leaveRemainingData);

    const approvalFlowData = await approvalFlowRepo.find({
      where: { approver_id: employee_id },
    });
    approvalFlowData.forEach((flow) => (flow.status = status.Inactive));
    await approvalFlowRepo.save(approvalFlowData);

    return h.response({ message: "Delete successfully" }).code(200);
  } catch (err) {
    console.log(err);
    return h.response({ message: "Failed to Delete employee" }).code(500);
  }
};

const fetchSeniorLevelEmployees = async (request, h) => {
  try {
    const employeeRepo = AppDataSource.getRepository(Employee);
    const employeeData = await employeeRepo
      .createQueryBuilder("employee")
      .leftJoinAndSelect("employee.employeeType", "employeeType")
      .where("employee.status = :status", { status: status.Active.toString() })
      .andWhere(`LOWER(employeeType.name) LIKE :senior`)
      .orWhere(`LOWER(employeeType.name) LIKE :hr`)
      .orWhere(`LOWER(employeeType.name) LIKE :director`)
      .setParameters({
        senior: "%senior%",
        hr: "%hr%",
        director: "%director%",
      })
      .getMany();
    if (!employeeData) {
      return h.response({ message: "Data not found" }).code(404);
    }
    const transformData = employeeData.map((each) => ({
      employeeId: each.id,
      name: each.name,
      designation: each.employeeType.name,
    }));
    console.log(transformData);
    return h.response(transformData).code(200);
  } catch (err) {
    console.log(err);
    return h.response({ message: "Failed to Delete employee" }).code(500);
  }
};
module.exports = {
  createEmployee,
  loginEmployee,
  fetchAllPeople,
  updateEmployee,
  deleteEmployee,
  fetchSeniorLevelEmployees,
  changePassword,
};
