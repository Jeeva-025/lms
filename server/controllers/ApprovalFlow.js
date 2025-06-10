const { AppDataSource } = require("../models/dbconfig");
const ApprovalFlow = require("../models/entities/approvalFlow");
const { approvalStatus, status } = require("../utils/constant");

const fetchAllApprovalRequestByLeaveId = async (request, h) => {
  console.log(status);
  try {
    const { id } = request.params;
    const approvalFlowRepo = AppDataSource.getRepository(ApprovalFlow);
    const approvalFlowData = await approvalFlowRepo.find({
      where: {
        leave_id: id,
        status: status.Active.toString(),
      },
      relations: ["employee"],
    });
    if (!approvalFlowData) {
      return h.response({ message: "Data not Found" }).code(404);
    }
    const transformData = approvalFlowData.map((each) => ({
      approverId: each.approver_id,
      name: each.employee.name,
      approvedAt: each?.approved_at,
      approvedStatus: Object.keys(approvalStatus)[each.approval_status],
      comments: each?.comments,
    }));
    return h.response(transformData).code(200);
  } catch (err) {
    console.log(err);
    return h.response({ message: "Internal Server Failed" }).code(500);
  }
};
module.exports = { fetchAllApprovalRequestByLeaveId };
