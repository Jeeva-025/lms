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

const Filter = ({ data, setData, setShowFilter }) => {
  const [showDropDown, setShowDropDown] = useState({
    leaveType: false,
    status: false,
  });
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const leaveType = ["Earned Leave", "Sick Leave", "Casual Leave"];
  const status = ["Approved", "Pending", "Rejected"];

  const handleApply = () => {
    setData((prev) => ({
      ...prev,
      startDate,
      endDate,
    }));
    setShowFilter(false);
  };

  const handleReset = () => {
    setData({
      leaveType: "",
      startDate: null,
      endDate: null,
      status: "",
    });
    setStartDate(null);
    setEndDate(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-end z-50">
      <div className="bg-white h-full w-full max-w-sm shadow-2xl flex flex-col p-6 transform transition-all duration-300">
        {/* Header */}
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

        {/* Filter Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-6">
          {/* Leave Type Filter */}
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
                  {data.leaveType || "Select leave type"}
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
                        setData((prev) => ({ ...prev, leaveType: each }));
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
                        data.leaveType === each
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700"
                      }`}
                    >
                      <span>{each}</span>
                      {data.leaveType === each && (
                        <FaCheck className="text-blue-600" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Date Range Filter */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Date Range
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
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
                    onChange={(date) => setEndDate(date)}
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

          {/* Status Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <div className="relative">
              <button
                className={`w-full flex justify-between items-center px-4 py-2 border ${
                  data.status ? "border-blue-500" : "border-gray-300"
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
                  className={data.status ? "text-gray-900" : "text-gray-500"}
                >
                  {data.status || "Select status"}
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
                        setData((prev) => ({ ...prev, status: each }));
                        setShowDropDown((prev) => ({ ...prev, status: false }));
                      }}
                      className={`px-4 py-2 cursor-pointer flex items-center justify-between ${
                        index !== status.length - 1
                          ? "border-b border-gray-100"
                          : ""
                      } hover:bg-blue-50 transition-colors ${
                        data.status === each
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700"
                      }`}
                    >
                      <span>{each}</span>
                      {data.status === each && (
                        <FaCheck className="text-blue-600" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex space-x-4 border-t pt-4">
          <button
            onClick={handleReset}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Reset
          </button>
          <button
            onClick={handleApply}
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
