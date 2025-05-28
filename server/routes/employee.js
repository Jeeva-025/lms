const employeeController = require("../controllers/Employee");
const LeaveRequestController = require("../controllers/LeaveRequest");
const LeaveTypeController = require("../controllers/LeaveType");
const LeaveremainingController = require("../controllers/LeaveRemaining");
const LeaveRemaining = require("../models/entities/leaveRemaining");

const employeeCreate = {
  method: "POST",
  path: "/employee/create",
  handler: employeeController.createEmployee,
};

const allPeople = {
  method: "GET",
  path: "/employee/people",
  handler: employeeController.fetchAllPeople,
};

const employeeLogin = {
  method: "POST",
  path: "/login",
  options: {
    auth: false,
  },
  handler: employeeController.loginEmployee,
};

const createLeaveRequest = {
  method: "POST",
  path: "/leaveRequest",
  handler: LeaveRequestController.createLeaveRequest,
};

const cancelLeaveRequest = {
  method: "PATCH",
  path: "/cancelLeave/{id}",
  handler: LeaveRequestController.cancelLeaveRequest,
};
const rejectLeaveRequest = {
  method: "PATCH",
  path: "/rejectLeave/{id}",
  handler: LeaveRequestController.rejectLeaveRequest,
};

const fetchLeaveHistory = {
  method: "POST",
  path: "/fetchEmployeesLeaveHistory",
  handler: LeaveRequestController.fetchEmployeeLeaveHistory,
};

const leaveApproval = {
  method: "POST",
  path: "/leaveApproval",
  handler: LeaveRequestController.approvalOfLeave,
};
const fetchLeaveType = {
  method: "GET",
  path: "/allLeaveType",
  handler: LeaveTypeController.fetchAllTypeOfLeave,
};

const leaveRemainingForAnEmployee = {
  method: "GET",
  path: "/employee/leaves/{employee_id}",
  handler: LeaveremainingController.fetchLeaveDetailsForEmployee,
};
const countLeaveRequestByType = {
  method: "POST",
  path: "/employee/noof/requestbystatus",
  handler: LeaveRequestController.fetchNoOfRequestByStatus,
};

const fetchAllRequestToManager = {
  method: "GET",
  path: "/allrequestedLeavetoManager",
  handler: LeaveRequestController.fetchLeaveRequestToManager,
};
const fetchAllRequestToHr = {
  method: "GET",
  path: "/allrequestedLeavetoHR",
  handler: LeaveRequestController.fetchLeaveRequestToHR,
};

const fetchAllRequestToDirector = {
  method: "GET",
  path: "/allrequestedLeavetoDirector",
  handler: LeaveRequestController.fetchLeaveRequestToDirector,
};
const fetchLeaveHistoryToAdmin = {
  method: "POST",
  path: "/fetchLeaveHistoryToAdmin",
  handler: LeaveRequestController.fetchLeaveRequestHistory,
};

module.exports = [
  employeeCreate,
  employeeLogin,
  createLeaveRequest,
  cancelLeaveRequest,
  rejectLeaveRequest,
  fetchLeaveHistory,
  leaveApproval,
  allPeople,
  fetchLeaveType,
  leaveRemainingForAnEmployee,
  countLeaveRequestByType,
  fetchAllRequestToDirector,
  fetchAllRequestToManager,
  fetchAllRequestToHr,
  fetchLeaveHistoryToAdmin,
];
