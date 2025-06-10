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
    path: "/all-employee-leave-request",
    options: {
      handler: leaveRequestController.fetchEmployeeLeaveHistory,
      validate: {
        query: leaveRequestValidation.validateEmployeeId,
        failAction: (request, h, err) => {
          return h.response({ message: err.message }).code(400).takeover();
        },
      },
    },
  },

  {
    method: "GET",
    path: "/leave-request-history/{id}",
    options: {
      handler: leaveRequestController.fetchLeaveRequestHistory,
      validate: {
        params: leaveRequestValidation.validateId,
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
  {
    method: "GET",
    path: "/all-approved-leave-date/{id}",
    options: {
      handler: leaveRequestController.fetchApprovedLeaveDate,
      validate: {
        params: leaveRequestValidation.validateId,
        failAction: (request, h, err) => {
          return h.response({ message: err.message }).code(400).takeover();
        },
      },
    },
  },
  {
    method: "PATCH",
    path: "/reject-leave-request",
    options: {
      handler: leaveRequestController.rejectLeaveRequest,
      validate: {
        payload: leaveRequestValidation.rejectRequest,
        failAction: (request, h, err) => {
          return h.response({ message: err.message }).code(400).takeover();
        },
      },
    },
  },

  {
    method: "PATCH",
    path: "/cancel-leave",
    options: {
      handler: leaveRequestController.cancelLeaveRequest,
      validate: {
        payload: leaveRequestValidation.validateId,
        failAction: (request, h, err) => {
          return h.response({ message: err.message }).code(400).takeover();
        },
      },
    },
  },
];

module.exports = leaveRequestRoutes;
