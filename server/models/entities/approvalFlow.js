const { EntitySchema } = require("typeorm");

const approvalStatus = {
  Approved: 0,
  Rejected: 1,
  Pending: 2,
  Cancelled: 3,
};
const status = {
  Active: 200,
  Inactive: 400,
};

const ApprovalFlow = new EntitySchema({
  name: "ApprovalFlow",
  tableName: "approval_flows",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
      unique: true,
    },
    leave_id: {
      type: "int",
      nullable: false,
    },
    approver_id: {
      type: "int",
      nullable: false,
    },
    approval_status: {
      type: "enum",
      enum: Object.values(approvalStatus),
      default: approvalStatus.Pending,
    },
    approved_at: {
      type: "timestamp",
      nullable: true,
    },
    status: {
      type: "enum",
      enum: Object.values(status),
      default: status.Active,
    },
    comments: {
      type: "text",
      nullable: true,
    },
    is_active: {
      type: "boolean",
      default: false,
    },
  },
  relations: {
    leaveRequest: {
      target: "LeaveRequest",
      type: "many-to-one",
      joinColumn: {
        name: "leave_id",
        referencedColumnName: "id",
      },
      nullable: false,
      onDelete: "RESTRICT",
    },
    employee: {
      target: "Employee",
      type: "many-to-one",
      joinColumn: {
        name: "approver_id",
        referencedColumnName: "id",
      },
      nullable: false,
      onDelete: "RESTRICT",
    },
  },
});

module.exports = ApprovalFlow;
