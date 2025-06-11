const Joi = require("joi");
const { approvalStatus } = require("../utils/constant");
const { employeeId } = require("./employeeValidation");

const validate = {};
validate.validateLeaveRequest = Joi.object({
  leave_id: Joi.number().required(),
  employee_id: Joi.number().required(),
  reason: Joi.string().required(),
  start_date: Joi.date().required(),
  end_date: Joi.date().required(),
  manager_id: Joi.number().required(),
});

validate.validateManagerId = Joi.object({
  id: Joi.number().required(),
});
validate.validateEmployeeId = Joi.object({
  employee_id: Joi.number().required(),
  start_date: Joi.date(),
  end_date: Joi.date(),
  approvalStatus: Joi.string(),
  leave_type_id: Joi.number(),
}).unknown(true);

validate.validateId = Joi.object({
  id: Joi.number().required(),
});
validate.rejectRequest = Joi.object({
  id: Joi.number().required(),
  approver_id: Joi.number().required(),
});

validate.noOfLeaveRequestByStatus = Joi.object({
  employee_id: Joi.number().required(),
  approval_status: Joi.string().required(),
});

module.exports = validate;
