const approvalFlowController = require("../controllers/ApprovalFlow");
const approvalFlowValidation = require("../validate/leaveRequestValidation");

const approvalFlowRoutes = [
  {
    method: "GET",
    path: "/all-requested-approval/{id}",
    options: {
      handler: approvalFlowController.fetchAllApprovalRequestByLeaveId,
      validate: {
        params: approvalFlowValidation.validateId,
        failAction: (request, h, err) => {
          return h.response({ message: err.message }).code(400).takeover();
        },
      },
    },
  },
];

module.exports = approvalFlowRoutes;
