"use client";
import { useState, useEffect } from "react";
import { FaMoneyBillWave, FaPlus, FaTrash, FaCalendar } from "react-icons/fa";
import {
  PAYMENT_MODES,
  TRANSACTION_STATUS,
} from "../../lib/constants/formConstants";
import { useRentCalculation } from "../../lib/hooks/useRentCalculation";
import RentDisplay from "../../lib/utils/RentDisplay";
import CustomMonthCalendar from './CustomMonthCalendar'; 

const TransactionForm = ({
  userId,
  isFloorDiscount,
  onSubmit,
  existingTransactions = [],
  mode = "create",
}) => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (mode === "edit" && existingTransactions.length > 0) {
      // Initialize transactions with existing data
      setTransactions(existingTransactions);
    }
  }, [mode, existingTransactions]);

  const addNewTransaction = () => {
    const lastTransaction = transactions[transactions.length - 1]; // Get the last transaction
    let nextFromMonth = "";
    let nextFromYear = "";

    if (lastTransaction) {
      const lastTillDate = new Date(
        lastTransaction.tillYear,
        lastTransaction.tillMonth - 1
      );
      const nextMonthDate = new Date(
        lastTillDate.setMonth(lastTillDate.getMonth() + 1)
      );
      nextFromMonth = (nextMonthDate.getMonth() + 1).toString();
      nextFromYear = nextMonthDate.getFullYear().toString();
    }

    setTransactions((prev) => [
      {
        fromMonth: nextFromMonth, // Pre-filled based on last transaction
        fromYear: nextFromYear,
        tillMonth: (new Date().getMonth() + 1).toString(),
        tillYear: new Date().getFullYear().toString(),
        paymentMode: PAYMENT_MODES.CASH,
        paymentDetails: {
          chequeOrDDNumber: "",
          upiTransactionId: "",
        },
        status:
          PAYMENT_MODES.CASH === "Cash"
            ? TRANSACTION_STATUS.COMPLETED
            : TRANSACTION_STATUS.PENDING,
        calculatedAmount: 0,
        monthsPaid: [],
      },
      ...prev,
    ]);
  };

  const removeTransaction = (index) => {
    setTransactions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitAll = async (e) => {
    e.preventDefault();

    // Validate that all transactions have required fields
    const isValid = transactions.every((transaction) => {
      return (
        transaction.fromMonth &&
        transaction.fromYear &&
        transaction.tillMonth &&
        transaction.tillYear &&
        transaction.calculatedAmount > 0 &&
        transaction.monthsPaid &&
        transaction.monthsPaid.length > 0 &&
        transaction.paymentMode
      );
    });

    if (!isValid) {
      alert("Please fill in all required fields for all transactions");
      return;
    }

    // Format transactions for submission
    const formattedTransactions = transactions.map((transaction) => ({
      monthsPaid: transaction.monthsPaid,
      calculatedAmount: transaction.calculatedAmount,
      paymentMode: transaction.paymentMode,
      paymentDetails: {
        chequeOrDDNumber:
          transaction.paymentDetails.chequeOrDDNumber || undefined,
        upiTransactionId:
          transaction.paymentDetails.upiTransactionId || undefined,
      },
      status: transaction.status,
    }));

    // Debugging: Check the formatted transactions
    // console.log("Formatted Transactions:", formattedTransactions);

    onSubmit({ userId, transactions: formattedTransactions });
  };

  return (
    <div className="space-y-6 text-black">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Transactions</h2>
        <button
          type="button"
          onClick={addNewTransaction}
          className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          <FaPlus /> New Transaction
        </button>
      </div>

      <form onSubmit={handleSubmitAll} className="space-y-6">
        {transactions.map((transaction, index) => (
          <TransactionCard
            key={index}
            isFloorDiscount={isFloorDiscount}
            transaction={transaction}
            index={index}
            isFirst={index === transactions.length - 1}
            onUpdate={(updatedTransaction) => {
              setTransactions((prev) =>
                prev.map((t, i) => (i === index ? updatedTransaction : t))
              );
            }}
            onRemove={() => removeTransaction(index)}
            isOnly={transactions.length === 1}
            mode={mode}
            userId={userId}
          />
        ))}

        {transactions.length === 0 && (
          <p className="text-gray-500">No transactions added yet.</p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Submit All Transactions
        </button>
      </form>
    </div>
  );
};

export const TransactionCard = ({
  transaction,
  index,
  isFirst,
  onUpdate,
  onRemove,
  isOnly,
  mode,
  isFloorDiscount,
  userId,
}) => {
  const { calculatedAmount, monthsPaid } = useRentCalculation(
    transaction.fromMonth,
    transaction.fromYear,
    transaction.tillMonth,
    transaction.tillYear,
    1000,
    isFloorDiscount
  );
  const [showRentDisplay, setShowRentDisplay] = useState(false);
  const [showFromMonthCalendar, setShowFromMonthCalendar] = useState(false);
  const [showTillMonthCalendar, setShowTillMonthCalendar] = useState(false);

  const handleRentDisplay = (e) => {
    e.preventDefault();
    setShowRentDisplay(true);
  };

  const handleCloseRentDisplay = () => {
    setShowRentDisplay(false);
  };
  useEffect(() => {
    onUpdate({
      ...transaction,
      calculatedAmount,
      monthsPaid,
    });
  }, [calculatedAmount, monthsPaid]);

  const handlePaymentModeChange = (mode) => {
    let defaultStatus;
    switch (mode) {
      case PAYMENT_MODES.CASH:
        defaultStatus = TRANSACTION_STATUS.COMPLETED;
        break;
      case PAYMENT_MODES.CHEQUE:
      case PAYMENT_MODES.DD:
      case PAYMENT_MODES.UPI:
        defaultStatus = TRANSACTION_STATUS.PENDING;
        break;
      default:
        defaultStatus = TRANSACTION_STATUS.PENDING;
    }

    onUpdate({
      ...transaction,
      paymentMode: mode,
      status: defaultStatus,
      paymentDetails: {
        chequeOrDDNumber: "",
        upiTransactionId: "",
      },
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Transaction #{index + 1}</h3>
        {!isOnly && (
          <button
            type="button"
            onClick={onRemove}
            className="text-red-500 hover:text-red-700"
          >
            <FaTrash />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date Range Selection */}
        <div className="flex flex-col relative">
          <label className="font-medium text-gray-700">From Month</label>
          <div className="flex items-center">
            <input
              type="month"
              value={
                transaction.fromYear && transaction.fromMonth
                  ? `${transaction.fromYear}-${String(
                      transaction.fromMonth
                    ).padStart(2, "0")}`
                  : ""
              }
              onChange={(e) => {
                const [year, month] = e.target.value.split("-");
                onUpdate({
                  ...transaction,
                  fromMonth: month,
                  fromYear: year,
                });
              }}
              className={`mt-1 p-2 border  rounded-md flex-grow ${
                mode === "edit" && index < existingTransactions.length
                  ? "bg-gray-100"
                  : ""
              }`}
            />
            <button
              type="button"
              onClick={() => setShowFromMonthCalendar(true)}
              className="ml-2 mt-1 p-2 bg-gray-200 rounded-md"
            >
              <FaCalendar />
            </button>
          </div>
          {showFromMonthCalendar && (
            <CustomMonthCalendar
              userId={userId}
              selectedMonth={parseInt(transaction.fromMonth)}
              selectedYear={parseInt(transaction.fromYear)}
              onSelect={(month, year) => {
                onUpdate({
                  ...transaction,
                  fromMonth: month.toString(),
                  fromYear: year.toString(),
                });
              }}
              onClose={() => setShowFromMonthCalendar(false)}
            />
          )}
        </div>

        <div className="flex flex-col relative">
          <label className="font-medium text-gray-700">Till Month</label>
          <div className="flex items-center">
            <input
              type="month"
              value={
                transaction.tillYear && transaction.tillMonth
                  ? `${transaction.tillYear}-${String(
                      transaction.tillMonth
                    ).padStart(2, "0")}`
                  : ""
              }
              onChange={(e) => {
                const [year, month] = e.target.value.split("-");
                onUpdate({
                  ...transaction,
                  tillMonth: month,
                  tillYear: year,
                });
              }}
              className="mt-1 p-2 border rounded-md flex-grow"
            />
            <button
              type="button"
              onClick={() => setShowTillMonthCalendar(true)}
              className="ml-2 mt-1 p-2 bg-gray-200 rounded-md"
            >
              <FaCalendar />
            </button>
          </div>
          {showTillMonthCalendar && (
            <CustomMonthCalendar
              userId={userId}
              selectedMonth={parseInt(transaction.tillMonth)}
              selectedYear={parseInt(transaction.tillYear)}
              onSelect={(month, year) => {
                onUpdate({
                  ...transaction,
                  tillMonth: month.toString(),
                  tillYear: year.toString(),
                });
              }}
              onClose={() => setShowTillMonthCalendar(false)}
            />
          )}
        </div>

        {/* Calculated Amount Display */}
        <div className="flex flex-col">
          <label className="font-medium text-gray-700">Total Amount</label>
          <div className="mt-1 p-2 border rounded-md bg-gray-50 flex justify-between">
            <span>₹{calculatedAmount}</span>
            <button onClick={handleRentDisplay}>View </button>
          </div>
          {showRentDisplay && (
            <RentDisplay
              fromMonth={transaction.fromMonth}
              fromYear={transaction.fromYear}
              tillMonth={transaction.tillMonth}
              tillYear={transaction.tillYear}
              onClose={handleCloseRentDisplay}
              isFloorDiscount={isFloorDiscount}
            />
          )}
        </div>

        {/* Payment Mode Selection */}
        <div className="flex flex-col">
          <label className="font-medium text-gray-700">Payment Mode</label>
          <select
            value={transaction.paymentMode}
            onChange={(e) => handlePaymentModeChange(e.target.value)}
            className="mt-1 p-2 border rounded-md"
          >
            {Object.values(PAYMENT_MODES).map((modeOption) => (
              <option key={modeOption} value={modeOption}>
                {modeOption}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Status */}
        <div className="flex flex-col">
          <label className="font-medium text-gray-700">Payment Status</label>
          <select
            value={transaction.status}
            onChange={(e) =>
              onUpdate({
                ...transaction,
                status: e.target.value,
              })
            }
            className={`mt-1 p-2 border rounded-md ${
              transaction.status === TRANSACTION_STATUS.COMPLETED
                ? "bg-green-500 text-white"
                : transaction.status === TRANSACTION_STATUS.PENDING
                ? "bg-yellow-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {Object.values(TRANSACTION_STATUS).map((statusOption) => (
              <option key={statusOption} value={statusOption}>
                {statusOption}
              </option>
            ))}
          </select>
        </div>

        {/* Conditional Payment Details */}
        {transaction.paymentMode === PAYMENT_MODES.UPI && (
          <div className="flex flex-col">
            <label className="font-medium text-gray-700">
              UPI Transaction ID
            </label>
            <input
              type="text"
              value={transaction.paymentDetails.upiTransactionId}
              onChange={(e) =>
                onUpdate({
                  ...transaction,
                  paymentDetails: {
                    ...transaction.paymentDetails,
                    upiTransactionId: e.target.value,
                  },
                })
              }
              className="mt-1 p-2 border rounded-md"
            />
          </div>
        )}

        {(transaction.paymentMode === PAYMENT_MODES.DD ||
          transaction.paymentMode === PAYMENT_MODES.CHEQUE) && (
          <div className="flex flex-col">
            <label className="font-medium text-gray-700">
              {transaction.paymentMode} Number
            </label>
            <input
              type="text"
              value={transaction.paymentDetails.chequeOrDDNumber}
              onChange={(e) =>
                onUpdate({
                  ...transaction,
                  paymentDetails: {
                    ...transaction.paymentDetails,
                    chequeOrDDNumber: e.target.value,
                  },
                })
              }
              className="mt-1 p-2 border rounded-md"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionForm;
