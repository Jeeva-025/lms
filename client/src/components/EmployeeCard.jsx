import { FiEdit, FiUser, FiMail } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri"; // New delete icon
import PropTypes from "prop-types";

const EmployeeCard = ({ employee, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg border border-gray-100">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            <FiUser className="text-blue-600 text-xl" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              {employee.name}
            </h3>
            <p className="text-blue-600">{employee.designation}</p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center">
            <FiMail className="text-gray-500 mr-2" />
            <span className="text-gray-700">{employee.email}</span>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={() => onEdit(employee)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors hover:scale-110"
            aria-label="Edit"
          >
            <FiEdit className="text-lg" />
          </button>
          <button
            onClick={() => onDelete(employee)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors hover:scale-110"
            aria-label="Delete"
          >
            <RiDeleteBin6Line className="text-lg" />
          </button>
        </div>
      </div>
    </div>
  );
};

EmployeeCard.propTypes = {
  employee: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default EmployeeCard;
