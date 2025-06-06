const { AppDataSource } = require("../models/dbconfig");
const { generateRandomNumber } = require("../utils/helper");
const Employee = require("../models/entities/employee");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const LeaveRemaining = require("../models/entities/leaveBalance");
const LeaveRequest = require("../models/entities/leaveRequest");
const EmployeeType = require("../models/entities/employeeType");
const LeaveType = require("../models/entities/employeeType");
const LeavePolicy = require("../models/entities/leavePolicy");

dotenv.config();

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};
const createEmployee = async (request, h) => {
  const status = {
    Active: "200",
    Inactive: "400",
  };
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
        status: status.Active,
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

const loginEmployee = async (request, h) => {
  try {
    const { email, password } = request.payload;
    const employeeRepo = AppDataSource.getRepository(Employee);

    const employeeData = await employeeRepo.findOne({
      where: { email },
      relations: ["employeeType"],
    });

    if (!employeeData) {
      return h.response({ error: "Invalid email or password" }).code(401);
    }
    console.log(employeeData);

    const isPasswordValid = await bcrypt.compare(
      password,
      employeeData.password
    );
    if (!isPasswordValid) {
      return h.response({ error: "Invalid email or password" }).code(401);
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
    const employeeRepo = AppDataSource.getRepository(Employee);
    const employeeData = await employeeRepo.find();
    if (!employeeData) {
      return h.response({ message: "Data not found" }).code(404);
    }
    return h.response(employeeData).code(200);
  } catch (err) {
    console.log(err);
    return h.response({ message: "Failed to fetch Data" }).code(500);
  }
};
// const fetchAllPeople = async (request, h) => {
//   try {
//     const { name } = request.query;
//     const employeeRepo = AppDataSource.getRepository(Employee);
//     const data = await employeeRepo.find({ where: { designation: name } });
//     if (!data) return h.response({ message: "Data not found" }).code(404);

//     return h.response(data).code(200);
//   } catch (err) {
//     console.log(err);
//     return h.response({ message: "Failed to fetch Data" }).code(500);
//   }
// };
const fetchAllPeopleByHrId = async (request, h) => {
  try {
    const { hr_id } = request.params;
    const employeeRepo = AppDataSource.getRepository(Employee);
    const data = await employeeRepo.find({
      where: { hr_id, employment_status: "ACTIVE" },
    });
    if (!data) return h.response({ message: "Data not found" }).code(404);
    return h.response(data).code(200);
  } catch (err) {
    console.log(err);
    return h.response({ message: "Failed to fetch Data" }).code(500);
  }
};
const updateEmployee = async (request, h) => {
  try {
    const {
      employee_id,
      name,
      email,
      designation,
      hr_id,
      manager_id,
      director_id,
    } = request.payload;

    if (!employee_id) {
      return h.response({ message: "Employee ID is required" }).code(400);
    }

    const employeeRepo = AppDataSource.getRepository(Employee);

    const employee = await employeeRepo.findOne({ where: { employee_id } });

    if (!employee) {
      return h.response({ message: "Employee not found" }).code(404);
    }

    if (name) employee.name = name;
    if (email) employee.email = email;
    if (designation) employee.designation = designation;
    if (hr_id) employee.hr_id = hr_id;
    if (manager_id) employee.manager_id = manager_id;
    if (director_id) employee.director_id = director_id;

    await employeeRepo.save(employee);

    return h
      .response({
        message: "Employee updated successfully",
        data: {
          employee_id: employee.employee_id,
          name: employee.name,
          email: employee.email,
        },
      })
      .code(200);
  } catch (err) {
    console.error("Error updating employee:", err);

    if (err.name === "QueryFailedError") {
      return h.response({ message: "Database error occurred" }).code(500);
    }

    return h.response({ message: "Failed to update employee" }).code(500);
  }
};

const deleteEmployee = async (request, h) => {
  try {
    const { employee_id } = request.params;
    if (!employee_id) {
      return h.response({ message: "Employee ID is required" }).code(400);
    }
    const employeeRepo = AppDataSource.getRepository(Employee);
    const leaveRemainingRepo = AppDataSource.getRepository(LeaveRemaining);
    const leaveRequestRepo = AppDataSource.getRepository(LeaveRequest);
    const employeeData = await employeeRepo.findOne({ where: { employee_id } });
    if (!employeeData) {
      return h.response({ message: "Data not found" }).code(404);
    }
    const leaveRequestData = await leaveRequestRepo.find({
      where: { employee_id },
    });
    employeeData.employment_status = "INACTIVE";
    await employeeRepo.save(employeeData);
    if (leaveRequestData.length > 0) {
      const updatedData = leaveRequestData.map((leave) => {
        leave.status = "INACTIVE";
        return leave;
      });
      await leaveRequestRepo.save(updatedData);
    }
    const leaveRemainingData = await leaveRemainingRepo.findOne({
      where: { employee_id },
    });
    if (leaveRemainingData) {
      leaveRemainingData.status = "INACTIVE";
      await leaveRemainingRepo.save(leaveRemainingData);
    }
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
      .where(`LOWER(employeeType.name) LIKE :senior`)
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
  fetchAllPeopleByHrId,
  updateEmployee,
  deleteEmployee,
  fetchSeniorLevelEmployees,
};
