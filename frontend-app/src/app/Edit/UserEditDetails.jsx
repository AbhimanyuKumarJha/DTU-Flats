import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import Form from "../New/Form";
import TransactionDetails from "./TransactionDetails";

const UserEditDetails = ({ userId, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState("personal");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-500 w-full md:w-2/3 lg:w-1/2 rounded-lg shadow-lg relative">
        {/* Tabs */}
        <div className="flex">
          <button
            onClick={() => setActiveTab("personal")}
            className={`flex-1 py-2 text-center text-base font-bold border-4 ${
              activeTab === "personal"
                ? "text-blue-600 border-blue-500 bg-white"
                : "text-gray-500 bg-gray-100 border-transparent"
            }`}
          >
            Personal Details
          </button>
          <button
            onClick={() => setActiveTab("transaction")}
            className={`flex-1 py-2 text-center text-base font-bold border-4 ${
              activeTab === "transaction"
                ? "text-blue-600 border-blue-500 bg-white"
                : "text-gray-500 bg-gray-100 border-transparent"
            }`}
          >
            Transaction Details
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "personal" ? (
            <Form
              userId={userId}
              mode="edit"
              updateList={onUpdate}
              closeModal={onClose}
            />
          ) : (
            <TransactionDetails userId={userId} />
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-14 right-4 bg-red-500 p-2 text-sm rounded-full text-white hover:text-gray-800"
        >
          <AiOutlineClose size={24} />
        </button>
      </div>
    </div>
  );
};

export default UserEditDetails;