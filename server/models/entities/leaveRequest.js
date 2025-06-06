const { EntitySchema } = require("typeorm");
const employee = require("../../routes/employee");

const status = {
  Active: 200,
  Inactive: 400,
};
const approvalStatus = {
  Approved: 0,
  Rejected: 1,
  Pending: 2,
  Cancelled: 3,
};

const LeaveRequest = new EntitySchema({
  name: "LeaveRequest",
  tableName: "leave_requests",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    leave_type_id: {
      type: "int",
      nullable: false,
    },
    employee_id: {
      type: "int",
      nullable: false,
    },
    reason: {
      type: "text",
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
    approval_status: {
      type: "enum",
      enum: Object.values(approvalStatus),
      default: approvalStatus.Pending,
    },
    status: {
      type: "enum",
      enum: Object.values(status),
      default: status.Active,
    },
    no_of_approval_need: {
      type: "int",
      nullable: false,
    },
    no_of_approval_permitted: {
      type: "int",
      nullable: false,
    },
    requested_at: {
      type: "datetime",
      default: () => "CURRENT_TIMESTAMP",
      nullable: false,
    },
  },
  relations: {
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
    approvalFlow: {
      target: "ApprovalFlow",
      type: "one-to-many",
      inverseSide: "leaveRequest",
    },
  },
});

module.exports = LeaveRequest;
