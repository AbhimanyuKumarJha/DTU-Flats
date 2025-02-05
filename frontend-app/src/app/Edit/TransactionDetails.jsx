"use client"
import React from "react";
import { useState, useEffect } from "react";
import api from "../lib/services/api";
import { FaFileDownload, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import RentDisplay from "../lib/utils/RentDisplay";
import { generateAndDownloadPDF } from "../lib/utils/pdfGenerator";
import { FaTrash } from "react-icons/fa";

const StatusIndicator = ({ status, isEditing, onStatusChange }) => {
  const statuses = ["Pending", "Completed", "Failed"];
  let color = "gray";
  if (status === "Completed") color = "green";
  else if (status === "Pending") color = "yellow";
  else if (status === "Failed") color = "red";

  if (isEditing) {
    return (
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        className="p-1 rounded border border-black text-black"
      >
        {statuses.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    );
  }

  return (
    <div className="flex justify-center">
      <span
        className={`inline-block h-4 w-4 rounded-full bg-${color}-500`}
        title={status}
      ></span>
    </div>
  );
};

// const RentDisplay = ({
//   fromMonth,
//   fromYear,
//   tillMonth,
//   tillYear,
//   onClose,
//   isFloorDiscount,
// }) => {
//   return (
//     <div className="bg-gray-100 p-4 rounded-lg">
//       <div className="flex justify-between items-center mb-4">
//         <h3 className="text-lg font-semibold">Rent Details</h3>
//         <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
//           <FaTimes />
//         </button>
//       </div>
//       <div className="grid grid-cols-2 gap-4">
//         <div>
//           <p className="font-medium">From:</p>
//           <p>{`${getMonthName(fromMonth)} ${fromYear}`}</p>
//         </div>
//         <div>
//           <p className="font-medium">To:</p>
//           <p>{`${getMonthName(tillMonth)} ${tillYear}`}</p>
//         </div>
//         {isFloorDiscount && (
//           <div className="col-span-2">
//             <p className="text-green-600">Floor discount applied</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };
// const handleDownload = async (transaction) => {
//   try {
//     // Fetch user data using the userId from the transaction
//     const userData = await api.getUserById(transaction.userId._id);
//     console.log("handledownload userdata",userData);
//     const rentDetails = calculateRentDetails(transaction);
//     const transactionWithRentDetails = { ...transaction, rentDetails, userData }; // Include user data
//     await generateAndDownloadPDF(transactionWithRentDetails);
//   } catch (error) {
//     console.error("Error generating PDF:", error);
//     alert("Failed to generate PDF. Please try again.");
//   }
// };
const TransactionCard = ({
  transaction,
  userId,
  onDownload,
  onUpdateSuccess,
}) => {
  const {
    monthsPaid,
    calculatedAmount,
    paymentMode,
    status,
    transactionDate,
    paymentDetails,
    _id,
    isFloorDiscount,
  } = transaction;

  const [showRentDisplay, setShowRentDisplay] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTransaction, setEditedTransaction] = useState(transaction);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

  const handleRentDisplay = () => {
    setShowRentDisplay(true);
  };
  const handleDelete = async () => {
    try {
      await api.deleteTransaction(_id);
      setShowDeleteConfirm(false);
      setShowDeleteSuccess(true);
      setTimeout(() => {
        setShowDeleteSuccess(false);
        if (onUpdateSuccess) {
          onUpdateSuccess();
        }
      }, 2000);
    } catch (err) {
      console.error("Error deleting transaction:", err);
      setError(err.message || "Failed to delete transaction");
    }
  };
  const handleCloseRentDisplay = () => {
    setShowRentDisplay(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedTransaction({ ...transaction });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedTransaction({ ...transaction });
    setError(null);
  };

  const handleStatusChange = (newStatus) => {
    setEditedTransaction((prev) => ({
      ...prev,
      status: newStatus,
    }));
  };

  const handlePaymentDetailsChange = (e) => {
    const { name, value } = e.target;
    setEditedTransaction((prev) => ({
      ...prev,
      paymentDetails: {
        ...prev.paymentDetails,
        [name]: value,
      },
    }));
  };

  const handleSave = async () => {
    try {
      // Prepare the update payload
      const updatedTransaction = {
        status: editedTransaction.status,
        paymentDetails: {},
      };

      // Add payment details based on payment mode
      if (paymentMode === "UPI") {
        updatedTransaction.paymentDetails.upiTransactionId =
          editedTransaction.paymentDetails.upiTransactionId;
      } else if (paymentMode === "DD" || paymentMode === "Cheque") {
        updatedTransaction.paymentDetails.chequeOrDDNumber =
          editedTransaction.paymentDetails.chequeOrDDNumber;
      }

      // Validation
      if (
        paymentMode === "UPI" &&
        !updatedTransaction.paymentDetails.upiTransactionId
      ) {
        throw new Error("UPI Transaction ID is required for UPI payments");
      }

      if (
        (paymentMode === "Cheque" || paymentMode === "DD") &&
        !updatedTransaction.paymentDetails.chequeOrDDNumber
      ) {
        throw new Error(`${paymentMode} number is required`);
      }

      // Call the API with the correct parameters
      await api.updateTransactionByUserId(userId, _id, updatedTransaction);

      setIsEditing(false);
      setError(null);

      // Refresh the transactions list
      if (onUpdateSuccess) {
        onUpdateSuccess();
      }
    } catch (err) {
      console.error("Error updating transaction:", err);
      setError(err.message || "Failed to update transaction");
    }
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
    <div className="bg-white bg-opacity-60 shadow-lg hover:shadow-xl border border-gray-100 hover:border-gray-200 transition-all duration-300 rounded-xl p-8 grid grid-cols-2 gap-6 items-start md:w-4/5 lg:w-4/5 mx-auto">
      {/* Transaction Period */}
      {/* <button 
        onClick={() => setShowDeleteConfirm(true)}
        className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition-colors"
        title="Delete transaction"
      >
        <FaTrash className="w-4 h-4" />
      </button> */}
      <div className="flex items-center gap-3">
        <span className="text-gray-700 font-medium min-w-20">From:</span>
        <span className="text-gray-900">
          {fromMonth && fromYear
            ? `${getMonthName(fromMonth)} ${fromYear}`
            : "N/A"}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-gray-700 font-medium min-w-20">To:</span>
        <span className="text-gray-900">
          {tillMonth && tillYear
            ? `${getMonthName(tillMonth)} ${tillYear}`
            : "N/A"}
        </span>
      </div>

      {/* Total Amount */}
      <div className="flex items-center gap-3">
        <span className="text-gray-700 font-medium">Total Amount:</span>
        <span className="text-gray-900 font-semibold">₹{calculatedAmount}</span>
        <button
          onClick={handleRentDisplay}
          className="bg-blue-500 text-white px-4 py-1.5 text-sm rounded-lg hover:bg-blue-600 transition-colors ml-2"
        >
          check
        </button>
      </div>

      {/* Payment Mode */}
      <div className="flex items-center gap-3">
        <span className="text-gray-700 font-medium">Payment Mode:</span>
        <span className="text-gray-900">{paymentMode}</span>
      </div>

      {/* Payment Status */}
      <div className="flex items-center gap-3">
        <span className="text-black font-x">Payment Status:</span>
        <StatusIndicator
          status={isEditing ? editedTransaction.status : status}
          isEditing={isEditing}
          onStatusChange={handleStatusChange}
        />
      </div>

      {/* Transaction Date and Time */}
      <div className="flex flex-col gap-1">
        <span className="text-gray-700 font-medium">Transaction Date:</span>
        <span className="text-gray-900">{formattedTransactionDate}</span>
      </div>

      {/* Conditional Payment Details */}
      {paymentMode !== "Cash" && (
  <div className="flex items-center gap-3 col-span-2">
  <span className="text-black font-medium">
    {paymentMode === "Cheque" || paymentMode === "DD"
      ? `${paymentMode} Number:`
      : "UPI ID:"}
  </span>
  {isEditing ? (
    <input
      type="text"
      name={paymentMode === "UPI" ? "upiTransactionId" : "chequeOrDDNumber"}
      value={
        paymentMode === "UPI"
          ? editedTransaction.paymentDetails.upiTransactionId || ""
          : editedTransaction.paymentDetails.chequeOrDDNumber || ""
      }
      onChange={handlePaymentDetailsChange}
      className="border border-gray-500 focus:border-black focus:ring focus:ring-blue-300 font-medium text-black rounded px-2 py-1 bg-white shadow-sm placeholder-black"
      placeholder={
        paymentMode === "UPI"
          ? "Enter UPI Transaction ID"
          : "Enter Cheque/DD Number"
      }
    />
  ) : (
    <span className="text-black">
      {paymentMode === "UPI"
        ? paymentDetails.upiTransactionId || "N/A"
        : paymentDetails.chequeOrDDNumber || "N/A"}
    </span>
  )}
  {/* Delete Confirmation Modal */}
  
      
</div>
)}


      {/* Error message */}
      {error && <div className="col-span-2 text-red-500 text-sm">{error}</div>}

      {/* Action Buttons */}
      <div className="col-span-2 flex justify-end gap-4">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              <FaSave className="w-4 h-4" /> Save
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              <FaTimes className="w-4 h-4" /> Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              <FaEdit className="w-4 h-4" /> Edit
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              <FaTrash className="w-4 h-4" /> Delete
            </button>
          </>
          
        )}
        {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h3 className="text-lg font-semibold mb-4 text-black ">Confirm Delete</h3>
            <p className="text-black">Are you sure you want to delete this transaction?</p>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Success Modal */}
      {showDeleteSuccess && (
        <div className="fixed inset-0 bg-green-400 bg-opacity-45 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <p className="text-green-600 font-semibold">Transaction deleted successfully!</p>
          </div>
        </div>
      )}
        {/* Download Button */}
        {/* <button
          onClick={handleDownload}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          <FaFileDownload className="w-4 h-4" />
          Download Receipt
        </button> */}
      </div>

      {showRentDisplay && (
        <div className="col-span-2 mt-6">
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
  );
};

const getMonthName = (monthNumber) => {
  const date = new Date();
  date.setMonth(monthNumber - 1);
  return date.toLocaleString("default", { month: "short" });
};

const TransactionDetails = ({ userId }) => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const userTransactions = await api.getTransactionsByUserId(userId);
      setTransactions(userTransactions);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Failed to load user data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  return (
    <>
      <h1 className="mx-auto text-center text-black text-2xl font-bold mb-2">
        {loading ? "Loading..." : transactions.length > 0 ? "Transactions" : "No Transactions Available"}
      </h1>
      {loading ? (
        <div className="flex justify-center items-center">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 bg-opacity-60 gap-6 overflow-auto max-h-[80vh]">
          {error && <div className="text-red-500">{error}</div>}
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <TransactionCard
                key={transaction._id}
                transaction={transaction}
                userId={userId}
                onUpdateSuccess={fetchUserData}
                
              />
            ))
          ) : (
            <p></p>
          )}
        </div>
      )}
    </>
  );
};

export default TransactionDetails;
