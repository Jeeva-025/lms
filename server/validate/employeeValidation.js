const Joi = require("joi");
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

module.exports = validate;
