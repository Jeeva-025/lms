const { EntitySchema } = require("typeorm");

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
    no_of_days: {
      type: "int",
      nullable: false,
    },
    status: {
      type: "varchar",
      nullable: false,
      default: "ACTIVE",
    },
  },
  relations: {
    leaveRequest: {
      target: "LeaveRequest",
      type: "one-to-many",
      inverseSide: "leaveType",
    },
  },
});
module.exports = LeaveType;
