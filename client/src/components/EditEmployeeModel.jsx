import { useState, useEffect } from "react";
import { FiX, FiSave } from "react-icons/fi";
import PropTypes from "prop-types";
import axios from "axios";
import { toast } from "react-toastify";

const EditEmployeeModel = ({ employee, onClose, onSave }) => {
  console.log(employee);
  const [formData, setFormData] = useState({
    employee_id: employee.employee_id,
    designation: employee.designation,
    manager_id: employee.manager_id,
    hr_id: employee.hr_id,
    director_id: employee.director_id,
    email: employee.email,
    employment_status: employee.employment_status,
    type: employee.type,
    name: employee.name,
  });
  console.log(formData.designation);
  const [hr, setHR] = useState([]);
  const [manager, setManager] = useState([]);
  const [director, setDirector] = useState([]);
  const [matchedData, setMatchedData] = useState({
    hr: {},
    manager: {},
    director: {},
  });
  console.log(hr);
  console.log(manager);
  console.log(director);

  const roles = {
    hr: "HR",
    manager: "Manager",
    director: "Director",
  };
  const [showDropDown, setShowDropDown] = useState({
    hr: false,
    manager: false,
    director: false,
    type: false,
    designation: false,
  });

  const types = ["Admin", "Member"];
  const designations = [
    "Software Developer",
    "Software Tester",
    "Cloud Engineer",
    "Devops Engineer",
    "UX/UI Designer",
    "Manager",
  ];
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name);
    console.log(value);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const fetchData = async () => {
    try {
      const arr = Object.values(roles);
      for (const each of arr) {
        const response = await axios.get(
          `http://localhost:3000/employee/people?name=${each}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("Token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        switch (each) {
          case roles.hr:
            setHR(response.data);
            break;
          case roles.manager:
            setManager(response.data);
            break;
          case roles.director:
            setDirector(response.data);
            break;
          default:
            console.warn("Unexpected role:", each);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch employee data", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    if (hr.length > 0) {
      const data = hr.find((each) => each.employee_id === employee.hr_id);
      setMatchedData((prev) => ({ ...prev, hr: data }));
      setFormData((prev) => ({ ...prev, hr_id: data }));
    }

    if (manager.length > 0) {
      const data = manager.find(
        (each) => each.employee_id === employee.manager_id
      );
      setMatchedData((prev) => ({ ...prev, manager: data }));
      setFormData((prev) => ({ ...prev, manager_id: data }));
    }

    if (director.length > 0) {
      const data = director.find(
        (each) => each.employee_id === employee.director_id
      );
      setMatchedData((prev) => ({ ...prev, director: data }));
      setFormData((prev) => ({ ...prev, director_id: data }));
    }
  }, [hr, manager, director]);

  console.log(matchedData);
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-end backdrop-blur-sm  z-50 h-full">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md h-full">
        <div className="flex justify-between items-center border-b p-4 ">
          <h3 className="text-lg font-semibold text-gray-800">Edit Employee</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2 relative">
            <label className="block text-gray-700 font-medium">
              Designation
            </label>
            <div
              className="w-full px-4 py-2 border border-gray-200 rounded-lg cursor-pointer flex justify-between items-center bg-gray-50 hover:bg-white transition-all"
              onClick={() =>
                setShowDropDown((prev) => ({
                  ...prev,
                  designation: !showDropDown.designation,
                }))
              }
            >
              <span
                className={
                  formData.designation ? "text-gray-800" : "text-gray-400"
                }
              >
                {formData.designation || "Select Designation"}
              </span>
              <svg
                className={`w-5 h-5 transition-transform text-gray-500 ${
                  showDropDown.designation ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            {showDropDown.designation && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                {designations.map((designation, index) => (
                  <div
                    key={index}
                    className={`px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors ${
                      index === designations.length - 1
                        ? ""
                        : "border-b border-gray-100"
                    }`}
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, designation }));
                      setShowDropDown((prev) => ({
                        ...prev,
                        designation: false,
                      }));
                    }}
                  >
                    {designation}
                  </div>
                ))}
              </div>
            )}
          </div>
          {formData.manager_id && (
            <div className="space-y-2 relative">
              <label className="block text-gray-700 font-medium">Manager</label>
              <div
                className="w-full px-4 py-2 border border-gray-200 rounded-lg cursor-pointer flex justify-between items-center bg-gray-50 hover:bg-white transition-all"
                onClick={() =>
                  setShowDropDown((prev) => ({
                    ...prev,
                    manager: !showDropDown.manager,
                  }))
                }
              >
                <span
                  className={
                    formData.manager_id.name ? "text-gray-800" : "text-gray-400"
                  }
                >
                  {formData.manager_id.name || "Select Designation"}
                </span>
                <svg
                  className={`w-5 h-5 transition-transform text-gray-500 ${
                    showDropDown.manager ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              {showDropDown.manager && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                  {manager.map((manager, index) => (
                    <div
                      key={index}
                      className={`px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors ${
                        index === manager.length - 1
                          ? ""
                          : "border-b border-gray-100"
                      }`}
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          manager_id: manager,
                        }));
                        setShowDropDown((prev) => ({
                          ...prev,
                          manager: false,
                        }));
                      }}
                    >
                      {manager.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          <div className="space-y-2 relative">
            <label className="block text-gray-700 font-medium">HR</label>
            <div
              className="w-full px-4 py-2 border border-gray-200 rounded-lg cursor-pointer flex justify-between items-center bg-gray-50 hover:bg-white transition-all"
              onClick={() =>
                setShowDropDown((prev) => ({
                  ...prev,
                  hr: !showDropDown.hr,
                }))
              }
            >
              <span
                className={
                  formData.hr_id.name ? "text-gray-800" : "text-gray-400"
                }
              >
                {formData.hr_id.name || "Select Designation"}
              </span>
              <svg
                className={`w-5 h-5 transition-transform text-gray-500 ${
                  showDropDown.hr ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            {showDropDown.hr && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                {hr.map((hr, index) => (
                  <div
                    key={index}
                    className={`px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors ${
                      index === hr.length - 1 ? "" : "border-b border-gray-100"
                    }`}
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, hr_id: hr }));
                      setShowDropDown((prev) => ({
                        ...prev,
                        hr: false,
                      }));
                    }}
                  >
                    {hr.name}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="space-y-2 relative">
            <label className="block text-gray-700 font-medium">Director</label>
            <div
              className="w-full px-4 py-2 border border-gray-200 rounded-lg cursor-pointer flex justify-between items-center bg-gray-50 hover:bg-white transition-all"
              onClick={() =>
                setShowDropDown((prev) => ({
                  ...prev,
                  director: !showDropDown.director,
                }))
              }
            >
              <span
                className={
                  formData.director_id.name ? "text-gray-800" : "text-gray-400"
                }
              >
                {formData.director_id.name || "Select Designation"}
              </span>
              <svg
                className={`w-5 h-5 transition-transform text-gray-500 ${
                  showDropDown.director ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            {showDropDown.director && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                {director.map((director, index) => (
                  <div
                    key={index}
                    className={`px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors ${
                      index === director.length - 1
                        ? ""
                        : "border-b border-gray-100"
                    }`}
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        director_id: director,
                      }));
                      setShowDropDown((prev) => ({
                        ...prev,
                        director: false,
                      }));
                    }}
                  >
                    {director.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="employment_status"
              value={formData.employment_status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div> */}
        </div>

        <div className="flex justify-end space-x-3 p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(formData)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <FiSave className="mr-2" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

EditEmployeeModel.propTypes = {
  employee: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default EditEmployeeModel;
