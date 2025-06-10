import React from "react";
import { useState } from "react";
import LeaveDetailsCards from "../components/LeaveDetailsCards";
import LeaveRequest from "../components/LeaveRequest";
import LeaveLogs from "../components/LeaveLogs";
import { useEffect } from "react";
import LeaveCalendar from "../components/LeaveCalender";

const MemberPage = ({ selectedValue }) => {
  const [token, setToken] = useState(localStorage.getItem("Token"));
  const strLowerCase = (str) => {
    return str.trim().toLowerCase();
  };
  console.log(strLowerCase("Applae HHHH"));

  return (
    <div className="h-full bg-gray-100">
      {strLowerCase(selectedValue) === "dashboard" && (
        <div className="p-4 w-full overflow-hidden  ">
          <LeaveDetailsCards />
          <LeaveLogs />
        </div>
      )}
      {strLowerCase(selectedValue) === "request leave" && (
        <div className="p-4 w-full overflow-hidden">
          <LeaveRequest />
        </div>
      )}
      {strLowerCase(selectedValue) === "calendar" && (
        <div className="p-4 w-full overflow-hidden">
          <LeaveCalendar />
        </div>
      )}
    </div>
  );
};

export default MemberPage;
