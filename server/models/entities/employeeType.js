const { EntitySchema } = require("typeorm");

const status = {
  Active: 200,
  Inactive: 400,
};
const EmployeeType = new EntitySchema({
  name: "EmployeeType",
  tableName: "employee_types",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    name: {
      type: "varchar",
      nullable: false,
    },
    description: {
      type: "text",
      nullable: true,
    },
    status: {
      type: "enum",
      enum: Object.values(status),
      default: status.Active,
    },
  },
  relations: {
    employee: {
      target: "Employee",
      type: "one-to-many",
      inverseSide: "employeeType",
    },
    leavePolicy: {
      target: "LeavePolicy",
      type: "one-to-many",
      inverseSide: "employeeType",
    },
  },
});

module.exports = EmployeeType;
