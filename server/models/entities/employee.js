const { EntitySchema } = require("typeorm");

const status = {
  Active: 200,
  Inactive: 400,
};
const Employee = new EntitySchema({
  name: "Employee",
  tableName: "employees",
  columns: {
    id: {
      type: "int",
      unique: true,
      primary: true,
      nullable: false,
    },
    name: {
      type: "varchar",
      nullable: false,
    },
    email: {
      type: "varchar",
      unique: true,
      length: 100,
      nullable: false,
    },
    emp_type_id: {
      type: "int",
      nullable: false,
    },

    manager_id: {
      type: "int",
      nullable: true,
    },
    password: {
      type: "varchar",
      nullable: false,
    },
    created_at: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
      nullable: false,
    },
    status: {
      type: "enum",
      enum: Object.values(status),
      default: status.Active,
    },
  },
  relations: {
    leaveRequest: {
      target: "LeaveRequest",
      type: "one-to-many",
      inverseSide: "employee",
    },
    employeeType: {
      target: "EmployeeType",
      type: "many-to-one",
      joinColumn: {
        name: "emp_type_id",
        referencedColumnName: "id",
      },
      nullable: false,
      onDelete: "RESTRICT",
    },
    approvalFlow: {
      target: "ApprovalFlow",
      type: "one-to-many",
      inverseSide: "employee",
    },
    leaveBalance: {
      target: "LeaveBalance",
      type: "one-to-many",
      inverseSide: "employee",
    },
    manager: {
      target: "Employee",
      type: "many-to-one",
      joinColumn: {
        name: "manager_id",
      },
      inverseSide: "subordinates",
    },
    subordinates: {
      target: "Employee",
      type: "one-to-many",
      inverseSide: "manager",
    },
  },
});
module.exports = Employee;
