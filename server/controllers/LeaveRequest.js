const { AppDataSource } = require("../models/dbconfig");
const LeaveRequest = require("../models/entities/leaveRequest");
const LeaveRemaining = require("../models/entities/leaveBalance");
const Employee = require("../models/entities/employee");
const LeaveType = require("../models/entities/leaveType");
const {
  Brackets,
  Not,
  In,
  MoreThanOrEqual,
  LessThanOrEqual,
} = require("typeorm");
const ApprovalFlow = require("../models/entities/approvalFlow");
const EmployeeType = require("../models/entities/employeeType");
const { status, approvalStatus } = require("../utils/constant");

const createApprovalFlow = async (leaveId, employeeId, approvalLevels) => {
  const approvalFlowRepository = AppDataSource.getRepository(ApprovalFlow);
  const employeeRepository = AppDataSource.getRepository(Employee);

  try {
    const requestingEmployeeData = await employeeRepository.findOne({
      where: { id: employeeId },
    });
    let isFirstRecord = true;

    if (!requestingEmployeeData) {
      return h.response({ message: "Employee Not Found" }).code(404);
    }

    const approvalFlows = [];
    let currentApproverId = requestingEmployeeData.manager_id;
    let levelsCreated = 0;

    while (currentApproverId && levelsCreated < approvalLevels) {
      const approvalFlow = approvalFlowRepository.create({
        leave_id: leaveId,
        approver_id: currentApproverId,
        approval_status: approvalStatus.Pending,
        status: status.Active,
      });
      if (isFirstRecord) {
        approvalFlow.is_active = true;
        isFirstRecord = false;
      }

      approvalFlows.push(approvalFlow);
      levelsCreated++;

      if (levelsCreated < approvalLevels) {
        const currentManager = await employeeRepository.findOne({
          where: { id: currentApproverId },
        });
        if (!currentManager || !currentManager.manager_id) {
          break;
        }
        currentApproverId = currentManager.manager_id;
      }
    }

    await approvalFlowRepository.save(approvalFlows);

    return approvalFlows;
  } catch (error) {
    console.error("Error creating approval flow:", error);
    throw error;
  }
};

const createLeaveRequest = async (request, h) => {
  try {
    const strLowerCase = (str) => {
      return str.trim().toLowerCase();
    };
    const { leave_id, employee_id, reason, start_date, end_date, manager_id } =
      request.payload;
    const employeeRepo = AppDataSource.getRepository(Employee);
    const emp = await employeeRepo.find({
      where: { id: employee_id },
      relations: ["employeeType"],
    });
    if (!emp || emp.length === 0) {
      return h.response({ message: "Data not Found" }).code(404);
    }
    const leaveRequestRepo = AppDataSource.getRepository(LeaveRequest);
    const approvalFlowRepo = AppDataSource.getRepository(ApprovalFlow);
    const leaveRemainingRepo = AppDataSource.getRepository(LeaveRemaining);

    const leaveRequestData = await leaveRequestRepo.findOne({
      where: {
        employee_id,
        status: status.Active.toString(),
        start_date: LessThanOrEqual(new Date(end_date)),
        end_date: MoreThanOrEqual(new Date(start_date)),
      },
    });
    if (leaveRequestData) {
      return h
        .response({ message: "Leave already exists during this date range" })
        .code(400);
    }
    const leaveRemData = await leaveRemainingRepo.findOne({
      where: { employee_id, leave_type_id: leave_id },
      relations: ["leaveType"],
    });
    if (!leaveRemData) {
      return h.response({ message: "Data not Found" }).code(404);
    }
    const start = new Date(start_date);
    const end = new Date(end_date);
    const diffInMs = end - start;

    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24)) + 1;
    if (
      strLowerCase(leaveRemData.leaveType.name) ===
        strLowerCase("sick leave") &&
      diffInDays === 1 &&
      leaveRemData.total_leaves - leaveRemData.no_of_leave_taken >= 1
    ) {
      const leaveReq = leaveRequestRepo.create({
        leave_type_id: leave_id,
        employee_id,
        reason,
        start_date: start,
        end_date: end,
        no_of_approval_need: 1,
        no_of_approval_permitted: 1,
        approval_status: approvalStatus.Approved,
      });
      await leaveRequestRepo.save(leaveReq);
      leaveRemData.no_of_leave_taken += 1;
      const approvalFlowData = approvalFlowRepo.create({
        leave_id: leaveReq.id,
        approver_id: manager_id,
        approval_status: approvalStatus.Approved,
        approved_at: new Date(),
        is_active: true,
      });
      await approvalFlowRepo.save(approvalFlowData);

      await leaveRemainingRepo.save(leaveRemData);

      return h
        .response({ message: "Request Submitted Successfully" })
        .code(201);
    } else if (
      strLowerCase(emp[0].employeeType.name).includes("senior") ||
      strLowerCase(emp[0].employeeType.name).includes("hr") ||
      strLowerCase(emp[0].employeeType.name).includes("director")
    ) {
      if (strLowerCase(emp[0].employeeType.name).includes("senior")) {
        const approval = diffInDays >= 5 ? 2 : 1;
        const leaveReq = leaveRequestRepo.create({
          leave_type_id: leave_id,
          employee_id,
          reason,
          start_date: start,
          end_date: end,
          no_of_approval_need: approval,
          no_of_approval_permitted: 0,
        });
        await leaveRequestRepo.save(leaveReq);
        await createApprovalFlow(leaveReq.id, employee_id, approval);

        return h.response({ message: "Request Submitted Successfully" });
      } else {
        const leaveReq = leaveRequestRepo.create({
          leave_type_id: leave_id,
          employee_id,
          reason,
          start_date: start,
          end_date: end,
          no_of_approval_need: 1,
          no_of_approval_permitted: 0,
        });
        await leaveRequestRepo.save(leaveReq);
        await createApprovalFlow(leaveReq.id, employee_id, 1);
        return h.response({ message: "Request Submitted Successfully" });
      }
    }

    const approval = diffInDays === 1 ? 1 : diffInDays >= 5 ? 3 : 2;

    const leaveReq = leaveRequestRepo.create({
      leave_type_id: leave_id,
      employee_id,
      reason,
      start_date: start,
      end_date: end,
      no_of_approval_need: approval,
      no_of_approval_permitted: 0,
    });
    await leaveRequestRepo.save(leaveReq);
    await createApprovalFlow(leaveReq.id, employee_id, approval);
    return h.response({ message: "Request Submitted Successfully" }).code(200);
  } catch (err) {
    console.log(err);
    return h.response({ error: "Failed to create Leave Request" }).code(500);
  }
};

const cancelLeaveRequest = async (request, h) => {
  try {
    const { id } = request.payload;
    console.log(id);
    const leaveRequestRepo = AppDataSource.getRepository(LeaveRequest);
    const approvalFlowRepo = AppDataSource.getRepository(ApprovalFlow);
    const leaveRequestData = await leaveRequestRepo.findOne({
      where: { id },
    });
    if (!leaveRequestData) {
      return h.response({ message: "Data not Found" }).code(404);
    }

    leaveRequestData.approval_status = approvalStatus.Cancelled;
    const approvalFlowData = await approvalFlowRepo.find({
      where: {
        leave_id: id,
        status: status.Active.toString(),
        approval_status: approvalStatus.Pending.toString(),
      },
    });
    for (const each of approvalFlowData) {
      each.approval_status = approvalStatus.Cancelled;
      await approvalFlowRepo.save(each);
    }
    await leaveRequestRepo.save(leaveRequestData);

    return h
      .response({ message: "Leave request cancelled successfully" })
      .code(200);
  } catch (err) {
    console.log(err);
    return h.response({ error: "Failed to Cancel Request" }).code(500);
  }
};

const rejectLeaveRequest = async (request, h) => {
  try {
    const { id, approver_id } = request.payload;
    const leaveRequestRepo = AppDataSource.getRepository(LeaveRequest);
    const approvalFlowRepo = AppDataSource.getRepository(ApprovalFlow);
    const leaveRequestData = await leaveRequestRepo.findOne({ where: { id } });
    if (!leaveRequestData) {
      return h.response({ message: "Data not Found" }).code(404);
    }

    leaveRequestData.approval_status = approvalStatus.Rejected;
    const approvalFlowData = await approvalFlowRepo.find({
      where: {
        leave_id: id,
        approval_status: approvalStatus.Pending.toString(),
      },
      order: {
        id: "ASC",
      },
    });

    for (const each of approvalFlowData) {
      each.approval_status = approvalStatus.Rejected;
      await approvalFlowRepo.save(each);
    }

    await leaveRequestRepo.save(leaveRequestData);

    return h
      .response({ message: "Leave request rejected successfully" })
      .code(200);
  } catch (err) {
    console.log(err);
    return h.response({ error: "Failed to  Reject Request" }).code(500);
  }
};

const fetchEmployeeLeaveHistory = async (request, h) => {
  try {
    const {
      employee_id,
      start_date,
      end_date,
      approval_status,
      leave_type_id,
    } = request.query;
    let whereCondition = {
      employee_id,
      status: status.Active.toString(),
    };
    if (start_date) {
      const adjustedStartDate = new Date(start_date);
      adjustedStartDate.setDate(adjustedStartDate.getDate() + 1);
      whereCondition.start_date = MoreThanOrEqual(
        adjustedStartDate.toISOString().split("T")[0]
      );
    }
    if (end_date) {
      const adjustedEndDate = new Date(end_date);
      adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);

      whereCondition.end_date = LessThanOrEqual(
        adjustedEndDate.toISOString().split("T")[0]
      );
    }
    if (leave_type_id) {
      whereCondition.leave_type_id = leave_type_id;
    }
    if (approval_status) {
      whereCondition.approval_status =
        approvalStatus[
          approval_status.charAt(0).toUpperCase() +
            approval_status.slice(1).toLowerCase()
        ].toString();
    }
    const leaveRequestRepo = AppDataSource.getRepository(LeaveRequest);
    const leaveRequestData = await leaveRequestRepo.find({
      where: whereCondition,
      relations: ["approvalFlow.employee", "leaveType"],
    });
    if (!leaveRequestData)
      return h.response({ message: "Data not found" }).code(404);
    const transformedData = leaveRequestData.map((each) => {
      const start = new Date(each.start_date);
      const end = new Date(each.end_date);
      const diffInMs = end - start;
      const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24)) + 1;

      return {
        leaveId: each.id,
        reason: each.reason,
        startDate: each.start_date,
        noOfDays: diffInDays,
        endDate: each.end_date,
        approvalStatus: Object.keys(approvalStatus)[each.approval_status],
        requestedAt: each.requested_at,
        leaveName: each.leaveType.name,
        leave_type_id: each.leaveType.id,
        approvalFlow: each.approvalFlow.map((item) => ({
          name: item.employee.name,
          approvalStatus: Object.keys(approvalStatus)[item.approval_status],
          approvedAt: item?.approved_at,
        })),
      };
    });
    return h.response(transformedData).code(200);
  } catch (err) {
    console.log(err);
    return h.response({ error: "Failed to fetch Data" }).code(500);
  }
};

const approvalOfLeave = async (request, h) => {
  try {
    const { id } = request.payload;
    console.log(id);

    const leaveRequestRepo = AppDataSource.getRepository(LeaveRequest);
    const leaveRemainingRepo = AppDataSource.getRepository(LeaveRemaining);
    const leaveTypeRepo = AppDataSource.getRepository(LeaveType);
    const approvalFlowRepo = AppDataSource.getRepository(ApprovalFlow);

    const approvalFlowData = await approvalFlowRepo.findOne({ where: { id } });
    console.log(approvalFlowData);
    if (!approvalFlowData) {
      return h.response({ message: "Leave request not found" }).code(404);
    }
    approvalFlowData.is_active = false;
    approvalFlowData.approval_status = approvalStatus.Approved;
    approvalFlowData.approved_at = new Date();
    await approvalFlowRepo.save(approvalFlowData);
    const leaveRequestData = await leaveRequestRepo.findOne({
      where: { id: approvalFlowData.leave_id },
    });
    leaveRequestData.no_of_approval_permitted += 1;

    if (
      leaveRequestData.no_of_approval_permitted ===
      leaveRequestData.no_of_approval_need
    ) {
      leaveRequestData.approval_status = approvalStatus.Approved;

      const leaveRemData = await leaveRemainingRepo.findOne({
        where: {
          employee_id: leaveRequestData.employee_id,
          leave_type_id: leaveRequestData.leave_type_id,
        },
      });
      if (!leaveRemData) {
        return h.response({ message: "Leave record not found" }).code(404);
      }

      const start = new Date(leaveRequestData.start_date);
      const end = new Date(leaveRequestData.end_date);
      const diffInMs = end - start;

      const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24)) + 1;

      leaveRemData.no_of_leave_taken += diffInDays;
      await leaveRemainingRepo.save(leaveRemData);
    } else {
      const nextFlow = await approvalFlowRepo.findOne({
        where: {
          leave_id: approvalFlowData.leave_id,
          is_active: false,
          approval_status: approvalStatus.Pending.toString(),
        },
        order: { id: "ASC" },
      });
      if (nextFlow) {
        nextFlow.is_active = true;
        await approvalFlowRepo.save(nextFlow);
      }
    }

    await leaveRequestRepo.save(leaveRequestData);

    return h
      .response({ message: "Data Updated Successfully", leaveRequestData })
      .code(200);
  } catch (err) {
    console.error(err);
    return h.response({ error: "Failed to update Request" }).code(500);
  }
};

const fetchLeaveRequestForApproval = async (request, h) => {
  try {
    const { id } = request.query;
    console.log(id);
    const approvalFlowRepo = AppDataSource.getRepository(ApprovalFlow);
    const employeeTypeRepo = AppDataSource.getRepository(EmployeeType);
    const approvalFlowData = await approvalFlowRepo.find({
      where: {
        approver_id: id,
        status: status.Active.toString(),
        is_active: true,
        approval_status: approvalStatus.Pending.toString(),
      },
      relations: [
        "leaveRequest",
        "leaveRequest.leaveType",
        "leaveRequest.employee",
        "leaveRequest.employee.employeeType",
        "leaveRequest.employee.leaveBalance",
        "leaveRequest.employee.leaveBalance.leaveType",
      ],
    });
    const transformed = approvalFlowData.map((item) => {
      const leave = item.leaveRequest;
      const employee = leave.employee;
      const leaveTypeName = leave.leaveType.name;

      const leaveTypeMap = {};
      employee.leaveBalance.forEach((lb) => {
        leaveTypeMap[lb.leave_type_id] = lb.leaveType.name;
      });

      const leaveRemaining = {};
      let totalGiven = 0;
      let totalTaken = 0;
      employee.leaveBalance.forEach((lb) => {
        const type = lb.leaveType.name.toLowerCase();
        if (type.includes("sick"))
          leaveRemaining.no_of_sick_leave =
            lb.total_leaves - lb.no_of_leave_taken;
        if (type.includes("casual"))
          leaveRemaining.no_of_casual_leave =
            lb.total_leaves - lb.no_of_leave_taken;
        if (type.includes("earned"))
          leaveRemaining.no_of_earned_leave =
            lb.total_leaves - lb.no_of_leave_taken;
        // leaveRemaining.total_leaves = lb.total_leaves;
        // leaveRemaining.no_of_leave_taken = lb.no_of_leave_taken;
        totalGiven += lb.total_leaves;
        totalTaken += lb.no_of_leave_taken;
      });

      leaveRemaining["available_leaves"] = totalGiven - totalTaken;

      const start = new Date(leave.start_date);
      const end = new Date(leave.end_date);
      const diffInMs = end - start;
      const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24)) + 1;

      return {
        employeeId: employee.id,
        id: leave.id,
        approvalFlowId: item.id,
        name: employee.name,
        designation: employee.employeeType.name || "N/A",
        leaveType: leaveTypeMap[leave.leave_type_id] || "Unknown",
        startDate: leave.start_date,
        endDate: leave.end_date,
        requestedDate: leave.requested_at,
        noOfDays: diffInDays === 1 ? "1 day" : `${diffInDays} days`,
        reason: leave.reason,
        status: Object.keys(approvalStatus)[leave.approval_status],
        availableLeaves: {
          sick: leaveRemaining.no_of_sick_leave || 0,
          casual: leaveRemaining.no_of_casual_leave || 0,
          earned: leaveRemaining.no_of_earned_leave || 0,
          totalLeavesTaken: totalTaken || 0,
          totalLeaveAvailable: leaveRemaining.available_leaves || 20,
        },
      };
    });

    console.log(approvalFlowData);
    return h.response(transformed).code(200);
  } catch (err) {
    console.error(err);
    return h.response({ message: "Failed to fetch Data" }).code(500);
  }
};

const fetchLeaveRequestHistory = async (request, h) => {
  try {
    console.log("from leave Rquest history to admin");
    const { id } = request.params;
    console.log(id);
    const approvalFlowRepo = AppDataSource.getRepository(ApprovalFlow);
    const employeeTypeRepo = AppDataSource.getRepository(EmployeeType);
    const approvalFlowData = await approvalFlowRepo.find({
      where: {
        approver_id: id,
        status: status.Active.toString(),
        approval_status: Not(approvalStatus.Pending.toString()),
      },
      relations: [
        "leaveRequest",
        "leaveRequest.leaveType",
        "leaveRequest.employee",
        "leaveRequest.employee.employeeType",
        "leaveRequest.employee.leaveBalance",
        "leaveRequest.employee.leaveBalance.leaveType",
      ],
    });
    const transformed = approvalFlowData.map((item) => {
      const leave = item.leaveRequest;
      const employee = leave.employee;
      const leaveTypeName = leave.leaveType.name;

      const leaveTypeMap = {};
      employee.leaveBalance.forEach((lb) => {
        leaveTypeMap[lb.leave_type_id] = lb.leaveType.name;
      });

      const leaveRemaining = {};
      let totalGiven = 0;
      let totalTaken = 0;
      employee.leaveBalance.forEach((lb) => {
        const type = lb.leaveType.name.toLowerCase();
        if (type.includes("sick"))
          leaveRemaining.no_of_sick_leave =
            lb.total_leaves - lb.no_of_leave_taken;
        if (type.includes("casual"))
          leaveRemaining.no_of_casual_leave =
            lb.total_leaves - lb.no_of_leave_taken;
        if (type.includes("earned"))
          leaveRemaining.no_of_earned_leave =
            lb.total_leaves - lb.no_of_leave_taken;
        // leaveRemaining.total_leaves = lb.total_leaves;
        // leaveRemaining.no_of_leave_taken = lb.no_of_leave_taken;
        totalGiven += lb.total_leaves;
        totalTaken += lb.no_of_leave_taken;
      });

      leaveRemaining["available_leaves"] = totalGiven - totalTaken;

      const start = new Date(leave.start_date);
      const end = new Date(leave.end_date);
      const diffInMs = end - start;
      const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24)) + 1;

      return {
        employeeId: employee.id,
        id: leave.id,

        name: employee.name,
        designation: employee.employeeType.name || "N/A",
        leaveType: leaveTypeMap[leave.leave_type_id] || "Unknown",
        startDate: leave.start_date,
        endDate: leave.end_date,
        requestedDate: leave.requested_at,
        noOfDays: diffInDays === 1 ? "1 day" : `${diffInDays} days`,
        reason: leave.reason,
        status: Object.keys(approvalStatus)[item.approval_status],
        availableLeaves: {
          sick: leaveRemaining.no_of_sick_leave || 0,
          casual: leaveRemaining.no_of_casual_leave || 0,
          earned: leaveRemaining.no_of_earned_leave || 0,
          totalLeavesTaken: totalTaken || 0,
          totalLeaveAvailable: leaveRemaining.available_leaves || 20,
        },
      };
    });

    console.log(approvalFlowData);
    return h.response(transformed).code(200);
  } catch (err) {
    console.error(err);
    return h.response({ message: "Failed to fetch Data" }).code(500);
  }
};
const fetchTeamMemberLeaves = async (request, h) => {
  try {
    const { id } = request.params;

    const employeeRepo = AppDataSource.getRepository(Employee);
    const employeeTypeRepo = AppDataSource.getRepository(EmployeeType);
    const leaveRequestRepo = AppDataSource.getRepository(LeaveRequest);

    const currentEmployee = await employeeRepo.findOne({
      where: { id, status: status.Active.toString() },
      relations: ["employeeType"],
    });

    if (!currentEmployee) {
      return h.response({ message: "Employee not found" }).code(404);
    }

    const designation = currentEmployee.employeeType?.name?.toLowerCase();
    const managerId = currentEmployee.manager_id;

    let employeeIdsToFetch = new Set();

    if (designation.includes("hr")) {
      if (managerId) {
        employeeIdsToFetch.add(managerId);
        const peers = await employeeRepo.find({
          where: { manager_id: managerId, status: status.Active.toString() },
        });
        peers.forEach((emp) => employeeIdsToFetch.add(emp.id));
      }
      const juniors = await employeeRepo.find({
        where: { manager_id: id, status: status.Active.toString() },
      });
      juniors.forEach((emp) => employeeIdsToFetch.add(emp.id));
    } else if (designation.includes("senior")) {
      if (managerId) {
        employeeIdsToFetch.add(managerId);
        const peers = await employeeRepo.find({
          where: { manager_id: managerId, status: status.Active.toString() },
        });
        peers.forEach((emp) => employeeIdsToFetch.add(emp.id));
      }

      const reports = await employeeRepo.find({
        where: { manager_id: id, status: status.Active.toString() },
      });
      reports.forEach((emp) => employeeIdsToFetch.add(emp.id));
    } else if (designation.includes("director")) {
      if (managerId) {
        employeeIdsToFetch.add(managerId);
        const peers = await employeeRepo.find({
          where: { manager_id: managerId, status: status.Active.toString() },
        });
        peers.forEach((emp) => employeeIdsToFetch.add(emp.id));
      }

      const reports = await employeeRepo.find({
        where: { manager_id: id, status: status.Active.toString() },
      });
      reports.forEach((emp) => employeeIdsToFetch.add(emp.id));
    } else {
      if (managerId) {
        employeeIdsToFetch.add(managerId);
        const peers = await employeeRepo.find({
          where: { manager_id: managerId },
        });
        peers.forEach((emp) => employeeIdsToFetch.add(emp.id));
      }
    }

    const approvedLeaveRequestData = await leaveRequestRepo.find({
      where: {
        employee_id: In(Array.from(employeeIdsToFetch)),
        approval_status: approvalStatus.Approved.toString(),
        status: status.Active.toString(),
      },
      relations: ["employee", "leaveType"],
    });

    const transformedData = approvedLeaveRequestData.map((each) => ({
      name: each.employee.name,
      id: each.employee_id,
      startDate: each.start_date,
      endDate: each.end_date,
      leaveType: each.leaveType.name,
    }));

    return h.response(transformedData).code(200);
  } catch (err) {
    console.error("Error fetching team member leaves:", err);
    return h.response({ message: "Failed to fetch data" }).code(500);
  }
};

const fetchApprovedLeaveDate = async (request, h) => {
  try {
    const { id } = request.params;
    const leaveRequestRepo = AppDataSource.getRepository(LeaveRequest);
    const leaveRequestData = await leaveRequestRepo.find({
      where: {
        employee_id: id,
        approval_status: approvalStatus.Approved.toString(),
      },
    });
    const transformedData = leaveRequestData.map((each) => ({
      startDate: each.start_date,
      endDate: each.end_date,
    }));

    return h.response(transformedData).code(200);
  } catch (err) {
    console.log(err);
    return h.response({ message: "Failed to fetch Data" }).code(500);
  }
};

const noOfRequestByApprovalStatus = async (request, h) => {
  try {
    const { employee_id, approval_status } = request.query;
    const normalizedStatus =
      approval_status.trim().charAt(0).toUpperCase() +
      approval_status.trim().slice(1).toLowerCase();
    const approvalStatusCode = approvalStatus[normalizedStatus.toString()];
    console.log(approvalStatusCode);
    const leaveRequestRepo = AppDataSource.getRepository(LeaveRequest);
    const noOfLeaveRequestData = await leaveRequestRepo.count({
      where: {
        employee_id,
        status: status.Active.toString(),
        approval_status: approvalStatusCode.toString(),
      },
    });
    const transformedData = {
      [normalizedStatus]: noOfLeaveRequestData,
    };

    return h.response(transformedData).code(200);
  } catch (err) {
    console.log(err);
    return h.response({ message: "Failed to fetch Data" }).code(500);
  }
};

module.exports = {
  createLeaveRequest,
  cancelLeaveRequest,
  rejectLeaveRequest,
  fetchEmployeeLeaveHistory,
  approvalOfLeave,
  fetchLeaveRequestForApproval,
  fetchLeaveRequestHistory,
  fetchTeamMemberLeaves,
  fetchApprovedLeaveDate,
  noOfRequestByApprovalStatus,
};
