const { AppDataSource } = require("../models/dbconfig");
const Employee = require("../models/entities/employee");
const LeavePolicy = require("../models/entities/leavePolicy");
const LeaveBalance = require("../models/entities/leaveBalance");
const { status, typeOfLeave } = require("../utils/constant");

async function updateLeaveBalances(isNewYear = false) {
  if (!AppDataSource.isInitialized) {
    throw new Error("Database not initialized");
  }

  try {
    const employeeRepo = AppDataSource.getRepository(Employee);
    const employees = await employeeRepo.find({
      where: { status: status.Active.toString() },
      relations: ["employeeType"],
    });
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;

    for (const employee of employees) {
      await updateEmployeeLeaveBalances(
        employee,
        currentYear,
        currentMonth,
        isNewYear
      );
    }

    return { success: true, message: "Leave balances updated successfully" };
  } catch (error) {
    console.error("Error in updateLeaveBalances:", error);
    throw error;
  }
}

async function updateEmployeeLeaveBalances(
  employee,
  year,
  month,
  isNewYear = false
) {
  const leavePolicyRepo = AppDataSource.getRepository(LeavePolicy);
  const leaveBalanceRepo = AppDataSource.getRepository(LeaveBalance);

  const policies = await leavePolicyRepo.find({
    where: {
      employee_type_id: employee.emp_type_id,
      status: status.Active.toString(),
    },
  });

  for (const policy of policies) {
    let balance = await leaveBalanceRepo.findOne({
      where: {
        employee_id: employee.id,
        leave_type_id: policy.leave_type_id,
        year: year,
      },
      relations: ["leaveType"],
    });
    console.log(balance.leaveType.name);
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

    let newLeaves = policy.accrual_per_month * month;

    if (isNewYear) {
      const previousYearBalance = await leaveBalanceRepo.findOne({
        where: {
          employee_id: employee.id,
          leave_type_id: policy.leave_type_id,
          year: year - 1,
        },
        relations: ["leaveType"],
      });
      if (
        previousYearBalance &&
        previousYearBalance.leaveType.name.trim().toLowerCase() ===
          typeOfLeave.earned.trim().toLowerCase() &&
        previousYearBalance.total_leaves > previousYearBalance.no_of_leave_taken
      ) {
        const unusedLeaves =
          previousYearBalance.total_leaves -
          previousYearBalance.no_of_leave_taken;
        newLeaves += unusedLeaves;
      }
    }

    if (newLeaves > balance.total_leaves) {
      balance.total_leaves = newLeaves;
      balance.year = year;
      if (isNewYear) balance.no_of_leave_taken = 0;
      await leaveBalanceRepo.save(balance);
    }
  }
}

module.exports = {
  updateLeaveBalances,
  updateEmployeeLeaveBalances,
};
