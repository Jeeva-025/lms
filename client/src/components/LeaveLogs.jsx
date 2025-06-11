import React from "react";
import { FaFilter, FaSearch, FaEllipsisV } from "react-icons/fa";
import { useState } from "react";
import Filter from "./Filter";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";
import ApprovalTracker from "./ApprovalTracker";
import { FiDownload } from "react-icons/fi";
import { FaTimes } from "react-icons/fa";
import API from "../utils/API";

const LeaveLogs = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState({
    leaveType: null,
    startDate: null,
    endDate: null,
    approvalStatus: "",
  });
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [leaveToCancel, setLeaveToCancel] = useState(null);
  const [showTracker, setShowTracker] = useState(false);
  let tableData;

  const [leaves, setLeaves] = useState([]);
  const [isFilterApplied, setFilterApplied] = useState(false);

  const getStatusStyles = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "canceled":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewDetails = (leave) => {
    setSelectedLeave(leave);
    setShowDetailsModal(true);
  };
  const handleTracker = (leave) => {
    console.log(leave);
    setSelectedLeave(leave);
    setShowTracker(true);
  };

  const handleCancelLeave = (leave) => {
    setLeaveToCancel(leave);
    setShowCancelConfirm(true);
    console.log(leave);
  };

  const confirmCancelLeave = async () => {
    // setLeaves(leaves.filter((leave) => leave.id !== leaveToCancel.id));/
    try {
      const response = await axios.patch(
        `${API.BASE_URL}${API.CANCEL_LEAVE_REQUEST}`,
        { id: leaveToCancel.leaveId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
          },
        }
      );
      fetchAllLeaveLogs();
    } catch (err) {
      console.log(err);
    }
    setShowCancelConfirm(false);
    setLeaveToCancel(null);
  };

  const fetchAllLeaveLogs = async (data = {}) => {
    const employeeId = JSON.parse(localStorage.getItem("Employee")).id;
    const params = new URLSearchParams();
    params.append("employee_id", employeeId);

    if (data?.leaveType?.id)
      params.append("leave_type_id", data?.leaveType?.id);
    if (data?.startDate) params.append("start_date", data?.startDate);
    if (data?.endDate) params.append("end_date", data?.endDate);
    if (data?.approvalStatus)
      params.append("approval_status", data?.approvalStatus);

    try {
      const response = await axios.get(
        `${API.BASE_URL}${API.EMPLOYEE_LEAVE_REQUEST}?${params.toString()}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
          },
        }
      );
      console.log(response?.data);
      tableData = response?.data;

      setLeaves(tableData);
    } catch (err) {
      console.log(err);
      toast.error("Login failed! Please try again.", {
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

  const filteredData =
    leaves?.length > 0 &&
    leaves.filter((item) =>
      Object.values(item).some(
        (value) =>
          typeof value === "string" &&
          value.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  const arr = [
    "Leave Type",
    "Start Date",
    "End Date",
    "Status",
    "No of Days",
    "Reason",
  ];
  const handleClearFilter = () => {
    fetchAllLeaveLogs();
    setFilterApplied(false);
  };

  useEffect(() => {
    fetchAllLeaveLogs();
  }, []);
  if (filteredData.length) {
    console.log(filteredData);
  }
  return (
    <div className="flex flex-col mt-6 relative bg-white rounded-xl p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Leave History
          </h1>
          <p className="text-gray-500">Track and manage your leave requests</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search leave records..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button
            disabled={filteredData.length === 0}
            onClick={() => setShowFilter(true)}
            className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-lg text-purple-700 font-medium hover:shadow-md transition-all ${
              filteredData.length === 0
                ? "cursor-not-allowed opacity-10"
                : "cursor-pointer "
            }`}
          >
            <FaFilter />
            <span>Filter</span>
          </button>
          {isFilterApplied && (
            <button
              disabled={filteredData.length === 0}
              onClick={handleClearFilter}
              className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-50 to-rose-100 border border-rose-200 rounded-lg text-rose-700 font-medium hover:shadow-md transition-all ${
                filteredData.length === 0
                  ? "cursor-not-allowed"
                  : "cursor-pointer"
              }`}
            >
              <FaTimes />
              <span>Clear</span>
            </button>
          )}
          <a href="/company_leave_policy.pdf" download title="Leave Policy">
            <FiDownload className="text-2xl cursor-pointer text-blue-600" />
          </a>
        </div>
      </div>
      {filteredData.length > 0 ? (
        <>
          <div className=" rounded-lg border border-gray-200 max-h-[calc(100vh-300px)] overflow-auto custom-scrollbar">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {leaves?.length > 0 &&
                    arr.map((key, index) => (
                      <th
                        key={index}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {key.split(/(?=[A-Z])/).join(" ")}
                      </th>
                    ))}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData?.length > 0 &&
                  filteredData.map((row, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {row.leaveName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {row.startDate.split("-").join(".")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {row.endDate.split("-").join(".")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyles(
                            row.approvalStatus
                          )}`}
                        >
                          {row.approvalStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {row.noOfDays}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {row.reason}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 relative">
                        <div className="dropdown">
                          <button
                            className="p-1 rounded-full hover:bg-gray-200 focus:outline-none"
                            onClick={(e) => {
                              e.stopPropagation();
                              document
                                .getElementById(`dropdown-${index}`)
                                .classList.toggle("hidden");
                            }}
                          >
                            <FaEllipsisV className="text-gray-500" />
                          </button>
                          <div
                            id={`dropdown-${index}`}
                            className="hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200"
                          >
                            <div className="py-1">
                              <button
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => handleViewDetails(row)}
                              >
                                View Details
                              </button>
                              <button
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => handleTracker(row)}
                              >
                                Track Leave
                              </button>
                              {row.approvalStatus.trim().toLowerCase() ===
                                "pending" && (
                                <button
                                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                  onClick={() => handleCancelLeave(row)}
                                >
                                  Cancel Leave
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {showFilter && (
            <div className="fixed inset-0 bg-black/30 flex items-center justify-end z-50 backdrop-blur-sm">
              <Filter
                data={data}
                setData={setData}
                setShowFilter={setShowFilter}
                handleApply={fetchAllLeaveLogs}
                setFilterApplied={setFilterApplied}
              />
            </div>
          )}
          {showTracker && selectedLeave && (
            <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 backdrop-blur-sm">
              <ApprovalTracker
                leave={selectedLeave}
                onClose={() => setShowTracker(false)}
              />
            </div>
          )}

          {showDetailsModal && selectedLeave && (
            <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 backdrop-blur-sm">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h2 className="text-xl font-semibold mb-4">Leave Details</h2>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Leave Type</p>
                    <p className="font-medium">{selectedLeave.leaveType}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Start Date</p>
                      <p className="font-medium">
                        {selectedLeave.startDate.split("-").join(".")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">End Date</p>
                      <p className="font-medium">
                        {selectedLeave.endDate.split("-").join(".")}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyles(
                          selectedLeave.approvalStatus
                        )}`}
                      >
                        {selectedLeave.approvalStatus}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-medium">{selectedLeave.noOfDays}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Reason</p>
                    <p className="font-medium mt-1 whitespace-pre-line">
                      {selectedLeave.reason}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {showCancelConfirm && leaveToCancel && (
            <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 backdrop-blur-sm">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h2 className="text-xl font-semibold mb-4">
                  Cancel Leave Request
                </h2>
                <p className="mb-6">
                  Are you sure you want to cancel this leave request? This
                  action cannot be undone.
                </p>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowCancelConfirm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none"
                  >
                    No, Keep It
                  </button>
                  <button
                    onClick={confirmCancelLeave}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none"
                  >
                    Yes, Cancel Leave
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center mt-10 text-gray-500">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
            alt="No data"
            className="w-32 h-32 mb-4 opacity-70"
          />
          <div className="text-center text-lg font-medium">
            No Leave Logs Found
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveLogs;
