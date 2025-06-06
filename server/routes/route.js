const employeeTypeRoutes = require("./employeeType");
const employeeRoutes = require("./employee");
const leaveRemainingRoutes = require("./leaveRemaining");
const leaveTypeRoutes = require("./leaveType");
const leaveRequestRoutes = require("./leaveRequest");
module.exports = [
  ...employeeTypeRoutes,
  ...employeeRoutes,
  ...leaveRemainingRoutes,
  ...leaveTypeRoutes,
  ...leaveRequestRoutes,
];
