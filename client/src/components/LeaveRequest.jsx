import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { FaBriefcase, FaCoffee, FaVirus } from "react-icons/fa";
import API from "../utils/API";
import {
  FaRegCalendarCheck,
  FaCalendarAlt,
  FaChevronDown,
} from "react-icons/fa";
import { FiSend } from "react-icons/fi";
const LeaveRequest = () => {
  const token = localStorage.getItem("Token");

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showDropDown, setShowDropDown] = useState(false);
  const [selectedLeaveType, setSelectedLeaveType] = useState({});
  const [leaveType, setLeaveType] = useState([]);
  const [leaveReason, setLeaveReason] = useState("");
  const [disabledDates, setDisabledDates] = useState([]);

  const colors = {
    primary: "#2C6975",
    secondary: "#68B2A0",
    accent: "#E0A458",
    background: "#F8F5F2",
    text: "#333333",
    lightText: "#777777",
    border: "#E0D6C9",
  };

  const getDisabledDates = (leaves) => {
    const disabledDates = [];

    leaves.forEach(({ startDate, endDate }) => {
      const start = new Date(startDate);
      const end = new Date(endDate);
      let current = new Date(start);

      while (current <= end) {
        disabledDates.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
    });

    return disabledDates;
  };

  const getIcon = (label) => {
    const iconClass = `text-${colors.accent} pr-2`;
    if (label === "Earned Leave") {
      return (
        <FaBriefcase
          size={20}
          className={iconClass}
          style={{ color: colors.accent }}
        />
      );
    } else if (label === "Sick Leave") {
      return (
        <FaVirus
          size={20}
          className={iconClass}
          style={{ color: colors.accent }}
        />
      );
    } else {
      return (
        <FaCoffee
          size={20}
          className={iconClass}
          style={{ color: colors.accent }}
        />
      );
    }
  };

  const fetchAllLeaveType = async () => {
    try {
      const response = await axios.get(`${API.BASE_URL}${API.ALL_LEAVE_TYPE}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
      if (response?.data) {
        setLeaveType(response.data);
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch leave types", {
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

  const handleSubmit = async () => {
    if (!startDate || !endDate || !selectedLeaveType || !leaveReason) {
      toast.warning("Please fill all fields", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    try {
      const response = await axios.post(
        `${API.BASE_URL}${API.CREATE_REQUEST_LEAVE}`,
        {
          leave_id: selectedLeaveType.id,
          employee_id: JSON.parse(localStorage.getItem("Employee")).id,
          reason: leaveReason,
          start_date: startDate,
          end_date: endDate,
          manager_id: JSON.parse(localStorage.getItem("Employee")).managerId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEndDate(null);
      setStartDate(null);
      setLeaveReason("");
      setSelectedLeaveType("");
      toast.success("Leave request submitted successfully!", {
        position: "top-center",
        autoClose: 2000,
      });
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Something went wrong while submitting your request";

      toast.error(message, {
        position: "top-center",
        autoClose: 3000,
      });
      setEndDate(null);
      setStartDate(null);
      setLeaveReason("");
      setSelectedLeaveType("");
    }
  };

  const fetchAllLeaveApprovedDate = async () => {
    const employeeId = JSON.parse(localStorage.getItem("Employee")).id;
    try {
      const response = await axios.get(
        `${API.BASE_URL}${API.PREVIOUS_APPROVED_LEAVE_DATE}/${employeeId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { data } = await axios.get(
        `${API.BASE_URL}${API.ALL_GOVERNMENT_HOLIDAYS}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const holidayDates = data.map((each) => new Date(each));
      const leaveDates = getDisabledDates(response?.data);

      setDisabledDates([...leaveDates, ...holidayDates]);
    } catch (err) {
      console.log(err);
    }
  };
  console.log(disabledDates);

  useEffect(() => {
    fetchAllLeaveType();
    fetchAllLeaveApprovedDate();
  }, []);

  return (
    <div
      className="flex items-start justify-start min-h-screen w-2/4 h-screen"
      style={{
        backgroundColor: colors.background,
        transform: "scale(0.95)",
        transformOrigin: "top left",
      }}
    >
      <div
        className="w-full max-w-2xl rounded-2xl overflow-auto custom-scrollbar shadow-lg h-screen"
        style={{
          backgroundColor: "white",
          border: `1px solid ${colors.border}`,
        }}
      >
        <div
          className="p-6 text-white"
          style={{
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
          }}
        >
          <div className="flex items-center space-x-3">
            <FaRegCalendarCheck size={24} />
            <div>
              <h1 className="text-2xl font-bold">Leave Request</h1>
              <p className="opacity-90">Submit your leave application</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex justify-center">
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className="flex items-center px-4 py-2 rounded-full"
              style={{
                backgroundColor: colors.background,
                color: colors.primary,
                border: `1px solid ${colors.border}`,
              }}
            >
              <FaCalendarAlt className="mr-2" size={14} />
              {showCalendar ? "Hide Calendar" : "View Calendar"}
            </button>
          </div>

          {showCalendar && (
            <div
              className="border rounded-lg p-4"
              style={{ borderColor: colors.border }}
            >
              <DayPicker
                mode="range"
                selected={{ from: startDate, to: endDate }}
                onSelect={(range) => {
                  setStartDate(range?.from);
                  setEndDate(range?.to);
                }}
                modifiersStyles={{
                  selected: {
                    color: "white",
                    backgroundColor: colors.primary,
                  },
                  range_middle: {
                    color: colors.primary,
                    backgroundColor: colors.background,
                  },
                }}
                styles={{
                  root: {
                    margin: "0 auto",
                    fontFamily: "inherit",
                  },
                  day: {
                    margin: "0.2em",
                    borderRadius: "6px",
                    transition: "all 0.2s ease",
                  },
                }}
                disabled={(date) => {
                  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const isPastDate = date < today;
                  const isDisabledDate = disabledDates.some((disabledDate) => {
                    return (
                      date.getFullYear() === disabledDate.getFullYear() &&
                      date.getMonth() === disabledDate.getMonth() &&
                      date.getDate() === disabledDate.getDate()
                    );
                  });
                  return isWeekend || isPastDate || isDisabledDate;
                }}
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                className="block font-medium"
                style={{ color: colors.text }}
              >
                From Date
              </label>
              <div className="relative" onClick={() => setShowDropDown(false)}>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  excludeDates={disabledDates}
                  className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none"
                  placeholderText="Select start date"
                  style={{
                    border: `1px solid ${colors.border}`,
                    color: colors.text,
                  }}
                  filterDate={(date) => {
                    const isWeekend =
                      date.getDay() === 0 || date.getDay() === 6;

                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const isPastDate = date < today;

                    return !isWeekend && !isPastDate;
                  }}
                />
                <FaCalendarAlt
                  className="absolute left-3 top-3"
                  style={{ color: colors.lightText }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                className="block font-medium"
                style={{ color: colors.text }}
              >
                To Date
              </label>
              <div className="relative">
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  excludeDates={disabledDates}
                  className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none"
                  placeholderText="Select end date"
                  style={{
                    border: `1px solid ${colors.border}`,
                    color: colors.text,
                  }}
                  filterDate={(date) => {
                    const isWeekend =
                      date.getDay() === 0 || date.getDay() === 6;

                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const isPastDate = date < today;

                    return !isWeekend && !isPastDate;
                  }}
                />
                <FaCalendarAlt
                  className="absolute left-3 top-3"
                  style={{ color: colors.lightText }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block font-medium" style={{ color: colors.text }}>
              Leave Type
            </label>
            <div className="relative">
              <div
                className={`w-full px-4 py-2 rounded-lg cursor-pointer flex justify-between items-center border`}
                onClick={() => setShowDropDown(!showDropDown)}
                style={{
                  borderColor: colors.border,
                  color: selectedLeaveType?.name
                    ? colors.text
                    : colors.lightText,
                }}
              >
                {selectedLeaveType.name || "Select Leave Type"}
                <FaChevronDown
                  className={`transition-transform ${
                    showDropDown ? "rotate-180" : ""
                  }`}
                  style={{ color: colors.lightText }}
                />
              </div>

              {showDropDown && (
                <div
                  className="absolute z-10 w-full mt-1 rounded-lg shadow-lg border"
                  style={{
                    backgroundColor: "white",
                    borderColor: colors.border,
                  }}
                >
                  {leaveType.map((each, index) => (
                    <div
                      key={index}
                      className={`px-4 py-2 cursor-pointer flex items-center ${
                        index === leaveType.length - 1 ? "" : "border-b"
                      } hover:bg-opacity-10`}
                      onClick={() => {
                        setSelectedLeaveType(each);
                        setShowDropDown(false);
                      }}
                      style={{
                        borderColor: colors.border,
                        color: colors.text,
                        backgroundColor:
                          selectedLeaveType.name === each.name
                            ? `${colors.primary}20`
                            : "transparent",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {getIcon(each.name)}
                      <span>{each.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block font-medium" style={{ color: colors.text }}>
              Leave Reason
            </label>
            <textarea
              rows={4}
              value={leaveReason}
              onChange={(e) => setLeaveReason(e.target.value)}
              placeholder="Describe your reason..."
              className="w-full px-4 py-2 rounded-lg focus:outline-none"
              style={{
                border: `1px solid ${colors.border}`,
                color: colors.text,
              }}
            />
          </div>

          <div className="pt-4">
            <button
              onClick={handleSubmit}
              className={` w-full py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all ${
                leaveReason && leaveType && startDate && endDate
                  ? "cursor-pointer"
                  : "cursor-not-allowed"
              }`}
              style={{
                backgroundColor: colors.primary,
                color: "white",
                opacity:
                  startDate && endDate && leaveReason && leaveType ? 1 : 0.8,
                boxShadow: `0 4px 6px ${colors.primary}20`,
              }}
            >
              <FiSend />
              <span>Submit Request</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequest;
