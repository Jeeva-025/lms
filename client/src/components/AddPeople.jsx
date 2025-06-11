import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import API from "../utils/API";

const AddPeople = () => {
  const [designations, setDesignation] = useState([]);
  const [manager, setManager] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [selectManager, setSelectedManager] = useState("");
  const [selectDesignation, setSelectedDesignation] = useState("");
  const [showDropDown, setShowDropDown] = useState({
    manager: false,
    designation: false,
  });
  const [managerDropDown, setManagerDropDown] = useState([]);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    designation: "",
    manager: null,
    email: "",
    password: "",
  });

  const verify = () => {
    if (
      !data.email ||
      !data.firstName ||
      !data.lastName ||
      !data.designation ||
      !data.manager ||
      !data.password
    ) {
      toast.warning("Please fill all details", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      return false;
    }
    return true;
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${API.BASE_URL}${API.ALL_EMPOYEE_TYPE}`,

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      const { data } = await axios.get(
        `${API.BASE_URL}${API.ALL_SENIOR_EMPLOYEE}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response?.data);
      console.log(data);
      setManager(data);
      setManagerDropDown(data);
      setDesignation(response?.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch employee data", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  const handleSubmit = async () => {
    console.log({
      name: `${data.firstName} ${data.lastName}`,
      emp_type_id: data.designation.employeeTypeId,
      manager_id: data.manager.employeeId,
      email: data.email,
      password: data.password,
    });
    try {
      if (verify()) {
        const response = await axios.post(
          `${API.BASE_URL}${API.CREATE_EMPLOYEE}`,
          {
            name: `${data.firstName} ${data.lastName}`,
            emp_type_id: data.designation.employeeTypeId,
            manager_id: data.manager.employeeId,
            email: data.email,
            password: data.password,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("Token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200 || response.status === 201) {
          toast.success("User added successfully", {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
          });
          resetForm();
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to add user", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  console.log(data);
  const resetForm = () => {
    setData({
      firstName: "",
      lastName: "",
      designation: "",
      manager: null,
      email: "",
      password: "",
    });
  };

  useEffect(() => {
    fetchData();
  }, []);
  // useEffect(() => {
  //   if (manager.length)
  //     setManagerDropDown(
  //       manager.filter((each) => each.employeeId !== data?.manager?.employeeId)
  //     );
  // }, [selectManager]);

  useEffect(() => {
    setData((prev) => ({ ...prev, manager: null }));

    const designation = selectDesignation.trim().toLowerCase();

    if (!Array.isArray(manager)) return;

    if (designation.includes("senior")) {
      setManagerDropDown(
        manager.filter((each) => each.designation.toLowerCase().includes("hr"))
      );
    } else if (designation.includes("hr")) {
      setManagerDropDown(
        manager.filter((each) =>
          each.designation.toLowerCase().includes("director")
        )
      );
    } else {
      setManagerDropDown(
        manager.filter((each) =>
          each.designation.toLowerCase().includes("senior")
        )
      );
    }
  }, [selectDesignation]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-4">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 p-6 text-white">
          <h1 className="text-3xl font-bold">Add New Member</h1>
          <p className="text-blue-100 opacity-90 mt-1">
            Fill in the details below to add a new person to the system
          </p>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-gray-700 font-medium">
                First Name
              </label>
              <input
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                value={data.firstName}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, firstName: e.target.value }))
                }
                placeholder="Enter first name"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-gray-700 font-medium">
                Last Name
              </label>
              <input
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                value={data.lastName}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, lastName: e.target.value }))
                }
                placeholder="Enter last name"
              />
            </div>

            <div className="space-y-2 relative">
              <label className="block text-gray-700 font-medium">
                Designation
              </label>
              <div
                className="w-full px-4 py-2 border border-gray-200 rounded-lg cursor-pointer flex justify-between items-center bg-gray-50 hover:bg-white transition-all"
                onClick={() => {
                  setShowDropDown((prev) => ({
                    manager: false,
                    designation: !showDropDown.designation,
                  }));
                }}
              >
                <span
                  className={
                    data.designation ? "text-gray-800" : "text-gray-400"
                  }
                >
                  {data.designation
                    ? data.designation.name
                    : "Select Designation"}
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
                      key={designation.employeeId}
                      className={`px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors ${
                        index === designations.length - 1
                          ? ""
                          : "border-b border-gray-100"
                      }`}
                      onClick={() => {
                        setSelectedDesignation(designation.name);
                        setData((prev) => ({
                          ...prev,
                          designation: designation,
                        }));
                        setShowDropDown((prev) => ({
                          manager: false,
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

            {/* <div className="space-y-2 relative">
              <label className="block text-gray-700 font-medium">Type</label>
              <div
                className="w-full px-4 py-2 border border-gray-200 rounded-lg cursor-pointer flex justify-between items-center bg-gray-50 hover:bg-white transition-all"
                onClick={() =>
                  setShowDropDown((prev) => ({
                    ...prev,
                    type: !showDropDown.type,
                  }))
                }
              >
                <span className={data.type ? "text-gray-800" : "text-gray-400"}>
                  {data.type || "Select Type"}
                </span>
                <svg
                  className={`w-5 h-5 transition-transform text-gray-500 ${
                    showDropDown.type ? "rotate-180" : ""
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

              {showDropDown.type && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                  {types.map((type, index) => (
                    <div
                      key={index}
                      className={`px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors ${
                        index === types.length - 1
                          ? ""
                          : "border-b border-gray-100"
                      }`}
                      onClick={() => {
                        setData((prev) => ({ ...prev, type }));
                        setShowDropDown((prev) => ({ ...prev, type: false }));
                      }}
                    >
                      {type}
                    </div>
                  ))}
                </div>
              )}
            </div> */}

            {/* <div className="space-y-2 relative">
              <label className="block text-gray-700 font-medium">HR</label>
              <div
                className="w-full px-4 py-2 border border-gray-200 rounded-lg cursor-pointer  flex justify-between items-center bg-gray-50 hover:bg-white transition-all"
                onClick={() =>
                  setShowDropDown((prev) => ({ ...prev, hr: !showDropDown.hr }))
                }
              >
                <span className={data.hr ? "text-gray-800" : "text-gray-400"}>
                  {data.hr ? data.hr.name : "Select HR"}
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
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {hr.map((each, index) => (
                    <div
                      key={index}
                      className={`px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors ${
                        index === hr.length - 1
                          ? ""
                          : "border-b border-gray-100"
                      }`}
                      onClick={() => {
                        setData((prev) => ({ ...prev, hr: each }));
                        setShowDropDown((prev) => ({ ...prev, hr: false }));
                      }}
                    >
                      {each.name}
                    </div>
                  ))}
                </div>
              )}
            </div> */}

            <div className="space-y-2 relative">
              <label className="block text-gray-700 font-medium">Manager</label>
              <div
                className="w-full px-4 py-2 border border-gray-200 rounded-lg cursor-pointer flex justify-between items-center bg-gray-50 hover:bg-white transition-all"
                onClick={() =>
                  setShowDropDown((prev) => ({
                    designation: false,
                    manager: !showDropDown.manager,
                  }))
                }
              >
                <span
                  className={data.manager ? "text-gray-800" : "text-gray-400"}
                >
                  {data.manager ? data.manager.name : "Select Manager"}
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
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {managerDropDown.map((each, index) => (
                    <div
                      key={index}
                      className={`px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors ${
                        index === manager.length - 1
                          ? ""
                          : "border-b border-gray-100"
                      }`}
                      onClick={() => {
                        setData((prev) => ({ ...prev, manager: each }));
                        setSelectedManager(each.name);
                        setShowDropDown((prev) => ({
                          designation: false,
                          manager: false,
                        }));
                      }}
                    >
                      {each.name} ({each.designation})
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-gray-700 font-medium">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                value={data.email}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="Enter email address"
              />
            </div>

            <div className="space-y-2 relative">
              <label className="block text-gray-700 font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all bg-gray-50 hover:bg-white pr-10"
                  value={data.password}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, password: e.target.value }))
                  }
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={() => handleSubmit()}
              className="px-8 py-3 bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-800 hover:to-blue-900 text-white font-medium rounded-lg shadow-md transition-all hover:scale-105 transform hover:shadow-lg"
            >
              Add Member
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPeople;
