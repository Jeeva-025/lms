const { AppDataSource } = require("../models/dbconfig");
const LeaveRemaining = require("../models/entities/leaveBalance");
const LeaveType = require("../models/entities/leaveType");

const fetchLeaveDetailsForEmployee = async (request, h) => {
  try {
    const { employee_id } = request.params;
    console.log("Hello from leave Remainings");

    const leaveRemainingRepo = AppDataSource.getRepository(LeaveRemaining);
    const leaveRemainingData = await leaveRemainingRepo.find({
      where: { employee_id },
    });

    if (!leaveRemainingData) {
      return h.response({ message: "Data not found" }).code(404);
    }

    let casualLeaveAvailable = 0;
    let earnedLeaveAvailable = 0;
    let sickLeaveAvailable = 0;

    for (const element of leaveRemainingData) {
      switch (element.leave_type_id) {
        case 1:
          earnedLeaveAvailable =
            element.total_leaves - element.no_of_leave_taken || 0;
          break;
        case 2:
          casualLeaveAvailable =
            element.total_leaves - element.no_of_leave_taken || 0;
          break;
        case 3:
          sickLeaveAvailable =
            element.total_leaves - element.no_of_leave_taken || 0;
          break;
        default:
          break;
      }
    }

    const data = {
      availableLeave:
        earnedLeaveAvailable + casualLeaveAvailable + sickLeaveAvailable,
      earnedLeaveAvailable,
      casualLeaveAvailable,
      sickLeaveAvailable,
    };

    return h.response({ message: "Data fetched successfully", data }).code(200);
  } catch (err) {
    console.error(err);
    return h.response({ error: "Internal Server Error" }).code(500);
  }
};

module.exports = { fetchLeaveDetailsForEmployee };
