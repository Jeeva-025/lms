import React, { useState } from "react";
import {
  FiInfo,
  FiFilter,
  FiChevronDown,
  FiChevronUp,
  FiCheck,
  FiClock,
  FiCalendar,
  FiUser,
  FiBriefcase,
  FiFileText,
} from "react-icons/fi";
import {
  FaUser,
  FaBriefcase,
  FaCalendarAlt,
  FaRegCheckCircle,
  FaRegTimesCircle,
} from "react-icons/fa";
import { useEffect } from "react";
import axios from "axios";
import { Player } from "@lottiefiles/react-lottie-player";

const bgColors = [
  "bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200",
  "bg-gradient-to-r from-green-50 to-green-100 border border-green-200",
  "bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200",
  "bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200",
  "bg-gradient-to-r from-pink-50 to-pink-100 border border-pink-200",
];

const LeaveApproval = () => {
  const [count, setCount] = useState(0);
  const [showLeaveInfo, setShowLeaveInfo] = useState(null);
  const [showTypeFilter, setShowTypeFilter] = useState(false);
  const [selectedType, setSelectedType] = useState("All");
  const [leaveRequest, setLeaveRequest] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [filterType, setFilterType] = useState("all");

  const getLeaveTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case "casual":
        return "bg-blue-100 text-blue-800";
      case "sick":
        return "bg-green-100 text-green-800";
      case "earned":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeBadgeColor = (type) => {
    return type === "Admin"
      ? "bg-indigo-100 text-indigo-800"
      : "bg-teal-100 text-teal-800";
  };

  const handleApproval = async (data) => {
    console.log(data.id);
    try {
      const response = await axios.patch(
        "http://localhost:3000/approval-of-leave",
        {
          id: data.approvalFlowId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
          },
        }
      );
      console.log(response);
      setCount(count + 1);
    } catch (err) {
      console.log(err);
    }
  };

  const handleReject = async (data) => {
    try {
      const response = await axios.patch(
        `http://localhost:3000/rejectLeave/${data.approvalFlowId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
          },
        }
      );

      setCount(count + 1);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchRequestedLeave = async () => {
    console.log("herrlo from api");
    try {
      const employeeId = JSON.parse(localStorage.getItem("Employee")).id;
      const response = await axios.get(
        `http://localhost:3000/all-requestedLeave-for-approval?id=${employeeId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
          },
        }
      );

      console.log(response.data);
      setLeaveRequest(response?.data);
      setFilteredRequests(response?.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchRequestedLeave();
  }, [count]);

  const handleTypeFilter = (type) => {
    setFilterType(type);
    setShowTypeFilter(false);

    if (type === "all") {
      setFilteredRequests(leaveRequest);
    } else {
      setFilteredRequests(
        leaveRequest.filter((request) =>
          request.leaveType
            .trim()
            .toLowerCase()
            .includes(type.trim().toLowerCase())
        )
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FiFileText className="text-blue-600" /> Leave Requests
          </h2>

          <div className="w-full md:w-auto">
            <label
              htmlFor="type-filter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Filter by Leave Type
            </label>
            <select
              id="type-filter"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 border"
              value={filterType}
              onChange={(e) => handleTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="sick">Sick Leave</option>
              <option value="casual">Casual Leave</option>
              <option value="earned">Earned Leave</option>
            </select>
          </div>
        </div>
        {filteredRequests.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRequests.map((data, index) => {
              const bgColor = bgColors[index % bgColors.length];

              return (
                <div
                  key={index}
                  className={`${bgColor} p-5 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-3">
                      {/* <img
                        src={`https://i.pravatar.cc/150?img=${index + 10}`}
                        alt="avatar"
                        className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                      /> */}

                      <div className="w-10 h-10 bg-gray-600 text-white rounded-full flex items-center justify-center font-semibold text-lg">
                        {data?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <FaUser className="text-gray-600" /> {data.name}
                        </h3>
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <FaBriefcase className="text-gray-500" />{" "}
                          {data.designation}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setShowLeaveInfo(showLeaveInfo === index ? null : index)
                      }
                      className="text-gray-500 hover:text-blue-600 transition-colors p-1"
                    >
                      <FiInfo className="text-xl" />
                    </button>
                  </div>

                  {showLeaveInfo === index && (
                    <div className="bg-white p-3 rounded-lg text-sm text-gray-700 mb-4 shadow-sm border border-gray-200">
                      <p className="font-medium text-gray-800 flex items-center gap-2 mb-2">
                        <FiInfo className="text-blue-500" /> Available Leaves
                      </p>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-blue-50 p-2 rounded">
                          <p className="text-xs text-blue-600">Casual</p>
                          <p className="font-semibold">
                            {data.availableLeaves.casual}
                          </p>
                        </div>
                        <div className="bg-green-50 p-2 rounded">
                          <p className="text-xs text-green-600">Sick</p>
                          <p className="font-semibold">
                            {data.availableLeaves.sick}
                          </p>
                        </div>
                        <div className="bg-purple-50 p-2 rounded">
                          <p className="text-xs text-purple-600">Earned</p>
                          <p className="font-semibold">
                            {data.availableLeaves.earned}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded ${getLeaveTypeColor(
                          data.leaveType
                        )}`}
                      >
                        {data.leaveType.charAt(0).toUpperCase() +
                          data.leaveType.slice(1)}{" "}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <FiClock className="text-gray-400" />
                        {new Date(data.requestedDate).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex items-center gap-1 text-gray-700">
                        <FiCalendar className="text-gray-500" />
                        <span>
                          {new Date(data.startDate).toLocaleDateString()}
                        </span>
                      </div>
                      <span className="text-gray-400">→</span>
                      <div className="flex items-center gap-1 text-gray-700">
                        <FiCalendar className="text-gray-500" />
                        <span>
                          {new Date(data.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-5">
                    <p className="text-sm font-medium text-gray-800 mb-2 flex items-center gap-2">
                      <FiFileText className="text-gray-500" /> Reason
                    </p>
                    <p className="text-sm text-gray-600 bg-white p-3 rounded border border-gray-200">
                      {data.reason}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        handleApproval(data);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-sm transition font-medium text-sm"
                    >
                      <FaRegCheckCircle /> Approve
                    </button>
                    <button
                      onClick={() => {
                        handleReject(data);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-sm transition font-medium text-sm"
                    >
                      <FaRegTimesCircle /> Reject
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center mt-10 text-gray-500">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
              alt="No data"
              className="w-32 h-32 mb-4 opacity-70"
            />
            <div className="text-center text-lg font-medium">
              No Leave Requests Found
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveApproval;
