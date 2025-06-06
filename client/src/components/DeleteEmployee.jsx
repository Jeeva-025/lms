import { FiAlertTriangle, FiX } from "react-icons/fi";
import { motion } from "framer-motion";

const DeleteEmployee = ({ employee, onClose, onConfirm }) => {
  console.log(employee);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden"
      >
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <FiAlertTriangle className="text-yellow-500 mr-2" />
            Confirm Deletion
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-600 mb-4">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-gray-800">
              {employee?.name}
            </span>{" "}
            ({employee?.designation})?
          </p>
          <p className="text-sm text-gray-500 mb-6">
            This action cannot be undone. All associated data will be
            permanently removed.
          </p>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(employee.employee_id)}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Delete Employee
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DeleteEmployee;
