const Joi = require("joi");
const Employee = require("../models/entities/employee");
const validate = {};
validate.validateEmployeeInsert = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  emp_type_id: Joi.number().required(),
  password: Joi.string().required(),
  manager_id: Joi.number().required(),
});
validate.loginData = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
validate.updateEmployee = Joi.object({
  employee_id: Joi.number().required(),
  name: Joi.string(),
  email: Joi.string().email(),
  emp_type_id: Joi.number(),
  manager_id: Joi.number(),
}).unknown(true);

validate.employeeId = Joi.object({
  employee_id: Joi.number().required(),
});

module.exports = validate;
