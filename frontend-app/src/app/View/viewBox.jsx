"use client";
import React, { useState } from "react";
import { FaDownload, FaUser, FaPhone, FaAddressCard, FaCalendar, FaBuildingUser, FaCertificate, FaCircleCheck, FaFileDownload } from "react-icons/fa6";
import { MdPayments } from "react-icons/md";
import { MdOutlineEmail } from "react-icons/md";
import { BiTime } from "react-icons/bi";
import PopUp from "../utils/popup";
// import { showRentCalculations } from "../lib/utils/showRentCalculations";
import RentDisplay from "../lib/utils/RentDisplay";
import { generateAndDownloadPDF } from "../lib/utils/pdfGenerator";

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
  </div>
);

// Status Indicator Component with gradient animation
const StatusIndicator = ({ status }) => {
  let baseColor = "gray";
  let pulseColor = "gray";
  
  if (status === "Completed") {
    baseColor = "green";
    pulseColor = "emerald";
  } else if (status === "Pending") {
    baseColor = "yellow";
    pulseColor = "amber";
  } else if (status === "Failed") {
    baseColor = "red";
    pulseColor = "rose";
  }

  return (
    <div className="flex justify-center">
      <span
        className={`inline-block h-4 w-4 rounded-full bg-${baseColor}-500 animate-pulse ring-2 ring-${pulseColor}-300 ring-offset-2`}
        title={status}
      ></span>
    </div>
  );
};

// Avatar Component
const Avatar = ({ name }) => {
  // ... existing code ...
};

// User Details Card Component
const UserCard = ({ user }) => {
  const {
    name,
    gender,
    mobileNumber,
    alternateMobileNumber,
    dateOfBirth,
    address,
    floorNumber,
    certificateIssued,
    isActive,
    email,
    alternateEmail,
  } = user;

  const isFloorDiscount = floorNumber.length > 3;

  const formattedDOB = new Date(dateOfBirth).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50 to-indigo-50 shadow-lg rounded-lg p-6 mb-6 md:w-3/5 mx-auto transform transition-all duration-300 hover:scale-102 hover:shadow-xl border border-transparent hover:border-blue-200">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-indigo-400/10 to-purple-400/10 animate-gradient-xy"></div>
      <div className="relative z-10">
        {/* Avatar and Header Section */}
        <div className="flex flex-col items-center mb-6 space-y-4">
          <Avatar name={name} />
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Personal Details
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
          {/* Name and Mobile in first row */}
          <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-white/50 transition-all duration-200 backdrop-blur-sm hover:shadow-md group">
            <FaUser className="text-blue-500 text-xl group-hover:scale-110 transition-transform duration-200" />
            <span className="text-gray-700 font-semibold">Name:</span>
            <span className="text-black">{name}</span>
          </div>
          <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-white/50 transition-all duration-200">
            <FaPhone className="text-blue-500 text-xl" />
            <span className="text-gray-700 font-semibold">Mobile:</span>
            <span className="text-black">{mobileNumber}</span>
          </div>
          {/* Alternate Mobile if exists */}
          {alternateMobileNumber && (
            <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-white/50 transition-all duration-200">
              <FaPhone className="text-blue-500 text-xl" />
              <span className="text-gray-700 font-semibold">Alt Mobile:</span>
              <span className="text-black">{alternateMobileNumber}</span>
            </div>
          )}
          {/* Email takes full width */}
          {email && (
            <div className="md:col-span-2 flex items-center space-x-2 p-3 rounded-lg hover:bg-white/50 transition-all duration-200">
              <MdOutlineEmail className="text-blue-500 text-xl" />
              <span className="text-gray-700 font-semibold">Email:</span>
              <span className="text-black truncate">{email}</span>
            </div>
          )}
          {/* Alternate Email takes full width if exists */}
          {alternateEmail && (
            <div className="md:col-span-2 flex items-center space-x-2 p-3 rounded-lg hover:bg-white/50 transition-all duration-200">
              <MdOutlineEmail className="text-blue-500 text-xl" />
              <span className="text-gray-700 font-semibold">Alt Email:</span>
              <span className="text-black truncate">{alternateEmail}</span>
            </div>
          )}
          {/* Address takes full width */}
          <div className="md:col-span-2 flex items-center space-x-2 p-3 rounded-lg hover:bg-white/50 transition-all duration-200">
            <FaAddressCard className="text-blue-500 text-xl" />
            <span className="text-gray-700 font-semibold">Address:</span>
            <span className="text-black">{address}</span>
          </div>
          {/* Other details in two columns */}
          <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-white/50 transition-all duration-200">
            <FaCalendar className="text-blue-500 text-xl" />
            <span className="text-gray-700 font-semibold">DOB:</span>
            <span className="text-black">{formattedDOB}</span>
          </div>
          <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-white/50 transition-all duration-200">
            <FaBuildingUser className="text-blue-500 text-xl" />
            <span className="text-gray-700 font-semibold">Floor:</span>
            <span className="text-black">{floorNumber.join(", ")}</span>
          </div>
          <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-white/50 transition-all duration-200">
            <FaCertificate className="text-blue-500 text-xl" />
            <span className="text-gray-700 font-semibold">Certificate:</span>
            <span className="text-black">{certificateIssued}</span>
          </div>
          <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-white/50 transition-all duration-200">
            <FaCircleCheck className="text-blue-500 text-xl" />
            <span className="text-gray-700 font-semibold">Status:</span>
            <span className="text-black">{isActive ? "Active" : "Inactive"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Transaction Card Component
const TransactionCard = ({ transaction, onDownload, user }) => {
  const {
    monthsPaid,
    calculatedAmount,
    paymentMode,
    status,
    transactionDate,
    paymentDetails,
  } = transaction;

  const [showRentDisplay, setShowRentDisplay] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRentDisplay = () => {
    setShowRentDisplay(true);
  };

  const handleCloseRentDisplay = () => {
    setShowRentDisplay(false);
  };

  const fromMonth = monthsPaid[0].month;
  const fromYear = monthsPaid[0].year;
  const tillMonth = monthsPaid[monthsPaid.length - 1].month;
  const tillYear = monthsPaid[monthsPaid.length - 1].year;
  const formattedTransactionDate = new Date(transactionDate).toLocaleString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  const handleDownload = async (transaction) => {
    setIsLoading(true);
    await onDownload(transaction);
    setIsLoading(false);
  };

  const isFloorDiscount = user.floorNumber.length > 3;

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50 to-indigo-50 shadow-md hover:shadow-xl border-2 border-transparent hover:border-blue-200 transition-all duration-300 rounded-lg p-6 md:w-3/5 mx-auto">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 via-indigo-400/5 to-purple-400/5 animate-gradient-xy"></div>
      <div className="relative z-10 grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded-lg transition-colors duration-200">
          <BiTime className="text-blue-500" />
          <span className="text-gray-700 font-semibold">From:</span>
          <span className="text-black">{`${getMonthName(fromMonth)} ${fromYear}`}</span>
        </div>
        <div className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded-lg transition-colors duration-200">
          <BiTime className="text-blue-500" />
          <span className="text-gray-700 font-semibold">To:</span>
          <span className="text-black">{`${getMonthName(tillMonth)} ${tillYear}`}</span>
        </div>
        <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-white/50 transition-all duration-200 backdrop-blur-sm hover:shadow-md group">
          <MdPayments className="text-blue-500 group-hover:scale-110 transition-transform duration-200" />
          <span className="text-gray-700 font-semibold">Amount:</span>
          <span className="text-black">₹{calculatedAmount}</span>
          <button
            onClick={() => setShowRentDisplay(true)}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1 rounded-md hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            Check
          </button>
        </div>
        <div className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded-lg transition-colors duration-200">
          <MdPayments className="text-blue-500" />
          <span className="text-gray-700 font-semibold">Payment Mode:</span>
          <span className="text-black">{paymentMode}</span>
        </div>
        <div className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded-lg transition-colors duration-200">
          <FaCircleCheck className="text-blue-500" />
          <span className="text-gray-700 font-semibold">Payment Status:</span>
          <StatusIndicator status={status} />
        </div>
        <div className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded-lg transition-colors duration-200">
          <BiTime className="text-blue-500" />
          <span className="text-gray-700 font-semibold">Transaction Date:</span>
          <span className="text-black">{formattedTransactionDate}</span>
        </div>
        {paymentMode !== "Cash" && (
          <div className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded-lg transition-colors duration-200">
            <MdPayments className="text-blue-500" />
            <span className="text-gray-700 font-semibold">
              {paymentMode === "Cheque" || paymentMode === "DD"
                ? `${paymentMode} Number:`
                : "UPI ID:"}
            </span>
            <span className="text-black">
              {paymentMode === "Cheque" || paymentMode === "DD"
                ? paymentDetails.chequeOrDDNumber || "N/A"
                : paymentDetails.upiTransactionId || "N/A"}
            </span>
          </div>
        )}
        <button
          onClick={() => handleDownload(transaction)}
          disabled={isLoading}
          className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-md hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed w-fit ml-auto h-10"
        >
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              <FaDownload className="mr-2" />
              Download Receipt
            </>
          )}
        </button>
        {showRentDisplay && (
          <div className="mt-4">
            <RentDisplay
              fromMonth={fromMonth}
              fromYear={fromYear}
              tillMonth={tillMonth}
              tillYear={tillYear}
              onClose={handleCloseRentDisplay}
              isFloorDiscount={isFloorDiscount}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to get month name from month number
const getMonthName = (monthNumber) => {
  const date = new Date();
  date.setMonth(monthNumber - 1);
  return date.toLocaleString("default", { month: "short" });
};

// Main ViewBox Component
const ViewBox = ({ user, transactions, onDownload }) => {
  return (
    <div className="min-h-screen bg-blue-100 bg-opacity-65 backdrop-blur-sm py-6 -px-10">
      <UserCard user={user} />
      <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-blue-600 text-center mb-8">
        Transaction Details
      </h1>
      <div className="grid grid-cols-1 gap-6">
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <TransactionCard
              key={transaction._id}
              transaction={transaction}
              onDownload={onDownload}
              user={user}
            />
          ))
        ) : (
          <p className="text-center text-2xl text-gray-700">No transactions available.</p>
        )}
      </div>
    </div>
  );
};

export default ViewBox;
