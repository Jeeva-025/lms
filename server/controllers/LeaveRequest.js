const AppDataSource = require("../models/dbconfig");
const LeaveRequest = require("../models/entities/leaveRequest");
const LeaveReamining = require("../models/entities/leaveRemaining");
const Employee = require("../models/entities/employee");
const LeaveType = require("../models/entities/leaveType");
const { Brackets } = require("typeorm");

const createLeaveRequest = async (request, h) => {
  try {
    const strLowerCase = (str) => {
      return str.trim().toLowerCase();
    };
    const {
      leave_id,
      employee_id,
      reason,
      start_date,
      end_date,
      is_sick_leave,
      approval_status,
    } = request.payload;
    const employeeRepo = AppDataSource.getRepository(Employee);
    const emp = await employeeRepo.find({ where: { employee_id } });
    if (!emp) {
      return h.response({ message: "Data not Found" }).code(404);
    }
    console.log(emp);
    const leaveRequest = AppDataSource.getRepository(LeaveRequest);
    const leaveRemaining = AppDataSource.getRepository(LeaveReamining);
    const leaveRem = await leaveRemaining.findOne({ where: { employee_id } });
    if (!leaveRem) {
      return h.response({ message: "Data not Found" }).code(404);
    }
    const start = new Date(start_date);
    const end = new Date(end_date);
    const diffInMs = end - start;

    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24)) + 1;
    if (
      is_sick_leave &&
      diffInDays === 1 &&
      6 - leaveRem.no_of_sick_leave >= 1
    ) {
      const leaveReq = leaveRequest.create({
        leave_id,
        employee_id,
        reason,
        start_date: start,
        end_date: end,
        is_sick_leave: true,
        approval_status: "APPROVED",
      });
      leaveRem.no_of_sick_leave += 1;
      leaveRem.no_of_leave_taken += 1;
      await leaveRemaining.save(leaveRem);
      const response = await leaveRequest.save(leaveReq);
      return h
        .response({ message: "Request Submitted Successfully", response })
        .code(201);
    } else if (
      strLowerCase(emp[0].designation) === "manager" ||
      strLowerCase(emp[0].designation) === "hr"
    ) {
      if (strLowerCase(emp[0].designation) === "manager") {
        const leaveReq = leaveRequest.create({
          leave_id,
          employee_id,
          reason,
          start_date: start,
          end_date: end,
          is_sick_leave,
          approval_status,
          no_of_approval_need: diffInDays >= 5 ? 2 : 1,
          no_of_approval_permitted: 0,
        });
        const response = await leaveRequest.save(leaveReq);
        return h.response(
          { message: "Request Submitted Successfully" },
          response
        );
      } else {
        const leaveReq = leaveRequest.create({
          leave_id,
          employee_id,
          reason,
          start_date: start,
          end_date: end,
          is_sick_leave,
          approval_status,
          no_of_approval_need: 1,
          no_of_approval_permitted: 0,
        });
        const response = await leaveRequest.save(leaveReq);
        return h.response(
          { message: "Request Submitted Successfully" },
          response
        );
      }
    }

    const leaveReq = leaveRequest.create({
      leave_id,
      employee_id,
      reason,
      start_date: start,
      end_date: end,
      is_sick_leave,
      approval_status,
      no_of_approval_need: diffInDays === 1 ? 1 : diffInDays >= 5 ? 3 : 2,
      no_of_approval_permitted: 0,
    });

    const response = await leaveRequest.save(leaveReq);
    return h.response({ message: "Request Submitted Successfully" }, response);
  } catch (err) {
    console.log(err);
    return h.response({ error: "Failed to create Leave Request" }).code(500);
  }
};

const cancelLeaveRequest = async (request, h) => {
  try {
    const { id } = request.params;
    const leaveRequestRepo = AppDataSource.getRepository(LeaveRequest);
    const data = await leaveRequestRepo.findOne({ where: { id } });
    if (!data) {
      return h.response({ message: "Data not Found" }).code(404);
    }

    data.approval_status = "CANCELED";

    await leaveRequestRepo.save(data);

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
    const { id } = request.params;
    const leaveRequest = AppDataSource.getRepository(LeaveRequest);
    const response = await leaveRequest.findOne({ where: { id } });
    if (!response) {
      return h.response({ message: "Data not Found" }).code(404);
    }

    response.approval_status = "REJECTED";

    await leaveRequest.save(response);

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
    const { employee_id } = request.payload;
    const leaveRequest = AppDataSource.getRepository(LeaveRequest);
    const response = await leaveRequest.find({
      where: { employee_id, status: "ACTIVE" },
      relations: ["leaveType"],
    });
    if (!response) return h.response({ message: "Data not found" }), code(404);
    const transformedData = response.map((item) => {
      const start = new Date(item.start_date);
      const end = new Date(item.end_date);
      const diffInMs = end - start;

      const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24)) + 1;

      return {
        id: item.id,
        leaveType: item.leaveType.name,
        startDate: item.start_date,
        endDate: item.end_date,
        status: item.approval_status,
        noOfDays: diffInDays,
        reason: item.reason,
      };
    });
    return h.response(transformedData).code(200);
  } catch (err) {
    console.log(err);
    return h.response({ error: "Failed to create Cancel Request" }).code(500);
  }
};

const approvalOfLeave = async (request, h) => {
  try {
    const { id, leave_id, employee_id } = request.payload;
    console.log(id);
    console.log(leave_id);
    console.log(employee_id);
    const leaveRequestRepo = AppDataSource.getRepository(LeaveRequest);
    const leaveRemainingRepo = AppDataSource.getRepository(LeaveReamining);
    const leaveTypeRepo = AppDataSource.getRepository(LeaveType);

    const response = await leaveRequestRepo.findOne({ where: { id } });
    if (!response) {
      return h.response({ message: "Leave request not found" }).code(404);
    }
    console.log(response);

    response.no_of_approval_permitted += 1;

    if (response.no_of_approval_permitted === response.no_of_approval_need) {
      response.approval_status = "APPROVED";

      const leavRem = await leaveRemainingRepo.findOne({
        where: { employee_id },
      });
      if (!leavRem) {
        return h.response({ message: "Leave record not found" }).code(404);
      }
      console.log(leavRem);

      const data = await leaveTypeRepo.findOne({ where: { id: leave_id } });
      if (!data) {
        return h.response({ message: "Such Leave Not Found" }).code(404);
      }
      const start = new Date(response.start_date);
      const end = new Date(response.end_date);
      const diffInMs = end - start;

      const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24)) + 1;
      console.log(diffInDays);

      leavRem.no_of_leave_taken += diffInDays;

      const leaveTypeName = data.name.trim().toLowerCase();
      switch (leaveTypeName) {
        case "earned leave":
          leavRem.no_of_earned_leave += diffInDays;
          break;
        case "sick leave":
          leavRem.no_of_sick_leave += diffInDays;
          break;
        default:
          leavRem.no_of_casual_leave += diffInDays;
          break;
      }

      await leaveRemainingRepo.save(leavRem);
    }

    await leaveRequestRepo.save(response);

    return h
      .response({ message: "Data Updated Successfully", response })
      .code(200);
  } catch (err) {
    console.error(err);
    return h.response({ error: "Failed to update Request" }).code(500);
  }
};

const fetchLeaveRequestToHR = async (request, h) => {
  try {
    const { hr_id } = request.query;

    const employeesWithPendingLeave = await AppDataSource.getRepository(
      Employee
    )
      .createQueryBuilder("employee")
      .innerJoinAndSelect(
        "employee.leaveRequest",
        "leaveRequest",
        `leaveRequest.approval_status = :status AND (leaveRequest.no_of_approval_need - leaveRequest.no_of_approval_permitted)=1`,
        { status: "PENDING" }
      )
      .leftJoinAndMapOne(
        "employee.leaveRemaining",
        "LeaveReamining",
        "leaveRemaining",
        "leaveRemaining.employee_id = employee.employee_id"
      )
      .where("employee.hr_id = :hrId", { hrId: hr_id })
      .getMany();

    const leaveTypeMap = {
      1: "Earned Leave",
      2: "Sick Leave",
      3: "Casual Leave",
    };
    const transformedData = employeesWithPendingLeave.flatMap((employee) => {
      if (employee.designation.trim().toLowerCase() === "hr") return [];
      return employee.leaveRequest.map((leave) => {
        const start = new Date(leave.start_date);
        const end = new Date(leave.end_date);
        const diffInMs = end - start;
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24)) + 1;

        const leaveRemaining = employee.leaveRemaining || {};

        return {
          employeeId: employee.employee_id,
          id: leave.id,
          name: employee.name,
          designation: employee.designation,
          leaveType: leaveTypeMap[leave.leave_id] || "Unknown",
          startDate: leave.start_date,
          endDate: leave.end_date,
          requestedDate: leave.created,
          noOfDays: diffInDays === 1 ? "1 day" : `${diffInDays} days`,
          type: employee.type,
          reason: leave.reason,
          status: leave.approval_status,
          availableLeaves: {
            sick: 5 - leaveRemaining.no_of_sick_leave || 0,
            casual: 5 - leaveRemaining.no_of_casual_leave || 0,
            earned: 10 - leaveRemaining.no_of_earned_leave || 0,
            totalLeavesTaken: leaveRemaining.no_of_leave_taken || 0,
            totalLeavesAllowed: leaveRemaining.total_leaves || 20,
          },
        };
      });
    });

    return h.response(transformedData).code(200);
  } catch (err) {
    console.log(err);
    return h.response({ message: "Failed to Fetch Data" }).code(500);
  }
};

const fetchLeaveRequestToManager = async (request, h) => {
  try {
    const { manager_id } = request.query;

    const employeesWithLeaveRequest = await AppDataSource.getRepository(
      Employee
    )
      .createQueryBuilder("employee")
      .innerJoinAndSelect(
        "employee.leaveRequest",
        "leaveRequest",
        `leaveRequest.approval_status = :status AND leaveRequest.no_of_approval_need > 1 AND (leaveRequest.no_of_approval_need - leaveRequest.no_of_approval_permitted = leaveRequest.no_of_approval_need)`,
        { status: "PENDING" }
      )
      .leftJoinAndMapOne(
        "employee.leaveRemaining",
        "LeaveReamining",
        "leaveRemaining",
        "leaveRemaining.employee_id = employee.employee_id"
      )
      .where("employee.manager_id = :managerId", { managerId: manager_id })
      .getMany();

    const leaveTypeMap = {
      1: "Earned Leave",
      2: "Sick Leave",
      3: "Casual Leave",
    };

    const transformedData = employeesWithLeaveRequest.flatMap((employee) => {
      if (employee.designation.trim().toLowerCase() === "manager") return [];

      return employee.leaveRequest.map((leave) => {
        const start = new Date(leave.start_date);
        const end = new Date(leave.end_date);
        const diffInMs = end - start;
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24)) + 1;

        const leaveRemaining = employee.leaveRemaining || {};

        return {
          employeeId: employee.employee_id,
          id: leave.id,
          name: employee.name,
          designation: employee.designation,
          leaveType: leaveTypeMap[leave.leave_id] || "Unknown",
          startDate: leave.start_date,
          endDate: leave.end_date,
          requestedDate: leave.created,
          noOfDays: diffInDays === 1 ? "1 day" : `${diffInDays} days`,
          type: employee.type,
          reason: leave.reason,
          status: leave.approval_status,
          availableLeaves: {
            sick: 5 - leaveRemaining.no_of_sick_leave || 0,
            casual: 5 - leaveRemaining.no_of_casual_leave || 0,
            earned: 10 - leaveRemaining.no_of_earned_leave || 0,
            totalLeavesTaken: leaveRemaining.no_of_leave_taken || 0,
            totalLeavesAllowed: leaveRemaining.total_leaves || 20,
          },
        };
      });
    });

    return h.response(transformedData).code(200);
  } catch (err) {
    console.error(err);
    return h.response({ message: "Failed to fetch Data" }).code(500);
  }
};

const fetchLeaveRequestToDirector = async (request, h) => {
  try {
    const { director_id } = request.query;

    const employeesWithLeaveRequest = await AppDataSource.getRepository(
      Employee
    )
      .createQueryBuilder("employee")
      .innerJoinAndSelect(
        "employee.leaveRequest",
        "leaveRequest",
        `leaveRequest.approval_status= :status AND leaveRequest.no_of_approval_need>2 AND (leaveRequest.no_of_approval_need - leaveRequest.no_of_approval_permitted = 2)`,
        { status: "PENDING" }
      )
      .leftJoinAndMapOne(
        "employee.leaveRemaining",
        "LeaveReamining",
        "leaveRemaining",
        "leaveRemaining.employee_id = employee.employee_id"
      )
      .where("employee.director_id = :directorId", { directorId: director_id })
      .getMany();

    const arr = ["HR", "Manager"];

    const adminWithLeaveRequest = await AppDataSource.getRepository(Employee)
      .createQueryBuilder("employee")
      .innerJoinAndSelect(
        "employee.leaveRequest",
        "leaveRequest",
        `leaveRequest.approval_status= :status `,
        { status: "PENDING" }
      )
      .leftJoinAndMapOne(
        "employee.leaveRemaining",
        "LeaveReamining",
        "leaveRemaining",
        "leaveRemaining.employee_id = employee.employee_id"
      )
      .where("employee.director_id = :directorId", { directorId: director_id })
      .andWhere("employee.designation IN (:...role)", { role: arr })
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            "(employee.designation = 'Manager' AND leaveRequest.no_of_approval_need > 1)"
          ).orWhere(
            "(employee.designation = 'HR' AND leaveRequest.no_of_approval_need = 1)"
          );
        })
      )
      .getMany();
    console.log(adminWithLeaveRequest);

    const leaveTypeMap = {
      1: "Earned Leave",
      2: "Sick Leave",
      3: "Casual Leave",
    };
    const combinedOne = [
      ...employeesWithLeaveRequest,
      ...adminWithLeaveRequest,
    ];
    const transformedData = combinedOne.flatMap((employee) =>
      employee.leaveRequest.map((leave) => {
        const start = new Date(leave.start_date);
        const end = new Date(leave.end_date);
        const diffInMs = end - start;
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24)) + 1;

        const leaveRemaining = employee.leaveRemaining || {};

        return {
          employeeId: employee.employee_id,
          id: leave.id,
          name: employee.name,
          designation: employee.designation,
          leaveType: leaveTypeMap[leave.leave_id] || "Unknown",
          startDate: leave.start_date,
          endDate: leave.end_date,
          requestedDate: leave.created,
          noOfDays: diffInDays === 1 ? "1 day" : `${diffInDays} days`,
          type: employee.type,
          reason: leave.reason,
          status: leave.approval_status,
          availableLeaves: {
            sick: 5 - leaveRemaining.no_of_sick_leave || 0,
            casual: 5 - leaveRemaining.no_of_casual_leave || 0,
            earned: 10 - leaveRemaining.no_of_earned_leave || 0,
            totalLeavesTaken: leaveRemaining.no_of_leave_taken || 0,
            totalLeavesAllowed: leaveRemaining.total_leaves || 20,
          },
        };
      })
    );
    return h.response(transformedData).code(200);
  } catch (err) {
    console.log(err);
    return h.response({ message: "Failed to fetch Data" }).code(500);
  }
};
const fetchLeaveRequestHistory = async (request, h) => {
  try {
    const { hr_id, manager_id, director_id } = request.payload;
    let roleKey, roleValue, approvalLevel;

    if (hr_id) {
      roleKey = "hr_id";
      roleValue = hr_id;
      approvalLevel = 1;
    } else if (manager_id) {
      roleKey = "manager_id";
      roleValue = manager_id;
      approvalLevel = 2;
    } else if (director_id) {
      roleKey = "director_id";
      roleValue = director_id;
      approvalLevel = 3;
    } else {
      return h.response({ message: "Invalid role identifier" }).code(400);
    }

    const employeesWithPendingLeave = await AppDataSource.getRepository(
      Employee
    )
      .createQueryBuilder("employee")
      .innerJoinAndSelect(
        "employee.leaveRequest",
        "leaveRequest",
        `leaveRequest.status = :status AND leaveRequest.no_of_approval_need >= :approvalLevel`,
        {
          status: "ACTIVE",
          approvalLevel,
        }
      )
      .leftJoinAndMapOne(
        "employee.leaveRemaining",
        "LeaveReamining",
        "leaveRemaining",
        "leaveRemaining.employee_id = employee.employee_id"
      )
      .where(`employee.${roleKey} = :roleValue`, { roleValue })
      .getMany();

    const leaveTypeMap = {
      1: "Earned Leave",
      2: "Sick Leave",
      3: "Casual Leave",
    };

    const transformedData = employeesWithPendingLeave.flatMap((employee) =>
      employee.leaveRequest.map((leave) => {
        const start = new Date(leave.start_date);
        const end = new Date(leave.end_date);
        const diffInMs = end - start;
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24)) + 1;
        const leaveRemaining = employee.leaveRemaining || {};

        return {
          employeeId: employee.employee_id,
          id: leave.id,
          name: employee.name,
          designation: employee.designation,
          leaveType: leaveTypeMap[leave.leave_id] || "Unknown",
          startDate: leave.start_date,
          endDate: leave.end_date,
          requestedDate: leave.created,
          noOfDays: diffInDays === 1 ? "1 day" : `${diffInDays} days`,
          type: employee.type,
          reason: leave.reason,
          status: leave.approval_status,
          availableLeaves: {
            sick: 5 - (leaveRemaining.no_of_sick_leave || 0),
            casual: 5 - (leaveRemaining.no_of_casual_leave || 0),
            earned: 10 - (leaveRemaining.no_of_earned_leave || 0),
            totalLeavesTaken: leaveRemaining.no_of_leave_taken || 0,
            totalLeavesAllowed: leaveRemaining.total_leaves || 20,
          },
        };
      })
    );

    return h.response(transformedData).code(200);
  } catch (err) {
    console.log(err);
    return h.response({ message: "Failed to Fetch Data" }).code(500);
  }
};

const fetchNoOfRequestByStatus = async (request, h) => {
  try {
    const { employee_id, approval_status } = request.payload;
    const leaveRequest = AppDataSource.getRepository(LeaveRequest);
    const data = await leaveRequest.count({
      where: { employee_id, approval_status, status: "ACTIVE" },
    });

    return h.response({ data }).code(200);
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
  fetchLeaveRequestToHR,
  fetchLeaveRequestToManager,
  fetchLeaveRequestToDirector,
  fetchNoOfRequestByStatus,
  fetchLeaveRequestHistory,
};
