const employeeController = require("../controllers/Employee");
const validate = require("../validate/employeeTypeValidation");
const employeeValidate = require("../validate/employeeValidation");

const employeeRoute = [
  {
    method: "POST",
    path: "/employee-create",
    options: {
      handler: employeeController.createEmployee,
      validate: {
        payload: employeeValidate.validateEmployeeInsert,
        failAction: (request, h, err) => {
          return h.response({ message: err.message }).code(400).takeover();
        },
      },
    },
  },
  {
    method: "POST",
    path: "/employee-login",
    options: {
      handler: employeeController.loginEmployee,
      auth: false,
      validate: {
        payload: employeeValidate.loginData,
        failAction: (request, h, err) => {
          return h.response({ message: err.message }).code(400).takeover();
        },
      },
    },
  },
  {
    method: "GET",
    path: "/senior-employee",
    handler: employeeController.fetchSeniorLevelEmployees,
  },
  {
    method: "GET",
    path: "/all-employee",
    handler: employeeController.fetchAllPeople,
  },
  {
    method: "POST",
    path: "/update-employee",
    options: {
      handler: employeeController.updateEmployee,
      validate: {
        payload: employeeValidate.updateEmployee,
        failAction: (request, h, err) => {
          return h.response({ message: err.message }).code(400).takeover();
        },
      },
    },
  },

  {
    method: "POST",
    path: "/change-password",
    handler: employeeController.changePassword,
  },
  {
    method: "PATCH",
    path: "/employee-destroy",
    options: {
      handler: employeeController.deleteEmployee,
      validate: {
        payload: employeeValidate.employeeId,
        failAction: (request, h, err) => {
          return h.response({ message: err.message }).code(400).takeover();
        },
      },
    },
  },
];

module.exports = employeeRoute;
