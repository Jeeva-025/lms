const Joi = require("joi");
const validate = {};
validate.validatePeopleInsert = Joi.object({
  user_name: Joi.string().required(),
  email: Joi.string().email().required(),
  mobile_number: Joi.string().required(),
  designation: Joi.string().required(),
  type: Joi.string().required(),
});

validate.validateEmployeeTypeInsert = Joi.object({
  name: Joi.string().required(),
});

module.exports = validate;
