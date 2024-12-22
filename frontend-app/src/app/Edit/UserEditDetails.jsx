import React, { useState, useEffect } from "react";
import { 
  XCircle,
  UserCircle, 
  Receipt,
  Loader2,
  Settings
} from "lucide-react";
import Form from "../New/Form";
import TransactionDetails from "./TransactionDetails";
import api from "../lib/services/api";

const UserEditDetails = ({ userId, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState("personal");
  const [editUser, setEditUser] = useState({
    name: "",
    dateOfBirth: "",
    address: "",
    floorNumber: "",
    units: "",
    monthlyCharges: "",
    mobileNumber: "",
    alternateMobileNumber: "",
    certificateIssued: "",
    isActive: false,
    gender: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true);
      try {
        const userData = await api.getUserById(userId);
        if (userData) {
          setEditUser({
            id: userData._id,
            name: userData.name,
            dateOfBirth: new Date(userData.dateOfBirth).toISOString().split("T")[0],
            address: userData.address,
            floorNumber: userData.floorNumber,
            units: userData.units,
            monthlyCharges: userData.monthlyCharges,
            mobileNumber: userData.mobileNumber,
            alternateMobileNumber: userData.alternateMobileNumber,
            certificateIssued: userData.certificateIssued,
            isActive: userData.isActive,
            gender: userData.gender,
          });
        } else {
          console.error("User data is undefined");
          setEditUser({
            id: "",
            name: "",
            dateOfBirth: "",
            address: "",
            floorNumber: "",
            units: "",
            monthlyCharges: "",
            mobileNumber: "",
            alternateMobileNumber: "",
            certificateIssued: "",
            isActive: false,
            gender: ""
          });
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserDetails();
    }
  }, [userId]);

  const handleUpdate = async () => {
    try {
      await api.updateUser(editUser.id, editUser);
      await onUpdate();
      onClose();
    } catch (error) {
      console.error("Error updating user details:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-gradient-to-br from-violet-50 via-white to-blue-50 w-full md:w-2/3 lg:w-1/2 rounded-xl shadow-2xl relative overflow-hidden border border-gray-200/50 transform transition-all duration-500 hover:shadow-blue-200/50 animate-slideUp">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Settings className="w-12 h-12 text-blue-500 animate-spin" />
            <div className="ml-4 text-lg font-medium text-blue-500 animate-pulse">
              Loading details...
            </div>
          </div>
        ) : (
          <>
            <div className="flex relative overflow-hidden">
              <button
                onClick={() => setActiveTab("personal")}
                className={`flex-1 py-4 px-6 text-center text-base font-bold transition-all duration-500 ease-in-out flex items-center justify-center gap-2 group
                  ${activeTab === "personal"
                    ? "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white shadow-lg"
                    : "text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"
                  }`}
              >
                <UserCircle className={`w-5 h-5 transition-transform duration-300 ${
                  activeTab === "personal" ? "rotate-0" : "group-hover:rotate-12"
                }`} />
                <span className="relative">
                  Personal Details
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 transition-all duration-300 transform ${
                    activeTab === "personal" ? "scale-x-100 bg-white" : "scale-x-0 bg-blue-500 group-hover:scale-x-100"
                  }`}></span>
                </span>
              </button>
              <button
                onClick={() => setActiveTab("transaction")}
                className={`flex-1 py-4 px-6 text-center text-base font-bold transition-all duration-500 ease-in-out flex items-center justify-center gap-2 group
                  ${activeTab === "transaction"
                    ? "bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white shadow-lg"
                    : "text-gray-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50"
                  }`}
              >
                <Receipt className={`w-5 h-5 transition-transform duration-300 ${
                  activeTab === "transaction" ? "rotate-0" : "group-hover:rotate-12"
                }`} />
                <span className="relative">
                  Transaction Details
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 transition-all duration-300 transform ${
                    activeTab === "transaction" ? "scale-x-100 bg-white" : "scale-x-0 bg-purple-500 group-hover:scale-x-100"
                  }`}></span>
                </span>
              </button>
            </div>

            <div className="p-6 bg-blue-200 backdrop-blur-sm">
              <div className="transform transition-all duration-500 ease-in-out">
                {activeTab === "personal" ? (
                  <Form
                    data={editUser}
                    mode="edit"
                    updateList={handleUpdate}
                    closeModal={onClose}
                  />
                ) : (
                  <TransactionDetails userId={userId} />
                )}
              </div>
            </div>
          </>
        )}

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all duration-300 ease-in-out group transform hover:rotate-90 hover:scale-110"
        >
          <XCircle className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default UserEditDetails;