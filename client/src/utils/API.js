const API = {
  BASE_URL: "http://localhost:3000",

  //Leavelogs.jsx
  CANCEL_LEAVE_REQUEST: "/cancel-leave",
  EMPLOYEE_LEAVE_REQUEST: "/all-employee-leave-request",

  //LeaveRequest.jsx

  ALL_LEAVE_TYPE: "/all-leave",
  CREATE_REQUEST_LEAVE: "/leave-request-create",
  PREVIOUS_APPROVED_LEAVE_DATE: "/all-approved-leave-date",
  ALL_GOVERNMENT_HOLIDAYS: "/all-government-holiday",

  //RequedtedLeaveLogAdmin
  LEAVE_REQUEST_HISTORY_TO_MANAGER: "/leave-request-history",

  //LeaveCard Details
  EMPLOYEE_REM_LEAVE: "/employee-leave",
  NO_OF_LEAVE_REQUEST_BY_STATUS: "/count-leave-request-by-approval",

  //LeaveCalendar.jsx
  TEAM_MEMBERS_LEAVE: "/team-members-leave",
  ALL_HOLIDAYS: "/all-holiday",

  //LeaveApproval.jsx
  LEAVE_APPROVAL: "/approval-of-leave",
  REJECT_LEAVE_REQUEST: "/reject-leave-request",
  REQUESTED_LEAVE_TO_MANAGER: "/all-requestedLeave-for-approval",

  //Employee.jsx
  UPDATE_EMPLOYEE: "/update-employee",
  ALL_EMPLOYEE: "/all-employee",
  DELETE_EMPLOYEE: "/employee-destroy",

  //EditEmployeeModel.jsx
  ALL_EMPOYEE_TYPE: "/employee-type/all",
  ALL_SENIOR_EMPLOYEE: "/senior-employee",

  //ApprovalTracker.jsx
  ALL_REQUESTED_APPROVAL_FLOW: "/all-requested-approval",

  //AddPeople.jsx
  CREATE_EMPLOYEE: "/employee-create",
};

export default API;
