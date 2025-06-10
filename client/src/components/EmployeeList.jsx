import { useState, useEffect } from "react";
import EmployeeCard from "./EmployeeCard";
import EditEmployeeModel from "./EditEmployeeModel";
import axios from "axios";
import { toast } from "react-toastify";
import DeleteEmployee from "./DeleteEmployee";
import API from "../utils/API";

const EmployeeList = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingEmployee, setDeletingEmployee] = useState(null);
  const [employees, setEmployees] = useState([]);

  const [editingEmployee, setEditingEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setShowModal(true);
  };

  const handleDeleteClick = (employee) => {
    setDeletingEmployee(employee);
    setShowDeleteModal(true);
  };
  const handleDeleteConfirm = async (id) => {
    try {
      const response = await axios.patch(
        `${API.BASE_URL}${API.DELETE_EMPLOYEE}`,
        { employee_id: id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
          },
        }
      );

      await fetchData();
      toast.success("Employee deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete employee");
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleSave = async (updatedEmployee) => {
    // setEmployees(
    //   employees.map((emp) =>
    //     emp.employee_id === updatedEmployee.employee_id ? updatedEmployee : emp
    //   )
    // );/
    try {
      const data = await axios.post(
        `${API.BASE_URL}${API.UPDATE_EMPLOYEE}`,
        {
          employee_id: updatedEmployee?.employee_id,
          name: updatedEmployee?.name,
          email: updatedEmployee?.email,
          emp_type_id: updatedEmployee?.designation?.employeeTypeId,
          manager_id: updatedEmployee?.manager.employeeId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      await fetchData();
      setShowModal(false);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchData = async () => {
    try {
      const employee = JSON.parse(localStorage.getItem("Employee"));
      const response = await axios.get(`${API.BASE_URL}${API.ALL_EMPLOYEE}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("Token")}`,
        },
      });
      setEmployees(response?.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to Fetch Data");
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Employee Management
          </h1>
          <p className="text-gray-600">
            View and manage your organization's employees
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[calc(100vh-200px)] overflow-auto custom-scrollbar">
          {employees.map((employee) => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      </div>

      {showModal && (
        <EditEmployeeModel
          employee={editingEmployee}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}

      {showDeleteModal && (
        <DeleteEmployee
          employee={deletingEmployee}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
};

export default EmployeeList;
