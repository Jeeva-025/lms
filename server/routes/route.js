const employeeTypeRoutes = require("./employeeType");
const employeeRoutes = require("./employee");
const leaveRemainingRoutes = require("./leaveRemaining");
const leaveTypeRoutes = require("./leaveType");
const leaveRequestRoutes = require("./leaveRequest");
const holidayRoutes = require("./holiday");
const approvalFlowRoutes = require("./approvalFlow");
module.exports = [
  ...employeeTypeRoutes,
  ...employeeRoutes,
  ...leaveRemainingRoutes,
  ...leaveTypeRoutes,
  ...leaveRequestRoutes,
  ...holidayRoutes,
  ...approvalFlowRoutes,
];
