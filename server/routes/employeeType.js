const employeeTypeConroller = require("../controllers/EmployeeType");
const employeeTypeValidate = require("../validate/employeeTypeValidation");

const employeeTypeRoutes = [
  {
    method: "POST",
    path: "/employee-type/insert-employee-type",
    options: {
      handler: employeeTypeConroller.addEmployeeType,
      validate: {
        payload: employeeTypeValidate.validateEmployeeTypeInsert,
        failAction: (request, h, err) => {
          return h.response({ message: err.message }).code(400).takeover();
        },
      },
    },
  },
  {
    method: "GET",
    path: "/employee-type/all",
    handler: employeeTypeConroller.fetchAllEmployeeType,
  },
];

module.exports = employeeTypeRoutes;
