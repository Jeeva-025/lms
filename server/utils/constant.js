const status = {
  Active: 200,
  Inactive: 400,
};
const approvalStatus = {
  Approved: 0,
  Rejected: 1,
  Pending: 2,
  Cancelled: 3,
};
const typeOfLeave = {
  earned: "Earned Leave",
  casual: "Casual Leave",
  sick: "Sick Leave",
};
module.exports = { status, approvalStatus, typeOfLeave };
