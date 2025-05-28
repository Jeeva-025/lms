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

const bgColors = [
  "bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200",
  "bg-gradient-to-r from-green-50 to-green-100 border border-green-200",
  "bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200",
  "bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200",
  "bg-gradient-to-r from-pink-50 to-pink-100 border border-pink-200",
];

const LeaveApproval = () => {
  // const leaveRequests = [
  //   {
  //     name: "Jeeva M",
  //     designation: "Software Engineer",
  //     leaveType: "casual",
  //     reason:
  //       "I need to attend a personal event that requires travel outside the city. This leave is essential for handling family responsibilities.",
  //     startDate: "2025-06-10",
  //     endDate: "2025-06-12",
  //     requestedDate: "2025-06-01",
  //     availableLeaves: {
  //       casual: 5,
  //       sick: 3,
  //       earned: 10,
  //     },
  //     type: "Member",
  //   },
  //   {
  //     name: "Aarthi R",
  //     designation: "HR Manager",
  //     leaveType: "sick",
  //     reason:
  //       "I have been advised bed rest due to viral fever and body pain. Medical certificate can be provided on request.",
  //     startDate: "2025-06-05",
  //     endDate: "2025-06-07",
  //     requestedDate: "2025-06-04",
  //     availableLeaves: {
  //       casual: 4,
  //       sick: 2,
  //       earned: 8,
  //     },
  //     type: "Admin",
  //   },
  //   {
  //     name: "Karthik V",
  //     designation: "Team Lead",
  //     leaveType: "earned",

  //     startDate: "2025-06-15",
  //     endDate: "2025-06-20",
  //     requestedDate: "2025-06-08",
  //     availableLeaves: {
  //       casual: 2,
  //       sick: 5,
  //       earned: 7,
  //     },
  //     type: "Admin",
  //     reason:
  //       "I'm attending a wedding ceremony of a close family member, and this requires a few days of travel and preparation.",
  //   },
  //   {
  //     name: "Karthik V",
  //     designation: "Team Lead",
  //     leaveType: "earned",
  //     reason:
  //       "I'm attending a wedding ceremony of a close family member, and this requires a few days of travel and preparation.",
  //     startDate: "2025-06-15",
  //     endDate: "2025-06-20",
  //     requestedDate: "2025-06-08",
  //     availableLeaves: {
  //       casual: 2,
  //       sick: 5,
  //       earned: 7,
  //     },
  //     type: "Admin",
  //   },
  //   {
  //     name: "Karthik V",
  //     designation: "Team Lead",
  //     leaveType: "earned",
  //     reason:
  //       "I'm attending a wedding ceremony of a close family member, and this requires a few days of travel and preparation.",
  //     startDate: "2025-06-15",
  //     endDate: "2025-06-20",
  //     requestedDate: "2025-06-08",
  //     availableLeaves: {
  //       casual: 2,
  //       sick: 5,
  //       earned: 7,
  //     },
  //     type: "Admin",
  //   },
  // ];

  const [count, setCount] = useState(0);
  const [showLeaveInfo, setShowLeaveInfo] = useState(null);
  const [showTypeFilter, setShowTypeFilter] = useState(false);
  const [selectedType, setSelectedType] = useState("All");
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [selectedData, setSelectedData] = useState(null);

  // const handleTypeFilter = (type) => {
  //   setSelectedType(type);
  //   setShowTypeFilter(false);

  //   if (type === "All") {
  //     setFilteredRequests(leaveRequests);
  //   } else {
  //     setFilteredRequests(
  //       leaveRequests.filter((request) => request.type === type)
  //     );
  //   }
  // };

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
    try {
      const response = await axios.post(
        "http://localhost:3000/leaveApproval",
        {
          id: data.id,
          leave_id:
            data.leaveType.trim().toLowerCase() === "earned leave"
              ? 1
              : data.leaveType.trim().toLowerCase() === "sick leave"
              ? 2
              : 3,
          employee_id: data.employeeId,
        },
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

  const handleReject = async (data) => {
    try {
      const response = await axios.patch(
        `http://localhost:3000/rejectLeave/${data.id}`,
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

  const fetchRequestedLeave = async (str, key) => {
    try {
      const employeeId = JSON.parse(localStorage.getItem("Employee")).id;
      const response = await axios.get(
        `http://localhost:3000${str}?${key}=${employeeId}`,

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
          },
        }
      );

      setFilteredRequests(response?.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const employee = JSON.parse(localStorage.getItem("Employee"));
    const designation = employee.designation.trim().toLowerCase();

    switch (designation) {
      case "manager":
        fetchRequestedLeave("/allrequestedLeavetoManager", "manager_id");
        break;
      case "hr":
        fetchRequestedLeave("/allrequestedLeavetoHR", "hr_id");
        break;
      default:
        fetchRequestedLeave("/allrequestedLeavetoDirector", "director_id");
        break;
    }
  }, [count]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {filteredRequests.length > 0 ? (
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <FiFileText className="text-blue-600" /> Leave Requests
            </h2>

            <div className="relative">
              <button
                onClick={() => setShowTypeFilter(!showTypeFilter)}
                className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-300 shadow-sm hover:bg-gray-50 transition-colors"
              >
                <FiFilter className="text-gray-600" />
                <span>Filter by Type: {selectedType}</span>
                {showTypeFilter ? <FiChevronUp /> : <FiChevronDown />}
              </button>

              {showTypeFilter && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                  <div className="py-1">
                    <button
                      onClick={() => handleTypeFilter("All")}
                      className={`block px-4 py-2 text-sm w-full text-left ${
                        selectedType === "All"
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      All Types
                    </button>
                    <button
                      onClick={() => handleTypeFilter("Admin")}
                      className={`block px-4 py-2 text-sm w-full text-left ${
                        selectedType === "Admin"
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      Admin
                    </button>
                    <button
                      onClick={() => handleTypeFilter("Member")}
                      className={`block px-4 py-2 text-sm w-full text-left ${
                        selectedType === "Member"
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      Member
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

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
                      <img
                        src={`https://i.pravatar.cc/150?img=${index + 10}`}
                        alt="avatar"
                        className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <FaUser className="text-gray-600" /> {data.name}
                        </h3>
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <FaBriefcase className="text-gray-500" />{" "}
                          {data.designation}
                        </p>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${getTypeBadgeColor(
                            data.type
                          )} mt-1 inline-block`}
                        >
                          {data.type}
                        </span>
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
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-4 text-lg font-medium">
          No Leave Requests Found
        </div>
      )}
    </div>
  );
};

export default LeaveApproval;
