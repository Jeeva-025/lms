import { useState, useEffect } from "react";
import EmployeeCard from "./EmployeeCard";
import EditEmployeeModel from "./EditEmployeeModel";
import axios from "axios";
import { toast } from "react-toastify";
import DeleteEmployee from "./DeleteEmployee"; // Add this import

const EmployeeList = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Add this state
  const [deletingEmployee, setDeletingEmployee] = useState(null); // Add this state
  const [employees, setEmployees] = useState([
    {
      employee_id: 5177,
      name: "Vishal Kumar",
      designation: "Software Developer",
      employment_status: "ACTIVE",
      hr_id: 5359,
      manager_id: 6441,
      director_id: 7762,
      email: "vishal@gmail.com",
      type: "Member",
    },
    {
      employee_id: 5777,
      name: "Rohan Mehta",
      designation: "Manager",
      employment_status: "ACTIVE",
      hr_id: 5359,
      manager_id: null,
      director_id: 9876,
      email: "rohan.mehta@gmail.com",
      type: "Admin",
    },
    {
      employee_id: 8099,
      name: "Ishan Sharma",
      designation: "Software Developer",
      employment_status: "ACTIVE",
      hr_id: 5359,
      manager_id: 6441,
      director_id: 7762,
      email: "ishan@gmail.com",
      type: "Member",
    },
  ]);

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
    console.log(id);
    try {
      // API call to delete from backend
      await axios.patch(
        `http://localhost:3000/deleteUser/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
            "Content-Type": "application/json",
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
    console.log(updatedEmployee);
    // setEmployees(
    //   employees.map((emp) =>
    //     emp.employee_id === updatedEmployee.employee_id ? updatedEmployee : emp
    //   )
    // );/
    try {
      const data = await axios.post(
        "http://localhost:3000/updateUser",
        {
          employee_id: updatedEmployee?.employee_id,
          name: updatedEmployee?.name,
          email: updatedEmployee?.email,
          designation: updatedEmployee?.designation,
          hr_id: updatedEmployee?.hr_id?.employee_id,
          manager_id: updatedEmployee?.manager_id?.employee_id,
          director_id: updatedEmployee?.director_id.employee_id,
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
      console.log(employee.id);
      const response = await axios.get(
        `http://localhost:3000/fetchAllPeopleByHrId/${employee.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
          },
        }
      );
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees.map((employee) => (
            <EmployeeCard
              key={employee.employee_id}
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
