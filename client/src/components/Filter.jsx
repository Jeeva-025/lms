import React, { useState } from "react";
import {
  IoIosClose,
  IoMdCalendar,
  IoMdArrowDropdown,
  IoMdArrowDropup,
} from "react-icons/io";
import { FaFilter, FaCheck, FaRegCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect } from "react";
import axios from "axios";
import API from "../utils/API";

const Filter = ({
  data,
  setData,
  setShowFilter,
  handleApply,
  setFilterApplied,
}) => {
  console.log(data);
  const [showDropDown, setShowDropDown] = useState({
    leaveType: false,
    status: false,
  });
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [leaveType, setLeaveType] = useState([]);
  const status = ["Approved", "Pending", "Rejected"];

  const handleFilter = async (data) => {
    await handleApply(data);
    setFilterApplied(true);
    setShowFilter(false);
  };

  const handleReset = () => {
    setData({
      leaveType: null,
      startDate: null,
      endDate: null,
      status: "",
    });
    handleApply();
    setStartDate(null);
    setEndDate(null);
    setFilterApplied(false);
  };

  const fetchAllLeaveType = async () => {
    try {
      const response = await axios.get(`${API.BASE_URL}${API.ALL_LEAVE_TYPE}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("Token")}`,
        },
      });
      setLeaveType(response?.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAllLeaveType();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-end z-50">
      <div className="bg-white h-full w-full max-w-sm shadow-2xl flex flex-col p-6 transform transition-all duration-300">
        <div className="flex justify-between items-center border-b pb-4">
          <div className="flex items-center space-x-2">
            <FaFilter className="text-blue-600" size={20} />
            <h1 className="text-xl font-semibold text-gray-800">
              Filter Leaves
            </h1>
          </div>
          <button
            onClick={() => setShowFilter(false)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <IoIosClose size={30} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Leave Type
            </label>
            <div className="relative">
              <button
                className={`w-full flex justify-between items-center px-4 py-2 border ${
                  data.leaveType ? "border-blue-500" : "border-gray-300"
                } rounded-lg bg-white text-left shadow-sm hover:border-blue-500 transition-colors`}
                onClick={() =>
                  setShowDropDown((prev) => ({
                    ...prev,
                    leaveType: !prev.leaveType,
                    status: false,
                  }))
                }
              >
                <span
                  className={data.leaveType ? "text-gray-900" : "text-gray-500"}
                >
                  {data.leaveType?.name || "Select leave type"}
                </span>
                {showDropDown.leaveType ? (
                  <IoMdArrowDropup className="text-gray-500" />
                ) : (
                  <IoMdArrowDropdown className="text-gray-500" />
                )}
              </button>
              {showDropDown.leaveType && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-b-lg border border-gray-200">
                  {leaveType.map((each, index) => (
                    <div
                      key={each}
                      onClick={() => {
                        if (
                          each.name.toLowerCase() ===
                          data?.leaveType?.name.toLowerCase()
                        ) {
                          setData((prev) => ({ ...prev, leaveType: null }));
                        } else {
                          setData((prev) => ({ ...prev, leaveType: each }));
                        }
                        setShowDropDown((prev) => ({
                          ...prev,
                          leaveType: false,
                        }));
                      }}
                      className={`px-4 py-2 cursor-pointer flex items-center justify-between ${
                        index !== leaveType.length - 1
                          ? "border-b border-gray-100"
                          : ""
                      } hover:bg-blue-50 transition-colors ${
                        data.leaveType?.id === each?.id
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700"
                      }`}
                    >
                      <span>{each.name}</span>
                      {data.leaveType?.id === each?.id && (
                        <FaCheck className="text-blue-600" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Date Range
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => {
                      setStartDate(date);
                      setData((prev) => ({
                        ...prev,
                        startDate: new Date(date),
                      }));
                    }}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    placeholderText="Start date"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    dateFormat="MMM d, yyyy"
                  />
                  <FaRegCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                </div>
                <div className="relative">
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => {
                      setEndDate(date);
                      setData((prev) => ({
                        ...prev,
                        endDate: new Date(date),
                      }));
                    }}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    placeholderText="End date"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    dateFormat="MMM d, yyyy"
                  />
                  <FaRegCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <div className="relative">
              <button
                className={`w-full flex justify-between items-center px-4 py-2 border ${
                  data.approvalStatus ? "border-blue-500" : "border-gray-300"
                } rounded-lg bg-white text-left shadow-sm hover:border-blue-500 transition-colors`}
                onClick={() =>
                  setShowDropDown((prev) => ({
                    ...prev,
                    status: !prev.status,
                    leaveType: false,
                  }))
                }
              >
                <span
                  className={
                    data.approvalStatus ? "text-gray-900" : "text-gray-500"
                  }
                >
                  {data.approvalStatus || "Select status"}
                </span>
                {showDropDown.status ? (
                  <IoMdArrowDropup className="text-gray-500" />
                ) : (
                  <IoMdArrowDropdown className="text-gray-500" />
                )}
              </button>
              {showDropDown.status && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-b-lg border border-gray-200">
                  {status.map((each, index) => (
                    <div
                      key={each}
                      onClick={() => {
                        if (
                          each.toLowerCase() ===
                          data.approvalStatus.toLowerCase()
                        ) {
                          setData((prev) => ({ ...prev, approvalStatus: "" }));
                        } else {
                          setData((prev) => ({
                            ...prev,
                            approvalStatus: each,
                          }));
                        }
                        setShowDropDown((prev) => ({ ...prev, status: false }));
                      }}
                      className={`px-4 py-2 cursor-pointer flex items-center justify-between ${
                        index !== status.length - 1
                          ? "border-b border-gray-100"
                          : ""
                      } hover:bg-blue-50 transition-colors ${
                        data.approvalStatus === each
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700"
                      }`}
                    >
                      <span>{each}</span>
                      {data.approvalStatus === each && (
                        <FaCheck className="text-blue-600" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex space-x-4 border-t pt-4">
          <button
            onClick={handleReset}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Reset
          </button>
          <button
            onClick={() => handleFilter(data)}
            className="flex-1 px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <span>Apply Filters</span>
            <FaCheck size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filter;
