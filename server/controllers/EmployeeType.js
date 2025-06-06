const { AppDataSource } = require("../models/dbconfig");
const EmployeeType = require("../models/entities/employeeType");
const { Not } = require("typeorm");

const addEmployeeType = async (request, h) => {
  try {
    const { name } = request.payload;
    const employeeTypeRepo = AppDataSource.getRepository(EmployeeType);
    const employeeData = employeeTypeRepo.create({ name });
    await employeeTypeRepo.save(employeeData);
    return h.response({ meassge: "Created successfully" }).code(201);
  } catch (err) {
    console.log(err);
    return h.response({ meassge: "Internal Server Failed" });
  }
};

const fetchAllEmployeeType = async (request, h) => {
  try {
    const status = {
      Active: "200",
      Inactive: "400",
    };
    const employeeTypeRepo = AppDataSource.getRepository(EmployeeType);
    const employeeData = await employeeTypeRepo.find({
      where: {
        status: status.Active,
        name: Not("Director"),
      },
    });
    if (!employeeData) {
      return h.response({ message: "Data not Found" }).code(404);
    }
    const transfromData = employeeData.map((each) => ({
      employeeTypeId: each.id,
      name: each.name,
    }));
    console.log(transfromData);
    return h.response(transfromData).code(200);
  } catch (err) {
    console.log(err);
    return h.response({ meassge: "Internal Server Failed" });
  }
};

module.exports = { addEmployeeType, fetchAllEmployeeType };
