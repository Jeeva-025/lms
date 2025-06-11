import { useState, useEffect } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiCalendar,
  FiStar,
} from "react-icons/fi";
import axios from "axios";
import API from "../utils/API";

const LeaveCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [hoveredLeave, setHoveredLeave] = useState(null);
  const [hoveredHoliday, setHoveredHoliday] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [holidays, setHolidays] = useState([]);

  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const employeeColors = {};
  let colorIndex = 0;
  leaves.forEach((request, index) => {
    if (!employeeColors[request.name]) {
      let hue;
      do {
        hue = (colorIndex * 137.508) % 360;
        colorIndex++;
      } while ((hue >= 40 && hue <= 80) || (hue >= 250 && hue <= 290));
      employeeColors[request.name] = `hsl(${hue}, 70%, 60%)`;
    }
  });

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const handleDateClick = (day) => {
    setSelectedDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    );
  };

  const isDateInLeave = (year, month, day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    return leaves.filter((leave) => {
      return dateStr >= leave.startDate && dateStr <= leave.endDate;
    });
  };

  const isHoliday = (year, month, day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    return holidays.find((holiday) => holiday.holiday_date === dateStr);
  };

  const fetchHolidays = async () => {
    try {
      const response = await axios.get(`${API.BASE_URL}${API.ALL_HOLIDAYS}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("Token")}`,
          "Content-Type": "application/json",
        },
      });
      setHolidays(response.data);
      console.log(response?.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchTeamMembersLeave = async () => {
    const employee = JSON.parse(localStorage.getItem("Employee"));
    try {
      const response = await axios.get(
        `${API.BASE_URL}${API.TEAM_MEMBERS_LEAVE}/${employee.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response?.data);
      setLeaves(response?.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTeamMembersLeave();
    fetchHolidays();
  }, []);

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);

    const days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-16"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected =
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === month &&
        selectedDate.getFullYear() === year;

      const isToday =
        new Date().getDate() === day &&
        new Date().getMonth() === month &&
        new Date().getFullYear() === year;

      const isWeekend =
        new Date(year, month, day).getDay() === 0 ||
        new Date(year, month, day).getDay() === 6;

      const leavesOnThisDay = isDateInLeave(year, month, day);
      leavesOnThisDay.sort((a, b) => a.name.localeCompare(b.name));

      const holiday = isHoliday(year, month, day);

      days.push(
        <div
          key={day}
          onClick={() => handleDateClick(day)}
          className={`h-16 flex flex-col items-center justify-start p-1 rounded-lg cursor-pointer transition-all relative
            ${
              isSelected
                ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg"
                : ""
            }
            ${
              isToday && !isSelected
                ? "border-2 border-blue-400 bg-blue-50"
                : ""
            }
            ${
              isWeekend && !isSelected && !isToday
                ? "text-gray-400"
                : "text-gray-700"
            }
            hover:bg-blue-50 hover:shadow-md`}
        >
          <div className="flex items-center justify-center w-full">
            <span
              className={`text-xs font-medium ${
                isSelected
                  ? "text-white"
                  : isWeekend
                  ? "text-gray-400"
                  : "text-gray-600"
              }`}
            >
              {day}
            </span>
            {holiday && (
              <FiStar
                size={14}
                className={`ml-1 text-xs ${
                  holiday.is_floater ? "text-yellow-500" : "text-purple-500"
                }`}
                onMouseEnter={() => setHoveredHoliday({ ...holiday, day })}
                onMouseLeave={() => setHoveredHoliday(null)}
              />
            )}
          </div>

          <div className="flex flex-wrap justify-center mt-0.5 gap-0.5 w-full">
            {leavesOnThisDay.map((leave, idx) => (
              <div
                key={`${day}-${idx}`}
                className="w-5 h-2 rounded-full"
                style={{ backgroundColor: employeeColors[leave.name] }}
                onMouseEnter={() => setHoveredLeave({ ...leave, day })}
                onMouseLeave={() => setHoveredLeave(null)}
              />
            ))}
          </div>

          {holiday && (
            <div
              className={`absolute top-0 left-0 w-full h-full rounded-lg border-2 pointer-events-none ${
                holiday.is_floater
                  ? "border-yellow-400 opacity-30"
                  : "border-purple-400 opacity-30"
              }`}
            />
          )}

          {hoveredLeave && hoveredLeave.day === day && (
            <div
              className={`absolute z-10 ${
                day <= 7 ? "top-full" : "bottom-full"
              }  left-1/2 transform -translate-x-1/2 mt-1 w-max max-w-xs px-2 py-1 bg-white rounded-lg shadow-lg border border-gray-200 text-xs`}
            >
              <div className="font-medium text-gray-900">
                {hoveredLeave.name}
              </div>
              <div className="text-gray-500">{hoveredLeave.leaveType}</div>
              <div className="text-gray-500">
                {hoveredLeave.startDate === hoveredLeave.endDate
                  ? new Date(hoveredLeave.startDate).toLocaleDateString()
                  : `${new Date(
                      hoveredLeave.startDate
                    ).toLocaleDateString()} - ${new Date(
                      hoveredLeave.endDate
                    ).toLocaleDateString()}`}
              </div>
            </div>
          )}

          {hoveredHoliday && hoveredHoliday.day === day && (
            <div
              className={`absolute z-10 ${
                day <= 7 ? "top-full" : "bottom-full"
              }  left-1/2 transform -translate-x-1/2 mt-1 w-max max-w-xs px-2 py-1 bg-white rounded-lg shadow-lg border border-gray-200 text-xs`}
            >
              <div className="font-medium text-gray-900">
                {hoveredHoliday.name}
              </div>
              <div className="flex items-center text-gray-500">
                <FiStar
                  className={`mr-1 ${
                    hoveredHoliday.is_floater
                      ? "text-yellow-500"
                      : "text-purple-500"
                  }`}
                />
                {hoveredHoliday.is_floater
                  ? "Floater Holiday"
                  : "Fixed Holiday"}
              </div>
              <div className="text-gray-500">
                {new Date(hoveredHoliday.holiday_date).toLocaleDateString()}
              </div>
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div
      className="w-full max-w-4xl mx-auto p-4 bg-white rounded-3xl shadow-xl border border-gray-100 flex flex-col"
      style={{ maxHeight: "90vh" }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <FiCalendar className="text-xl text-blue-600 mr-2" />
          <h2 className="text-xl font-bold text-gray-800">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-xl bg-gray-50 hover:bg-gray-200 transition-all shadow-sm"
          >
            <FiChevronLeft className="text-lg text-gray-600" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-xl bg-gray-50 hover:bg-gray-200 transition-all shadow-sm"
          >
            <FiChevronRight className="text-lg text-gray-600" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-2">
        {Object.keys(employeeColors).length > 0 && (
          <div className="flex flex-wrap gap-2">
            {Object.entries(employeeColors).map(([employee, color]) => (
              <div key={employee} className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-1"
                  style={{ backgroundColor: color }}
                />
                <span className="text-xs text-gray-700">{employee}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-1 bg-purple-500" />
            <span className="text-xs text-gray-700">Fixed Holiday</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-1 bg-yellow-500" />
            <span className="text-xs text-gray-700">Floater Holiday</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {daysOfWeek.map((day, index) => (
          <div
            key={index}
            className={`text-center font-semibold text-xs py-1 ${
              index === 0 || index === 6 ? "text-blue-500" : "text-gray-500"
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5 overflow-y-auto flex-grow">
        {renderCalendar()}
      </div>

      <div className="mt-8 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-gray-200">
        <div className="flex items-center">
          <div className="bg-blue-100 p-2 rounded-lg mr-3">
            <FiCalendar className="text-blue-600 text-lg" />
          </div>
          <div>
            <h3 className="text-xs font-medium text-gray-500">SELECTED DATE</h3>
            <p className="text-lg font-bold text-gray-800">
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>

            {isHoliday(
              selectedDate.getFullYear(),
              selectedDate.getMonth(),
              selectedDate.getDate()
            ) && (
              <div className="mt-1">
                <h4 className="text-xs font-medium text-gray-500">Holiday:</h4>
                <div className="flex items-center">
                  <FiStar
                    className={`mr-1 ${
                      isHoliday(
                        selectedDate.getFullYear(),
                        selectedDate.getMonth(),
                        selectedDate.getDate()
                      ).is_floater
                        ? "text-yellow-500"
                        : "text-purple-500"
                    }`}
                  />
                  <span className="text-xs text-gray-700">
                    {
                      isHoliday(
                        selectedDate.getFullYear(),
                        selectedDate.getMonth(),
                        selectedDate.getDate()
                      ).name
                    }
                  </span>
                </div>
              </div>
            )}

            {isDateInLeave(
              selectedDate.getFullYear(),
              selectedDate.getMonth(),
              selectedDate.getDate()
            ).length > 0 && (
              <div className="mt-1">
                <h4 className="text-xs font-medium text-gray-500">
                  Leaves on this day:
                </h4>
                <ul className="space-y-0.5">
                  {isDateInLeave(
                    selectedDate.getFullYear(),
                    selectedDate.getMonth(),
                    selectedDate.getDate()
                  ).map((leave) => (
                    <li
                      key={`${leave.name}-${leave.startDate}`}
                      className="flex items-center"
                    >
                      <div
                        className="w-2 h-2 rounded-full mr-1"
                        style={{
                          backgroundColor: employeeColors[leave.name],
                        }}
                      />
                      <span className="text-xs text-gray-700">
                        {leave.name} - {leave.leaveType}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveCalendar;
