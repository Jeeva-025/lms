const leaveRequestController = require("../controllers/LeaveRequest");
const validate = require("../validate/employeeTypeValidation");
const leaveRequestValidation = require("../validate/leaveRequestValidation");
const leaveRequestRoutes = [
  {
    method: "POST",
    path: "/leave-request-create",
    options: {
      handler: leaveRequestController.createLeaveRequest,
      validate: {
        payload: leaveRequestValidation.validateLeaveRequest,
        failAction: (request, h, err) => {
          return h.response({ message: err.message }).code(400).takeover();
        },
      },
    },
  },
  {
    method: "GET",
    path: "/all-requestedLeave-for-approval",
    options: {
      handler: leaveRequestController.fetchLeaveRequestForApproval,
      validate: {
        query: leaveRequestValidation.validateManagerId,
        failAction: (request, h, err) => {
          return h.response({ message: err.message }).code(400).takeover();
        },
      },
    },
  },
  {
    method: "GET",
    path: "/all-employeee-leave-request/{employee_id}",
    options: {
      handler: leaveRequestController.fetchEmployeeLeaveHistory,
      validate: {
        params: leaveRequestValidation.validateEmployeeId,
        failAction: (request, h, err) => {
          return h.response({ message: err.message }).code(400).takeover();
        },
      },
    },
  },

  {
    method: "GET",
    path: "/leave-request-history/{employee_id}",
    options: {
      handler: leaveRequestController.fetchLeaveRequestHistory,
      validate: {
        params: leaveRequestValidation.validateEmployeeId,
        failAction: (request, h, err) => {
          return h.response({ message: err.message }).code(400).takeover();
        },
      },
    },
  },

  {
    method: "PATCH",
    path: "/approval-of-leave",
    options: {
      handler: leaveRequestController.approvalOfLeave,
      validate: {
        payload: leaveRequestValidation.validateId,
        failAction: (request, h, err) => {
          return h.response({ message: err.message }).code(400).takeover();
        },
      },
    },
  },
  {
    method: "GET",
    path: "/team-members-leave/{id}",
    options: {
      handler: leaveRequestController.fetchTeamMemberLeaves,
      validate: {
        params: leaveRequestValidation.validateId,
        failAction: (request, h, err) => {
          return h.response({ message: err.message }).code(400).takeover();
        },
      },
    },
  },
];

module.exports = leaveRequestRoutes;
