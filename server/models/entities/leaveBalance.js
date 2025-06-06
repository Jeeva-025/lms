const { EntitySchema } = require("typeorm");

const status = {
  Active: 200,
  Inactive: 400,
};
const LeaveBalance = new EntitySchema({
  name: "LeaveBalance",
  tableName: "leave_balances",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    employee_id: {
      type: "int",
      nullable: false,
    },
    leave_type_id: {
      type: "int",
      nullable: false,
    },
    year: {
      type: "int",
      nullable: false,
    },
    no_of_leave_taken: {
      type: "int",
      nullable: false,
    },
    total_leaves: {
      type: "int",
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
    employee: {
      target: "Employee",
      type: "many-to-one",
      joinColumn: {
        name: "employee_id",
        referencedColumnName: "id",
      },
      nullable: false,
      onDelete: "RESTRICT",
    },
  },
});
module.exports = LeaveBalance;
