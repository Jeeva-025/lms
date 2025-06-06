const { AppDataSource } = require("../models/dbconfig");
const LeaveType = require("../models/entities/leaveType");

const fetchAllTypeOfLeave = async (request, h) => {
  try {
    const leaveTypeRepo = AppDataSource.getRepository(LeaveType);
    const leaveTypeData = await leaveTypeRepo.find();
    console.log(leaveTypeData);
    if (!leaveTypeData) {
      return h.response({ message: "No Data Found" }).code(200);
    }
    return h.response(leaveTypeData).code(200);
  } catch (err) {
    console.log(err);
    return h.response({ message: "Failed to fetch data" }).code(500);
  }
};

module.exports = { fetchAllTypeOfLeave };
