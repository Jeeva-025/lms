const { EntitySchema } = require("typeorm");
const employee = require("../../routes/employee");
const status = {
  Active: 200,
  Inactive: 400,
};
const LeavePolicy = new EntitySchema({
  name: "LeavePolicy",
  tableName: "leave_policies",
  columns: {
    id: {
      type: "int",
      primary: true,
      unique: true,
      generated: true,
    },
    employee_type_id: {
      type: "int",
      nullable: false,
    },
    leave_type_id: {
      type: "int",
      nullable: false,
    },
    max_days_per_year: {
      type: "int",
      nullable: false,
    },
    name: {
      type: "varchar",
      nullable: false,
    },
    accrual_per_month: {
      type: "decimal",
      precision: 10,
      scale: 4,
      nullable: false,
    },
    status: {
      type: "enum",
      enum: Object.values(status),
      default: status.Active,
    },
  },
  relations: {
    leaveType: {
      target: "LeaveType",
      type: "many-to-one",
      joinColumn: {
        name: "leave_type_id",
        referencedColumnName: "id",
      },
      nullable: false,
      onDelete: "RESTRICT",
    },
    employeeType: {
      target: "EmployeeType",
      type: "many-to-one",
      joinColumn: {
        name: "employee_type_id",
        referencedColumnName: "id",
      },
      nullable: false,
      onDelete: "RESTRICT",
    },
  },
});

module.exports = LeavePolicy;
