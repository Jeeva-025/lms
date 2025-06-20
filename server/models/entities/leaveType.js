const { EntitySchema } = require("typeorm");
const status = {
  Active: 200,
  Inactive: 400,
};
const LeaveType = new EntitySchema({
  name: "LeaveType",
  tableName: "leave_types",
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
    leavePolicy: {
      target: "LeavePolicy",
      type: "one-to-many",
      inverseSide: "leaveType",
    },
    leaveRequest: {
      target: "LeaveRequest",
      type: "one-to-many",
      inverseSide: "leaveType",
    },
    leaveBalance: {
      target: "LeaveBalance",
      type: "one-to-many",
      inverseSide: "leaveType",
    },
  },
});
module.exports = LeaveType;
