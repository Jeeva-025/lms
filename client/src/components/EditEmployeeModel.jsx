import { useState, useEffect } from "react";
import { FiX, FiSave } from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";
import API from "../utils/API";

const EditEmployeeModel = ({ employee, onClose, onSave }) => {
  console.log(employee);
  const [formData, setFormData] = useState({
    employee_id: employee.id,
    designation: {
      employeeTypeId: employee.empTypeId,
      name: employee.designation,
    },
    manager: {
      employeeId: employee.manager_id,
      name: employee.manager_name,
    },
    email: employee.email,
    name: employee.name,
  });

  const [manager, setManager] = useState([]);
  const [designations, setDesignation] = useState([]);

  const [showDropDown, setShowDropDown] = useState({
    manager: false,
    designation: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name);
    console.log(value);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const fetchData = async () => {
    try {
      const { data } = await axios.get(
        `${API.BASE_URL}${API.ALL_EMPOYEE_TYPE}`,

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      setDesignation(data);
      const response = await axios.get(
        `${API.BASE_URL}${API.ALL_SENIOR_EMPLOYEE}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response?.data);
      setManager(response.data);
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

  console.log(manager);
  console.log(designations);
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
                  formData.designation.name ? "text-gray-800" : "text-gray-400"
                }
              >
                {formData.designation.name || "Select Designation"}
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
                      setFormData((prev) => ({
                        ...prev,
                        designation: {
                          employeeTypeId: designation.employeeTypeId,
                          name: designation.name,
                        },
                      }));
                      setShowDropDown((prev) => ({
                        ...prev,
                        designation: false,
                      }));
                    }}
                  >
                    {designation.name}
                  </div>
                ))}
              </div>
            )}
          </div>
          {formData.manager.name && (
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
                    formData.manager.name ? "text-gray-800" : "text-gray-400"
                  }
                >
                  {formData.manager.name || "Select Designation"}
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
                <div className="absolute z-10 w-full h-[190px] overflow-y-auto custom-scrollbar mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
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
                          manager: {
                            employeeId: manager.employeeId,
                            name: manager.name,
                          },
                        }));
                        setShowDropDown((prev) => ({
                          ...prev,
                          manager: false,
                        }));
                      }}
                    >
                      {manager.name} ({manager.designation})
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
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

export default EditEmployeeModel;
