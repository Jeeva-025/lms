import React from "react";
import { useState } from "react";
import { RxDashboard } from "react-icons/rx";
import { LuFileText } from "react-icons/lu";
import { IoIosLogOut } from "react-icons/io";
import { FcApproval } from "react-icons/fc";
import { FaUsers, FaCalendarAlt } from "react-icons/fa";
import { IoIosPersonAdd } from "react-icons/io";

const MemberNavBar = ({ arr, selectedValue, setSelectedValue, setToken }) => {
  const employee = JSON.parse(localStorage.getItem("Employee"));

  const getIcon = (label) => {
    if (label === "Dashboard") {
      return <RxDashboard size={24} className="text-[#D7AB19] pr-2" />;
    } else if (label === "Request Leave") {
      return <LuFileText size={24} className="text-[#D7AB19] pr-2" />;
    } else if (label === "Approve Leave") {
      return <FcApproval size={24} className="text-[#D7AB19] pr-2" />;
    } else if (label === "Add People") {
      return <IoIosPersonAdd size={24} className="text-[#D7AB19] pr-2" />;
    } else if (label === "Employee") {
      return <FaUsers size={24} className="text-[#D7AB19] pr-2" />;
    } else if (label === "Calendar") {
      return <FaCalendarAlt size={24} className="text-[#D7AB19] pr-2" />;
    } else {
      return null;
    }
  };
  const navData = ["Dashboard", "Leave Request"];
  console.log(selectedValue);
  // bg-[#3B5D5B]
  return (
    <div className="flex flex-col justify-between items-start  py-10 w-full max-w-full border border-transparent rounded-tr-2xl rounded-br-2xl h-screen bg-gradient-to-r from-gray-900 via-slate-800 to-gray-700">
      <div className="flex flex-col justify-start items-start space-y-8 w-full">
        <div className="flex space-x-2 justify-start items-center px-4">
          <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-semibold text-lg">
            {employee?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col space-y-1">
            <p className="text-white font-semibold text-sm truncate max-w-[100px]">
              {employee?.name}
            </p>
            <p className="text-white  text-[10px] truncate max-w-[100px]">
              {employee?.designation}
            </p>
          </div>
        </div>

        <div className="flex flex-col space-y-4  w-full">
          {arr.map((each, index) => (
            <div className="relative" key={index}>
              <button
                onClick={() => setSelectedValue(each)}
                className={`
          w-[101%] py-2 pl-4 text-left transition-all duration-200 relative z-10 flex items-center cursor-pointer
          ${
            selectedValue === each
              ? "bg-white text-gray-800 rounded-l-full"
              : "bg-transparent text-white hover:bg-gray-200/20"
          }
        `}
              >
                {getIcon(each)}
                {each}
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full px-4 flex items-center space-x-2 hover:scale-110">
        <IoIosLogOut size={30} className="text-white font-semibold " />
        <button
          onClick={() => {
            localStorage.removeItem("Token");
            localStorage.removeItem("Employee");
            setToken("");
          }}
          className="cursor-pointer  text-xl font-semibold text-white"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default MemberNavBar;
