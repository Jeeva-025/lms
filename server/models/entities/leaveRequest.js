const { EntitySchema } = require("typeorm");
const employee = require("../../routes/employee");

const LeaveRequest = new EntitySchema({
  name: "LeaveRequest",
  tableName: "leave_requests",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    leave_id: {
      type: "int",
      nullable: false,
    },
    employee_id: {
      type: "int",
      nullable: false,
    },
    reason: {
      type: "varchar",
      nullable: false,
    },
    start_date: {
      type: "date",
      nullable: false,
    },
    end_date: {
      type: "date",
      nullable: false,
    },
    is_sick_leave: {
      type: "boolean",
      nullable: false,
      default: false,
    },
    approval_status: {
      type: "varchar",
      nullable: false,
      default: "PENDING",
    },
    status: {
      type: "varchar",
      nullable: false,
      default: "ACTIVE",
    },
    no_of_approval_need: {
      type: "int",
      nullable: true,
    },
    no_of_approval_permitted: {
      type: "int",
      nullable: true,
    },
  },
  relations: {
    employee: {
      target: "Employee",
      type: "many-to-one",
      joinColumn: {
        name: "employee_id",
        referencedColumnName: "employee_id",
      },
      nullable: false,
      onDelete: "RESTRICT",
    },
    leaveType: {
      target: "LeaveType",
      type: "many-to-one",
      joinColumn: {
        name: "leave_id",
      },
      nullable: false,
      onDelete: "RESTRICT",
    },
  },
});

module.exports = LeaveRequest;
