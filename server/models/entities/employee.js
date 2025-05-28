const { EntitySchema } = require("typeorm");
const LeaveRequest = require("../entities/leaveRequest");

const Employee = new EntitySchema({
  name: "Employee",
  tableName: "employees",
  columns: {
    employee_id: {
      type: "int",
      unique: true,
      primary: true,
      nullable: false,
    },
    name: {
      type: "varchar",
      nullable: false,
    },
    designation: {
      type: "varchar",
      nullable: false,
    },
    employment_status: {
      type: "varchar",
      nullable: false,
      default: "ACTIVE",
    },
    hr_id: {
      type: "int",
      nullable: true,
    },
    manager_id: {
      type: "int",
      nullable: true,
    },
    director_id: {
      type: "int",
      nullable: true,
    },
    email: {
      type: "varchar",
      unique: true,
      length: 100,
      nullable: false,
    },
    password: {
      type: "varchar",
      nullable: false,
    },
    type: {
      type: "varchar",
      nullable: false,
    },
  },
  relations: {
    leaveRequest: {
      target: "LeaveRequest",
      type: "one-to-many",
      inverseSide: "employee",
    },
  },
});
module.exports = Employee;
