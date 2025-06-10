import React from "react";
import { FiCheck, FiX, FiClock, FiUser, FiXCircle } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import API from "../utils/API";

const ApprovalTracker = ({ leave, onClose }) => {
  const [approvals, setApproval] = useState([]);
  const statusConfig = {
    Approved: {
      icon: <FaCheckCircle className="text-green-500 text-lg" />,
      lineColor: "bg-green-500",
      textColor: "text-green-600",
    },
    Rejected: {
      icon: <FaTimesCircle className="text-red-500 text-lg" />,
      lineColor: "bg-red-100",
      textColor: "text-red-600",
    },
    Pending: {
      icon: <FaClock className="text-blue-500 text-lg" />,
      lineColor: "bg-gray-300 border-2 border-dashed border-blue-400",
      textColor: "text-blue-600",
    },
    Cancelled: {
      icon: <FiX className="text-orange-500 text-lg" />,
      lineColor: "bg-orange-500",
      textColor: "text-orange-600",
    },
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Pending";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };
  console.log(leave);
  const fetchRequestedApproval = async () => {
    try {
      const response = await axios.get(
        `${API.BASE_URL}${API.ALL_REQUESTED_APPROVAL_FLOW}/${leave.leaveId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      setApproval(response?.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to Fetch Data!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    }
  };
  const isCancelled = approvals.some((a) => a.approvedStatus === "Cancelled");

  useEffect(() => {
    fetchRequestedApproval();
  }, []);

  return (
    // <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
    //   <div className="flex flex-row justify-between items-center">
    //     <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
    //       <FiUser className="mr-2 text-blue-500" />
    //       Approval Progress
    //     </h2>

    //     <button
    //       onClick={onClose}
    //       className=" p-1 rounded-full hover:bg-gray-100 transition-colors"
    //       aria-label="Close approval tracker"
    //     >
    //       <FiXCircle className="text-gray-500 text-2xl hover:text-gray-700" />
    //     </button>
    //   </div>

    //   <div className="relative">
    //     {/* Vertical line */}
    //     <div className="absolute left-5 top-0 h-full w-0.5 bg-gray-200"></div>

    //     {approvals.map((approval, index) => {
    //       const isLast = index === approvals.length - 1;
    //       const status =
    //         statusConfig[approval.approvedStatus] || statusConfig.Pending;

    //       return (
    //         <div key={approval.approverId} className="relative pl-10 pb-6">
    //           {/* Status icon with connecting line */}
    //           <div
    //             className={`absolute left-0 w-4 h-4 rounded-full flex items-center justify-center z-10 ${status.lineColor} ${status.textColor}`}
    //           >
    //             {status.icon}
    //           </div>

    //           {/* Conditional connecting line */}
    //           {!isLast && (
    //             <div
    //               className={`absolute left-[7px] top-4 h-full w-0.5 ${
    //                 approvals[index + 1].approvedStatus === "Approved"
    //                   ? "bg-green-500"
    //                   : approvals[index + 1].approvedStatus === "Rejected"
    //                   ? "bg-red-500"
    //                   : "bg-gray-300 border-l-2 border-dashed border-blue-400"
    //               }`}
    //             ></div>
    //           )}

    //           {/* Approval details */}
    //           <div className="ml-2">
    //             <div className="flex justify-between items-start">
    //               <h3 className="font-medium text-gray-800">{approval.name}</h3>
    //               <span
    //                 className={`text-xs font-medium px-2 py-1 rounded-full ${status.textColor}`}
    //               >
    //                 {approval.approvedStatus}
    //               </span>
    //             </div>
    //             <p className="text-xs text-gray-500 mt-1">
    //               {formatDate(approval.approvedAt)}
    //             </p>
    //             {approval.comments && (
    //               <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-700">
    //                 <p className="font-medium">Note:</p>
    //                 <p>{approval.comments}</p>
    //               </div>
    //             )}
    //           </div>
    //         </div>
    //       );
    //     })}
    //   </div>
    // </div>

    <div className="min-w-md p-6 bg-white rounded-xl relative shadow-sm border border-gray-100 mx-4">
      <div className="flex items-center mb-6">
        <FiUser className="mr-2 text-blue-500 text-xl" />
        <h2 className="text-xl font-semibold text-gray-800">
          Approval Progress
        </h2>
      </div>

      <button
        onClick={onClose}
        className="absolute top-0 right-0 p-1 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Close approval tracker"
      >
        <IoClose className="text-gray-500 text-2xl hover:text-gray-700" />
      </button>

      {approvals.some((a) => a.approvedStatus === "Cancelled") ? (
        <div className="text-center mt-8">
          <FiX className="text-orange-500 text-3xl mx-auto mb-2" />
          <p className="text-lg font-medium text-orange-600">
            Leave has been cancelled by you.
          </p>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-5 top-0 h-full w-0.5 bg-gray-200"></div>

          {approvals.map((approval, index) => {
            const isLast = index === approvals.length - 1;
            const status =
              statusConfig[approval.approvedStatus] || statusConfig.Pending;

            return (
              <div key={approval.approverId} className="relative pl-10 pb-6">
                <div
                  className={`absolute left-0 w-4 h-4 rounded-full flex items-center justify-center z-10 ${status.lineColor} ${status.textColor}`}
                >
                  {status.icon}
                </div>

                {!isLast && (
                  <div
                    className={`absolute left-[7px] top-4 h-full w-0.5 ${
                      approvals[index + 1].approvedStatus === "Approved"
                        ? "bg-green-500"
                        : approvals[index + 1].approvedStatus === "Rejected"
                        ? "bg-red-500"
                        : "bg-gray-300 border-l-2 border-dashed border-blue-400"
                    }`}
                  ></div>
                )}

                <div className="ml-2">
                  <div className="flex justify-start items-start">
                    <h3 className="font-medium text-gray-800">
                      {approval.name}
                    </h3>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${status.textColor}`}
                    >
                      {approval.approvedStatus}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {!approval.approvedAt
                      ? approval.approvedStatus
                      : formatDate(approval.approvedAt)}
                  </p>
                  {approval.comments && (
                    <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-700">
                      <p className="font-medium">Note:</p>
                      <p>{approval.comments}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ApprovalTracker;
