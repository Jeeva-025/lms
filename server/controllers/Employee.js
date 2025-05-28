const AppDataSource = require("../models/dbconfig");
const Employee = require("../models/entities/employee");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const LeaveRemaining = require("../models/entities/leaveRemaining");

dotenv.config();
const createEmployee = async (request, h) => {
  try {
    const {
      name,
      designation,
      hr_id,
      manager_id,
      director_id,
      email,
      type,
      password,
    } = request.payload;
    const employee = AppDataSource.getRepository(Employee);
    const generateRandomNumber = () => {
      return Math.floor(1000 + Math.random() * 9000);
    };
    const hashPassword = async (password) => {
      const salt = await bcrypt.genSalt(10);
      const pass = await bcrypt.hash(password, salt);
      return pass;
    };
    const employee_id = generateRandomNumber();
    const hasPassword = await hashPassword(password);
    const emp = employee.create({
      employee_id,
      name,
      designation,
      hr_id,
      manager_id,
      director_id,
      email,
      type,
      password: hasPassword,
    });
    const savedEmployee = await employee.save(emp);

    const leaveRemaining = AppDataSource.getRepository(LeaveRemaining);
    const data = leaveRemaining.create({
      employee_id,
      no_of_leave_taken: 0,
      total_leave: 20,
      no_of_sick_leave: 0,
      no_of_casual_leave: 0,
      no_of_earned_leave: 0,
    });
    await leaveRemaining.save(data);

    return h
      .response({ message: "Employee has been created successfully" })
      .code(201);
  } catch (err) {
    console.log("Error while crating", err);
    return h.response({ error: "Failed to create employee" }).code(500);
  }
};

const loginEmployee = async (request, h) => {
  try {
    const { email, password } = request.payload;
    const employeeRepository = AppDataSource.getRepository(Employee);

    const employee = await employeeRepository.findOneBy({ email });
    if (!employee) {
      return h.response({ error: "Invalid email or password" }).code(401);
    }

    const isPasswordValid = await bcrypt.compare(password, employee.password);
    if (!isPasswordValid) {
      return h.response({ error: "Invalid email or password" }).code(401);
    }
    const token = jwt.sign(
      {
        employee_id: employee.employee_id,
        email: employee.email,
        type: employee.type,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: process.env.JWT_EXPIRATION }
    );
    console.log(employee);

    return h
      .response({
        message: "Login successful",
        token,
        employee: {
          id: employee.employee_id,
          name: employee.name,
          email: employee.email,
          type: employee.type,
          designation: employee.designation,
          hrId: employee.hr_id,
          managerId: employee.manager_id,
          directorId: employee.director_id,
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
    const { name } = request.query;
    const employee = AppDataSource.getRepository(Employee);
    const data = await employee.find({ where: { designation: name } });
    if (!data) return h.response({ message: "Data not found" }).code(200);

    return h.response(data).code(200);
  } catch (err) {
    console.log(err);
    return h.response({ message: "Failed to fetch Data" }).code(500);
  }
};

module.exports = {
  createEmployee,
  loginEmployee,
  fetchAllPeople,
};
