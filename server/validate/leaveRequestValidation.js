const Joi = require("joi");

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
});

validate.validateId = Joi.object({
  id: Joi.number().required(),
});

module.exports = validate;
