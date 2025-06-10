const { EntitySchema } = require("typeorm");

const Holiday = new EntitySchema({
  name: "Holiday",
  tableName: "holidays",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    holiday_date: {
      type: "date",
      nullable: false,
    },
    name: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    is_floater: {
      type: "boolean",
      default: false,
    },
  },
});

module.exports = Holiday;
