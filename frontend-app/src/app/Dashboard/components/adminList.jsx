import React, { useState, useEffect } from "react";
import api from "../../lib/services/api";
import { FaTrash, FaPlus, FaUserPlus } from "react-icons/fa";
import { adminSchema } from "../../lib/validations/formSchemas";
import { motion, AnimatePresence } from "framer-motion";

const AdminList = ({ LoadingSpinner }) => {
  const [adminList, setAdminList] = useState([]);
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showAddConfirmation, setShowAddConfirmation] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedAdminId, setSelectedAdminId] = useState(null);
  const [loading, setLoading] = useState(true);

  const validatedAdmin = adminSchema.safeParse({
    name: adminName,
    email: adminEmail,
  });

  useEffect(() => {
    api.getAllAdmins()
      .then((data) => {
        setAdminList(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <LoadingSpinner />;

  const handleDelete = (adminId) => {
    setShowDeleteConfirmation(true);
    setSelectedAdminId(adminId);
  };

  const confirmDelete = () => {
    api.deleteAdmin(selectedAdminId).then(() => {
      setAdminList(adminList.filter((admin) => admin._id !== selectedAdminId));
      setShowDeleteConfirmation(false);
      setSuccessMessage("Admin deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    });
  };

  const handleAddAdmin = () => {
    if (validatedAdmin.success) {
      setShowAddConfirmation(true);
    }
  };

  const confirmAddAdmin = () => {
    api.createAdmin(validatedAdmin.data).then((data) => {
      setAdminList([...adminList, data]);
      setAdminName("");
      setAdminEmail("");
      setShowAddConfirmation(false);
      setSuccessMessage("Admin added successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    });
  };

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="bg-gradient-to-r from-blue-100 to-blue-300 p-4 rounded-lg shadow-sm">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Admin name"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              className="flex-1 text-black px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            <input
              type="email"
              placeholder="Admin email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              className="flex-1 px-4 text-black py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddAdmin}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              <FaUserPlus className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {adminList.map((admin, index) => (
            <motion.div
              key={admin._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <p className="font-medium text-gray-800">{admin.name}</p>
                  <p className="text-sm text-gray-500">{admin.email}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleDelete(admin._id)}
                  className="text-red-500 hover:text-red-600 transition-colors duration-200"
                >
                  <FaTrash className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {successMessage && (
        <div className="mb-4 p-2 bg-green-300 text-green-800 rounded-md">
          {successMessage}
        </div>
      )}

      {showDeleteConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center ">
          <div className="bg-gradient-to-r from-blue-100 to-blue-300 p-6 rounded-md shadow-lg border-neutral-800">
            <p className="text-black">Are you sure you want to delete this admin?</p>
            <div className="flex gap-4 mt-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md"
                onClick={confirmDelete}
              >
                Confirm
              </button>
              <button
                className="bg-gray-500 px-4 py-2 rounded-md"
                onClick={() => setShowDeleteConfirmation(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddConfirmation && (
        <div className="fixed inset-0  flex items-center justify-center   ">
          <div className="bg-gradient-to-r from-blue-100 to-blue-300  p-6 l bg-opacity-10 backdrop-blur-md rounded-md ">
            <p className="text-black">Are you sure you want to add this admin?</p>
            <div className="flex gap-4 mt-4">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-md"
                onClick={confirmAddAdmin}
              >
                Confirm
              </button>
              <button
                className="bg-gray-500 px-4 py-2 rounded-md"
                onClick={() => setShowAddConfirmation(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminList;
