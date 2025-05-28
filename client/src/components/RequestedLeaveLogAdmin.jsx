import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";

const RequestedLeaveLogAdmin = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [loading, setLoading] = useState(true);

  const strLowerCase = (str) => {
    return str.trim().toLowerCase();
  };

  const fetchLeaveHistory = async (key, value) => {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:3000/fetchLeaveHistoryToAdmin",
        { [key]: value },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      setLeaveRequests(response.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      toast.error("Failed To Fetch History");
      setLoading(false);
    }
  };

  useEffect(() => {
    const employee = JSON.parse(localStorage.getItem("Employee"));
    const designation = employee.designation;
    const id = employee.id;
    switch (strLowerCase(designation)) {
      case "manager":
        fetchLeaveHistory("manager_id", id);
        break;
      case "hr":
        fetchLeaveHistory("hr_id", id);
        break;
      default:
        fetchLeaveHistory("director_id", id);
        break;
    }
  }, []);

  const filteredRequests = leaveRequests.filter((request) => {
    const statusMatch =
      filterStatus === "all" || request.status.toLowerCase() === filterStatus;
    const typeMatch =
      filterType === "all" ||
      request.leaveType.toLowerCase().includes(filterType);
    return statusMatch && typeMatch;
  });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getLeaveTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case "sick leave":
        return "bg-purple-100 text-purple-800";
      case "casual leave":
        return "bg-blue-100 text-blue-800";
      case "earned leave":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
          Leave Request History
        </h1>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-6 space-y-4 md:space-y-0">
            <div className="w-full md:w-auto">
              <label
                htmlFor="status-filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Filter by Status
              </label>
              <select
                id="status-filter"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 border"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="pending">Pending</option>
              </select>
            </div>

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
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="sick">Sick Leave</option>
                <option value="casual">Casual Leave</option>
                <option value="earned">Earned Leave</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        )}

        {/* No results */}
        {!loading && filteredRequests.length === 0 && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 text-lg">
              No leave requests found matching your filters.
            </p>
          </div>
        )}

        {/* Leave Request Cards */}
        <div
          className="overflow-y-auto custom-scrollbar"
          style={{ maxHeight: "calc(100vh - 290px)" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto custom-scrollbar">
            {filteredRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {request.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {request.designation} • #{request.employeeId}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        request.status
                      )}`}
                    >
                      {request.status}
                    </span>
                  </div>

                  <div className="mb-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLeaveTypeColor(
                        request.leaveType
                      )}`}
                    >
                      {request.leaveType}
                    </span>
                    <span className="ml-2 text-sm text-gray-600">
                      {request.noOfDays}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-4 text-sm">
                    <div>
                      <p className="text-gray-500">Start Date</p>
                      <p className="font-medium">
                        {formatDate(request.startDate)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-500">End Date</p>
                      <p className="font-medium">
                        {formatDate(request.endDate)}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">Reason</p>
                    <p className="text-gray-700 text-sm">{request.reason}</p>
                  </div>

                  <div className="border-t border-gray-200 pt-3">
                    <p className="text-xs text-gray-500">
                      Available Leaves:
                      <span className="ml-1 text-gray-700">
                        Sick: {request.availableLeaves.sick}, Casual:{" "}
                        {request.availableLeaves.casual}, Earned:{" "}
                        {request.availableLeaves.earned}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestedLeaveLogAdmin;
