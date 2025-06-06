const leaveTypeController = require("../controllers/LeaveType");

const leaveTypeRoutes = [
  {
    method: "GET",
    path: "/all-leave",
    handler: leaveTypeController.fetchAllTypeOfLeave,
  },
];

module.exports = leaveTypeRoutes;
