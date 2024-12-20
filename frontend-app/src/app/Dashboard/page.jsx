"use client";
import { useState } from "react";
import AdminList from "./components/adminList";
import RentList from "./components/rentList";
import { signOut } from "next-auth/react";

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
    <>
      <div className="grid grid-cols-2 gap-2 w-full mt-5 min-h-[50vh]">
        <AdminList />
        <RentList />
      </div>
      <div className="flex flex-col items-center justify-center gap-2 w-full mt-5">
        <button
          onClick={() => setShowConfirm(true)}
          className="text-white hover:text-black bg-blue-500 font-bold hover:bg-blue-600 px-2 rounded-md w-24 h-8 text-center"
        >
          Logout
        </button>
      </div>

      {/* Confirmation Popup */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold text-center mb-4 text-black" >
              Confirm Logout
            </h2>
            <p className="text-sm text-gray-700 text-center">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-center mt-4 gap-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-md"
                onClick={handleLogout}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
          Logged out successfully!
        </div>
      )}
    </>
  );
};

export default Dashboard;
