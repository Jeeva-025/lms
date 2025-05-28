const AppDataSource = require("../models/dbconfig");
const LeaveRemaining = require("../models/entities/leaveRemaining");

const fetchLeaveDetailsForEmployee = async (request, h) => {
  try {
    const { employee_id } = request.params;
    const leaveRemainingRepo = AppDataSource.getRepository(LeaveRemaining);
    const data = await leaveRemainingRepo.findOne({ where: { employee_id } });
    if (!data) {
      return h.response({ message: "Data not found" }).code(404);
    }
    return h.response({ message: "Data fetched Successfully", data }).code(200);
  } catch (err) {
    console.log(err);
    return h.response({ error: "Internal server error" }).code(500);
  }
};

module.exports = { fetchLeaveDetailsForEmployee };
