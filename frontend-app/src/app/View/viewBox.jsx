"use client";
import React, { useState } from "react";
import { FaFileDownload } from "react-icons/fa";
import PopUp from "../utils/popup";
// import { showRentCalculations } from "../lib/utils/showRentCalculations";
import RentDisplay from "../lib/utils/RentDisplay";

// Status Indicator Component
const StatusIndicator = ({ status }) => {
  let color = "gray";
  if (status === "Completed") color = "green";
  else if (status === "Pending") color = "yellow";
  else if (status === "Failed") color = "red";

  return (
    <div className="flex justify-center">
      <span
        className={`inline-block h-4 w-4 rounded-full bg-${color}-500`}
        title={status}
      ></span>
    </div>
  );
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
  } = user;

  const formattedDOB = new Date(dateOfBirth).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-6 md:w-3/5 mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-black text-center">
        User Details
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-lg">
        <div className="flex items-center  ">
          <span className="text-gray-700 font-semibold px-2">Name:</span>
          <span className="text-black ">{name}</span>
        </div>
        {/* gender */}
        <div className="flex items-center  ">
          <span className="text-gray-700 font-semibold px-2">Gender:</span>
          <span className="text-black ">{gender}</span>
        </div>
        <div className="flex items-center  ">
          <span className="text-gray-700 font-semibold px-2">
            Mobile Number:
          </span>
          <span className="text-black ">{mobileNumber}</span>
        </div>
        <div className="flex items-center  ">
          <span className="text-gray-700 font-semibold px-2">
            Alternate Mobile Number:
          </span>
          <span className="text-black ">{alternateMobileNumber}</span>
        </div>
        <div>
          <span className="text-gray-700 font-semibold px-2">
            Date of Birth:
          </span>
          <span className="text-black ">{formattedDOB}</span>
        </div>
        <div>
          <span className="text-gray-700 font-semibold px-2">Address:</span>
          <span className="text-black ">{address}</span>
        </div>
        <div>
          <span className="text-gray-700 font-semibold px-2">
            Floor Number:
          </span>
          <span className="text-black ">{floorNumber.join(", ")}</span>
        </div>

        <div>
          <span className="text-gray-700 font-semibold px-2">
            Certificate Issued:
          </span>
          <span className="text-black ">{certificateIssued}</span>
        </div>
        <div>
          <span className="text-gray-700 font-semibold px-2">Status:</span>
          <span className="text-black ">
            {isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </div>
    </div>
  );
};

// Transaction Card Component
const TransactionCard = ({ transaction, onDownload }) => {
  const {
    monthsPaid,
    calculatedAmount,
    paymentMode,
    status,
    transactionDate,
    paymentDetails,
  } = transaction;

  const [showRentDisplay, setShowRentDisplay] = useState(false);

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

  return (
    <div className="bg-white shadow-md hover:shadow-xl border-2 border-white hover:border-gray-400 transition-shadow duration-300 rounded-lg p-6 grid grid-cols-2 space-y-4 items-center md:w-3/5 mx-auto transaction-card">
      {/* Transaction Period */}
      <div className="flex gap-2">
        <span className="text-gray-700 font-semibold">From:</span>
        <span className="text-black">
          {fromMonth && fromYear
            ? `${getMonthName(fromMonth)} ${fromYear}`
            : "N/A"}
        </span>
      </div>

      <div className="flex gap-2">
        <span className="text-gray-700 font-semibold">To:</span>
        <span className="text-black">
          {tillMonth && tillYear
            ? `${getMonthName(tillMonth)} ${tillYear}`
            : "N/A"}
        </span>
      </div>

      {/* Total Amount */}
      <div className="flex gap-2">
        <span className="text-gray-700 font-semibold">Total Amount:</span>
        <span className="text-black">₹{calculatedAmount}</span>
        <button
          onClick={handleRentDisplay}
          className="bg-blue-500 text-white px-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          check
        </button>
      </div>

      {/* Payment Mode */}
      <div className="flex gap-2">
        <span className="text-gray-700 font-semibold">Payment Mode:</span>
        <span className="text-black">{paymentMode}</span>
      </div>

      {/* Payment Status */}
      <div className="flex items-center">
        <span className="text-gray-700 font-semibold mr-2">
          Payment Status:
        </span>
        <StatusIndicator status={status} />
      </div>

      {/* Transaction Date and Time */}
      <div className="flex flex-col">
        <span className="text-gray-700 font-semibold">Transaction Date:</span>
        <span className="text-black">{formattedTransactionDate}</span>
      </div>

      {/* Conditional Payment Details */}
      {paymentMode !== "Cash" && (
        <div className="flex gap-2">
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

      {/* Download Button */}
      <button
        onClick={() => onDownload(transaction)}
        className=" flex items-center bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors w-fit ml-auto mr-0"
      >
        <FaFileDownload className="mr-2" />
        Download
      </button>

      {showRentDisplay && (
        <div className="mt-4">
          <RentDisplay
            fromMonth={fromMonth}
            fromYear={fromYear}
            tillMonth={tillMonth}
            tillYear={tillYear}
            onClose={handleCloseRentDisplay}
          />
        </div>
      )}
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
    <div className="h-full">
      {/* User Details Card */}
      <UserCard user={user} />
      <h1 className="text-4xl font-bold text-black text-center">
        Transactions
      </h1>
      {/* Transactions Grid */}
      <div className="grid grid-cols-1 gap-6">
        {transactions.map((transaction) => (
          <TransactionCard
            key={transaction._id}
            transaction={transaction}
            onDownload={onDownload}
          />
        ))}
      </div>
    </div>
  );
};

export default ViewBox;
