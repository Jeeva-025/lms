const { EntitySchema } = require("typeorm");

const LeaveRemaining = new EntitySchema({
  name: "LeaveReamining",
  tableName: "leave_remainings",
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
    no_of_leave_taken: {
      type: "int",
      nullable: false,
    },
    total_leaves: {
      type: "int",
      nullable: false,
      default: 20,
    },
    no_of_sick_leave: {
      type: "int",
      nullable: false,
    },
    no_of_casual_leave: {
      type: "int",
      nullable: false,
    },
    no_of_earned_leave: {
      type: "int",
      nullable: false,
    },
  },
});
module.exports = LeaveRemaining;
