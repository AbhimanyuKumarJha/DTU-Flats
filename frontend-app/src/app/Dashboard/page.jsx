"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { FiLogOut, FiLoader } from "react-icons/fi";

import AdminList from "./components/adminList";
import RentList from "./components/rentList";
import { signOut } from "next-auth/react";

const LoadingSpinner = () => (
  <div className="flex items-center justify-center w-full h-64">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
    />
  </div>
);

const Dashboard = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleLogout = () => {
    setShowConfirm(false);
    setShowSuccess(true);
    setTimeout(() => {
      signOut({ callbackUrl: "/Login" });
    }, 2000); // Delay for showing the success message
  };

  return (
    <div className="min-h-screen ">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="transform transition-all duration-300"
          >
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-blue-100">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
                <h2 className="text-xl font-semibold text-white">Admin Management</h2>
              </div>
              <AdminList LoadingSpinner={LoadingSpinner} />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="transform transition-all duration-300"
          >
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-blue-100">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
                <h2 className="text-xl font-semibold text-white">Rent Management</h2>
              </div>
              <RentList LoadingSpinner={LoadingSpinner} />
            </div>
          </motion.div>
        </div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex justify-center"
        >
          <button
            onClick={() => setShowConfirm(true)}
            className="group relative px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            <span className="flex items-center gap-2">
              <FiLogOut className="w-5 h-5" />
              Logout
            </span>
          </button>
        </motion.div>

        {/* Enhanced Confirmation Modal */}
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-xl shadow-2xl p-6 w-96 max-w-md mx-4"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Confirm Logout
              </h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to log out of your account?
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors duration-200"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Enhanced Success Notification */}
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2"
          >
            <span className="text-lg">✓</span>
            <span>Logged out successfully!</span>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
