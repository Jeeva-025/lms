const leaveReminingController = require("../controllers/LeaveRemaining");
const leaveRemainingValidate = require("../validate/leaveRemainingValidation");
const leaveRemainingRoutes = [
  {
    method: "GET",
    path: "/employee-leave/{employee_id}",
    options: {
      handler: leaveReminingController.fetchLeaveDetailsForEmployee,
      validate: {
        params: leaveRemainingValidate.validateEmployeeLeave,
        failAction: (request, h, err) => {
          return h.response({ message: err.message }).code(400).takeover();
        },
      },
    },
  },
];

module.exports = leaveRemainingRoutes;
