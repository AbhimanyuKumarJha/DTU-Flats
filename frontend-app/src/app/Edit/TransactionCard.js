import React from "react";

const TransactionCard = ({ transaction }) => {
  const {
    userId,
    monthsPaid,
    calculatedAmount,
    paymentMode,
    paymentDetails,
    status,
    transactionDate,
  } = transaction;

  return (
    <div className="border rounded-lg p-4 shadow-md bg-white mb-4">
      <p>
        <strong>Transaction ID:</strong> {transaction._id}
      </p>
      <p>
        <strong>User ID:</strong> {userId}
      </p>
      <p>
        <strong>Transaction Date:</strong> {new Date(transactionDate).toLocaleString()}
      </p>
      <p>
        <strong>Months Paid:</strong>{" "}
        {monthsPaid.map((month, index) => (
          <span key={index} className="mr-2">
            {month.month}/{month.year}
          </span>
        ))}
      </p>
      <p>
        <strong>Calculated Amount:</strong> ₹{calculatedAmount}
      </p>
      <p>
        <strong>Payment Mode:</strong> {paymentMode}
      </p>

      {paymentMode === "Cheque" || paymentMode === "DD" ? (
        <p>
          <strong>Cheque/DD Number:</strong> {paymentDetails?.chequeOrDDNumber || "N/A"}
        </p>
      ) : paymentMode === "UPI" ? (
        <p>
          <strong>UPI Transaction ID:</strong> {paymentDetails?.upiTransactionId || "N/A"}
        </p>
      ) : (
        <p>
          <strong>Payment Details:</strong> Not Applicable
        </p>
      )}

      <p>
        <strong>Status:</strong>{" "}
        <span
          className={`px-2 py-1 rounded ${
            status === "Completed"
              ? "bg-green-100 text-green-700"
              : status === "Pending"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {status}
        </span>
      </p>
    </div>
  );
};

export default TransactionCard;
