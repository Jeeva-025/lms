const { AppDataSource } = require("../models/dbconfig");
const Employee = require("../models/entities/employee");
const LeavePolicy = require("../models/entities/leavePolicy");
const LeaveBalance = require("../models/entities/leaveBalance");
const status = {
  Active: "200",
  Inactive: "400",
};

async function updateLeaveBalances() {
  if (!AppDataSource.isInitialized) {
    throw new Error("Database not initialized");
  }
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  try {
    const employeeRepo = AppDataSource.getRepository(Employee);
    const employees = await employeeRepo.find({
      where: { status: status.Active },
      relations: ["employeeType"],
    });

    for (const employee of employees) {
      await updateEmployeeLeaveBalances(employee, currentYear, currentMonth);
    }

    return { success: true, message: "Leave balances updated successfully" };
  } catch (error) {
    console.error("Error in updateLeaveBalances:", error);
    throw error;
  }
}

async function updateEmployeeLeaveBalances(employee, year, month) {
  const leavePolicyRepo = AppDataSource.getRepository(LeavePolicy);
  const leaveBalanceRepo = AppDataSource.getRepository(LeaveBalance);

  const policies = await leavePolicyRepo.find({
    where: {
      employee_type_id: employee.emp_type_id,
      status: status.Active,
    },
  });

  for (const policy of policies) {
    let balance = await leaveBalanceRepo.findOne({
      where: {
        employee_id: employee.id,
        leave_type_id: policy.leave_type_id,
        year: year,
      },
    });

    if (!balance) {
      balance = leaveBalanceRepo.create({
        employee_id: employee.id,
        leave_type_id: policy.leave_type_id,
        year: year,
        no_of_leave_taken: 0,
        total_leaves: 0,
        status: status.Active,
      });
    }

    const newLeaves = policy.accrual_per_month * month;

    if (newLeaves > balance.total_leaves) {
      balance.total_leaves = newLeaves;
      await leaveBalanceRepo.save(balance);
    }
  }
}

module.exports = {
  updateLeaveBalances,
  updateEmployeeLeaveBalances,
};
