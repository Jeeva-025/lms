const Joi = require("joi");
const employeeRoute = require("../routes/employee");
const validate = {};

validate.validateEmployeeLeave = Joi.object({
  employee_id: Joi.number().required(),
});
module.exports = validate;
