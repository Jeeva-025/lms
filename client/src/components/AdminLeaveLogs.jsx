import React, { useState } from "react";
import { FaFilter, FaEllipsisV } from "react-icons/fa";
import Filter from "./Filter";
import { useEffect } from "react";
import axios from "axios";

const AdminLeaveLogs = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showOptions, setShowOptions] = useState(null);
  const [showLeaveDetails, setShowLeaveDetails] = useState(false);
  const [showRemainingLeaves, setShowRemainingLeaves] = useState(false);
  const [leaves, setLeaves] = useState([]);

  const [data, setData] = useState({
    leaveType: "",
    startDate: null,
    endDate: null,
    status: "",
  });

  

  const getColor = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "text-green-600";
      case "pending":
        return "text-yellow-600";
      case "rejected":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const handleOptionsClick = (index, e) => {
    e.stopPropagation();
    setShowOptions(showOptions === index ? null : index);
  };

  const formatDate = (dateString) => {
    return dateString.split("-").join(".");
  };

  const fetchEmployeesRequestedLeave = async (str, key) => {
    try {
      const response = await axios.post(
        `http://localhost:3000${str}`,
        {
          [key]: JSON.parse(localStorage.getItem("Employee")).id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
          },
        }
      );

      console.log(response);
      setLeaves(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const employee = JSON.parse(localStorage.getItem("Employee"));
    const designation = employee.designation.trim().toLowerCase();
    console.log(designation);

    switch (designation) {
      case "manager":
        fetchEmployeesRequestedLeave(
          "/allrequestedLeavetoManager",
          "manager_id"
        );
        break;
      case "hr":
        fetchEmployeesRequestedLeave("/allrequestedLeavetoHR", "hr_id");
        break;
      default:
        fetchEmployeesRequestedLeave(
          "/allrequestedLeavetoDirector",
          "director_id"
        );
        break;
    }
  }, []);
  console.log(selectedRow);
  return (
    <div className="flex flex-col mt-6 relative">
      {leaves.length > 0 ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-700">
              Leave History
            </h1>
            <button
              disabled={leaves.length === 0}
              onClick={() => setShowFilter(!showFilter)}
              className={`flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors ${
                leaves.length === 0 ? "cursor-not-allowed" : "cursor-pointer "
              }`}
            >
              <FaFilter />
              <span>Filter</span>
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Designation
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Leave Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dates
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leaves.map((row, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors"
                      onClick={() => setSelectedRow(row)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                            {row.name.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {row.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {row.designation}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {row.leaveType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(row.startDate)} - {formatDate(row.endDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {row.noOfDays}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getColor(
                            row.status
                          )} bg-opacity-20 ${getColor(row.status).replace(
                            "text",
                            "bg"
                          )}`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                        <button
                          onClick={(e) => handleOptionsClick(index, e)}
                          className="text-gray-400 hover:text-gray-600 focus:outline-none"
                        >
                          <FaEllipsisV />
                        </button>
                        {showOptions === index && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                            <div className="py-1">
                              <button
                                onClick={() => {
                                  setSelectedRow(row);
                                  setShowLeaveDetails(true);
                                  setShowOptions(null);
                                }}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                Leave Details
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedRow(row);
                                  setShowRemainingLeaves(true);
                                  setShowOptions(null);
                                }}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                Remaining Leaves
                              </button>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {showFilter && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-end z-50">
              <Filter
                data={data}
                setData={setData}
                setShowFilter={setShowFilter}
              />
            </div>
          )}

          {showLeaveDetails && selectedRow && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    Leave Details
                  </h3>
                </div>
                <div className="px-6 py-4 space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Employee Name</p>
                    <p className="text-gray-900">{selectedRow.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Designation</p>
                    <p className="text-gray-900">{selectedRow.designation}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Leave Type</p>
                    <p className="text-gray-900">{selectedRow.leaveType}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Start Date</p>
                      <p className="text-gray-900">
                        {formatDate(selectedRow.startDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">End Date</p>
                      <p className="text-gray-900">
                        {formatDate(selectedRow.endDate)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="text-gray-900">{selectedRow.noOfDays}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className={`${getColor(selectedRow.status)}`}>
                      {selectedRow.status}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Reason</p>
                    <p className="text-gray-900 mt-1">{selectedRow.reason}</p>
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
                  <button
                    onClick={() => setShowLeaveDetails(false)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {showRemainingLeaves && selectedRow && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    Remaining Leaves for {selectedRow.name}
                  </h3>
                </div>
                <div className="px-6 py-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Sick Leave</p>
                      <p className="text-2xl font-semibold text-blue-600">
                        {selectedRow.availableLeaves.sick} days
                      </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Casual Leave</p>
                      <p className="text-2xl font-semibold text-green-600">
                        {selectedRow.availableLeaves.casual} days
                      </p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Earned Leave</p>
                      <p className="text-2xl font-semibold text-purple-600">
                        {selectedRow.availableLeaves.earned} days
                      </p>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
                  <button
                    onClick={() => setShowRemainingLeaves(false)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center text-gray-500 mt-4 text-lg font-medium">
          No Leave Logs Found
        </div>
      )}
    </div>
  );
};

export default AdminLeaveLogs;
