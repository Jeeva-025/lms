import React from "react";
import { FaRegCircleCheck } from "react-icons/fa6";
import { FaClockRotateLeft } from "react-icons/fa6";
import { IoCloseCircleOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import axios from "axios";
import { useState, useEffect } from "react";
import {
  MdMedicalServices,
  MdBeachAccess,
  MdEventAvailable,
} from "react-icons/md";
import { BsCalendar2CheckFill } from "react-icons/bs";
import API from "../utils/API";
import { approvalStatus } from "../utils/constant";
const LeaveDetailsCards = () => {
  const [leaveRemData, setLeaveRemData] = useState({
    availableLeave: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    availableCasual: 0,
    availableEarned: 0,
    availableSick: 0,
  });

  const fetchReaminingLeave = async () => {
    try {
      const employeeId = JSON.parse(localStorage.getItem("Employee")).id;
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("Token")}`,
        "Content-Type": "application/json",
      };

      const response = await axios.get(
        `${API.BASE_URL}${API.EMPLOYEE_REM_LEAVE}/${employeeId}`,
        { headers }
      );

      const statusCount = {
        approved: 0,
        rejected: 0,
        pending: 0,
        cancelled: 0,
      };

      await Promise.all(
        Object.entries(approvalStatus).map(async ([key]) => {
          const res = await axios.get(
            `${API.BASE_URL}${API.NO_OF_LEAVE_REQUEST_BY_STATUS}?employee_id=${employeeId}&approval_status=${key}`,
            { headers }
          );

          const countKey = key.toLowerCase();
          statusCount[countKey] = Object.values(res.data)[0];
        })
      );

      setLeaveRemData((prev) => ({
        ...prev,
        availableLeave: response?.data?.data?.availableLeave,
        approved: statusCount.approved,
        pending: statusCount.pending,
        rejected: statusCount.rejected,
        availableCasual: response?.data?.data?.casualLeaveAvailable,
        availableEarned: response?.data?.data?.earnedLeaveAvailable,
        availableSick: response?.data?.data?.sickLeaveAvailable,
      }));
    } catch (err) {
      console.log(err);
      toast.error("Failed To fetch Leave Details", {
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

  useEffect(() => {
    fetchReaminingLeave();
  }, []);

  return (
    <div className="flex space-x-4 h-auto items-center px-2 w-full overflow-auto no-scrollbar py-2">
      {/* Available Leaves */}
      <div
        className="flex flex-col items-center justify-center space-y-1 rounded-xl p-4 min-w-[220px] h-[110px] shadow-lg 
          bg-gradient-to-br from-green-50 to-green-100 border border-green-100 hover:shadow-green-100/50 hover:shadow-md transition-all"
      >
        <div className="flex space-x-3 items-center w-full">
          <div className="p-2 rounded-full bg-green-200/50">
            <MdEventAvailable size={32} className="text-green-600" />
          </div>
          <p className="text-lg font-medium text-gray-700 whitespace-nowrap">
            Available Leaves
          </p>
        </div>
        <p className="text-3xl font-bold text-gray-800 self-start ml-4">
          {leaveRemData.availableLeave}
        </p>
      </div>

      {/* Approved */}
      <div
        className="flex flex-col items-center justify-center space-y-1 rounded-xl p-4 min-w-[220px] h-[110px] shadow-lg 
          bg-gradient-to-br from-teal-50 to-teal-100 border border-teal-100 hover:shadow-teal-100/50 hover:shadow-md transition-all"
      >
        <div className="flex space-x-3 items-center w-full">
          <div className="p-2 rounded-full bg-teal-200/50">
            <FaRegCircleCheck size={32} className="text-teal-600" />
          </div>
          <p className="text-lg font-medium text-gray-700">Approved</p>
        </div>
        <p className="text-3xl font-bold text-gray-800 self-start ml-4">
          {leaveRemData.approved}
        </p>
      </div>

      {/* Pending */}
      <div
        className="flex flex-col items-center justify-center space-y-1 rounded-xl p-4 min-w-[220px] h-[110px] shadow-lg 
          bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-100 hover:shadow-amber-100/50 hover:shadow-md transition-all"
      >
        <div className="flex space-x-3 items-center w-full">
          <div className="p-2 rounded-full bg-amber-200/50">
            <FaClockRotateLeft size={32} className="text-amber-600" />
          </div>
          <p className="text-lg font-medium text-gray-700">Pending</p>
        </div>
        <p className="text-3xl font-bold text-gray-800 self-start ml-4">
          {" "}
          {leaveRemData.pending}
        </p>
      </div>

      {/* Rejected */}
      <div
        className="flex flex-col items-center justify-center space-y-1 rounded-xl p-4 min-w-[220px] h-[110px] shadow-lg 
          bg-gradient-to-br from-pink-50 to-pink-100 border border-pink-100 hover:shadow-pink-100/50 hover:shadow-md transition-all"
      >
        <div className="flex space-x-3 items-center w-full">
          <div className="p-2 rounded-full bg-pink-200/50">
            <IoCloseCircleOutline size={32} className="text-pink-600" />
          </div>
          <p className="text-lg font-medium text-gray-700">Rejected</p>
        </div>
        <p className="text-3xl font-bold text-gray-800 self-start ml-4">
          {" "}
          {leaveRemData.rejected}
        </p>
      </div>

      <div className="flex flex-col items-center justify-center space-y-1 rounded-xl p-4 w-[250px] h-[110px] shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-100 hover:shadow-purple-100/50 hover:shadow-md transition-all">
        <div className="flex space-x-3 items-center w-full">
          <div className="p-2 rounded-full bg-purple-200/50">
            <BsCalendar2CheckFill size={32} className="text-indigo-600" />
          </div>
          <p className="text-md font-medium text-gray-700 whitespace-nowrap">
            Available Earned Leave
          </p>
        </div>
        <p className="text-3xl font-bold text-gray-800 self-start ml-4">
          {leaveRemData.availableEarned}
        </p>
      </div>

      <div className="flex flex-col items-center justify-center space-y-1 rounded-xl p-4 w-[250px] h-[110px] shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-100 hover:shadow-yellow-100/50 hover:shadow-md transition-all">
        <div className="flex space-x-3 items-center w-full">
          <div className="p-2 rounded-full bg-yellow-200/50">
            <MdBeachAccess size={32} className="text-blue-600" />
          </div>
          <p className="text-md font-medium text-gray-700 whitespace-nowrap">
            Available Casual Leave
          </p>
        </div>
        <p className="text-3xl font-bold text-gray-800 self-start ml-4">
          {leaveRemData.availableCasual}
        </p>
      </div>

      <div className="flex flex-col items-center justify-center space-y-1 rounded-xl p-4 w-[250px] h-[110px] shadow-lg bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-100 hover:shadow-indigo-100/50 hover:shadow-md transition-all">
        <div className="flex space-x-3 items-center w-full">
          <div className="p-2 rounded-full bg-indigo-200/50">
            <MdMedicalServices size={32} className="text-red-600" />
          </div>
          <p className="text-md font-medium text-gray-700 whitespace-nowrap">
            Available Sick Leave
          </p>
        </div>
        <p className="text-3xl font-bold text-gray-800 self-start ml-4">
          {leaveRemData.availableSick}
        </p>
      </div>
    </div>
  );
};

export default LeaveDetailsCards;
