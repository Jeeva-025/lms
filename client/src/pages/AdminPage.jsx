import React from "react";
import { useState } from "react";
import LeaveDetailsCards from "../components/LeaveDetailsCards";
import LeaveRequest from "../components/LeaveRequest";
import LeaveApproval from "../components/LeaveApproval";
import AddPeople from "../components/AddPeople";
import AdminLeaveLogs from "../components/AdminLeaveLogs";
import LeaveLogs from "../components/LeaveLogs";
import RequestedLeaveLogAdmin from "../components/RequestedLeaveLogAdmin";

const AdminPage = ({ arr, setSelectedValue, selectedValue }) => {
  const [token, setToken] = useState(localStorage.getItem("Token"));
  const employee = JSON.parse(localStorage.getItem("Employee"));
  const [viewMode, setViewMode] = useState("pending");

  const strLowerCase = (str) => {
    return str.trim().toLowerCase();
  };
  console.log(strLowerCase("  Hllow EEE    "));
  return (
    <div className="h-full bg-gray-100">
      {strLowerCase(selectedValue) === "dashboard" && (
        <div className="p-4 w-full overflow-hidden  ">
          <LeaveDetailsCards />
          <LeaveLogs />
        </div>
      )}
      {strLowerCase(selectedValue) === "requested leave" && (
        <div className="p-4 w-full overflow-hidden">
          <div className="flex flex-row space-x-2">
            <p
              className={`px-4 py-2 rounded-full cursor-pointer transition-all duration-300 text-sm font-medium 
      ${
        viewMode === "pending"
          ? "bg-blue-600 text-white shadow-md"
          : "bg-white text-gray-700 hover:bg-blue-100"
      }`}
              onClick={() => setViewMode("pending")}
            >
              Pending Request
            </p>
            <p
              className={`px-4 py-2 rounded-full cursor-pointer transition-all duration-300 text-sm font-medium 
      ${
        viewMode === "history"
          ? "bg-blue-600 text-white shadow-md"
          : "bg-white text-gray-700 hover:bg-blue-100"
      }`}
              onClick={() => setViewMode("history")}
            >
              History
            </p>
          </div>

          {viewMode === "pending" && <LeaveApproval />}
          {viewMode === "history" && <RequestedLeaveLogAdmin />}
        </div>
      )}
      {strLowerCase(employee.designation) === "hr" &&
        strLowerCase(selectedValue) === "add people" && (
          <div className="h-full p-4 w-full  bg-gradient-to-br from-[#e9f0ff] via-[#dbeeff] to-[#f3f7ff]">
            <AddPeople />
          </div>
        )}

      {strLowerCase(selectedValue) === "request leave" && (
        <div className="p-4 w-full overflow-hidden">
          <LeaveRequest />
        </div>
      )}
    </div>
  );
};

export default AdminPage;
