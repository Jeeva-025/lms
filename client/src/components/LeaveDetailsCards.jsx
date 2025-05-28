import React from "react";
import { MdEventAvailable } from "react-icons/md";
import { FaRegCircleCheck } from "react-icons/fa6";
import { FaClockRotateLeft } from "react-icons/fa6";
import { IoCloseCircleOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import { useState, useEffect } from "react";

const LeaveDetailsCards = () => {
  const [leaveRemData, setLeaveRemData] = useState({
    availableLeave: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  });

  const fetchReaminingLeave = async () => {
    try {
      const employeeId = JSON.parse(localStorage.getItem("Employee")).id;
      const response = await axios.get(
        `http://localhost:3000/employee/leaves/${employeeId}`,

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      const response1 = await axios.post(
        "http://localhost:3000/employee/noof/requestbystatus",
        {
          employee_id: JSON.parse(localStorage.getItem("Employee")).id,
          approval_status: "PENDING",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      const response2 = await axios.post(
        "http://localhost:3000/employee/noof/requestbystatus",
        {
          employee_id: JSON.parse(localStorage.getItem("Employee")).id,
          approval_status: "REJECTED",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      setLeaveRemData((prev) => ({
        ...prev,
        availableLeave:
          response?.data?.data?.total_leaves -
          response?.data?.data?.no_of_leave_taken,
        approved:
          response?.data?.data?.no_of_casual_leave +
          response?.data?.data?.no_of_earned_leave +
          response?.data?.data?.no_of_sick_leave,
        pending: response1.data.data,
        rejected: response2.data.data,
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
  useEffect(() => {
    if (leaveRemData.availableLeave > 0) {
      console.log(leaveRemData);
    }
  }, [leaveRemData]);
  return (
    <div className="flex space-x-4 h-auto items-center px-2 w-full overflow-auto no-scrollbar py-2">
      {/* Available Leaves */}
      <div
        className="flex flex-col items-center justify-center space-y-1 rounded-xl p-4 w-[250px] h-[110px] shadow-lg 
          bg-gradient-to-br from-green-50 to-green-100 border border-green-100 hover:shadow-green-100/50 hover:shadow-md transition-all"
      >
        <div className="flex space-x-3 items-center w-full">
          <div className="p-2 rounded-full bg-green-200/50">
            <MdEventAvailable size={32} className="text-green-600" />
          </div>
          <p className="text-lg font-medium text-gray-700">Available Leaves</p>
        </div>
        <p className="text-3xl font-bold text-gray-800 self-start ml-4">
          {leaveRemData.availableLeave}
        </p>
      </div>

      {/* Approved */}
      <div
        className="flex flex-col items-center justify-center space-y-1 rounded-xl p-4 w-[250px] h-[110px] shadow-lg 
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
        className="flex flex-col items-center justify-center space-y-1 rounded-xl p-4 w-[250px] h-[110px] shadow-lg 
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
        className="flex flex-col items-center justify-center space-y-1 rounded-xl p-4 w-[250px] h-[110px] shadow-lg 
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

      {/* Requested */}
    </div>
  );
};

export default LeaveDetailsCards;
