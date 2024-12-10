import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useRentCalculation } from "../lib/hooks/useRentCalculation";
import {
  PAYMENT_MODES,
  TRANSACTION_STATUS,
} from "../lib/constants/formConstants";
import RentDisplay from "../lib/utils/RentDisplay";
const PaymentCard = ({
  transaction,
  index,
  isFirst,
  onUpdate,
  onRemove,
  isOnly,
  mode,
  isFloorDiscount,
}) => {
  const [fromMonth, setFromMonth] = useState(transaction.fromMonth);
  const [fromYear, setFromYear] = useState(transaction.fromYear);
  const [tillMonth, setTillMonth] = useState(transaction.tillMonth);
  const [tillYear, setTillYear] = useState(transaction.tillYear);
  const [showRentDisplay, setShowRentDisplay] = useState(false);
  const handleRentDisplay = () => {
    setShowRentDisplay(true);
  };

  const handleCloseRentDisplay = () => {
    setShowRentDisplay(false);
  };

  const { calculatedAmount, monthsPaid } = useRentCalculation(
    fromMonth,
    fromYear,
    tillMonth,
    tillYear,
    1000,
    isFloorDiscount
  );

  useEffect(() => {
    onUpdate({
      ...transaction,
      fromMonth,
      fromYear,
      tillMonth,
      tillYear,
      calculatedAmount,
      monthsPaid,
    });
  }, [fromMonth, fromYear, tillMonth, tillYear, calculatedAmount, monthsPaid]);

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
        <div className="flex flex-col">
          <label className="font-medium text-gray-700">From Month</label>
          <input
            type="month"
            value={
              fromYear && fromMonth
                ? `${fromYear}-${String(fromMonth).padStart(2, "0")}`
                : ""
            }
            onChange={(e) => {
              const [year, month] = e.target.value.split("-");
              setFromYear(year);
              setFromMonth(month);
            }}
            className={`mt-1 p-2 border rounded-md ${
              mode === "edit" && index < existingTransactions.length
                ? "bg-gray-100"
                : ""
            }`}
          />
        </div>

        <div className="flex flex-col">
          <label className="font-medium text-gray-700">Till Month</label>
          <input
            type="month"
            value={
              tillYear && tillMonth
                ? `${tillYear}-${String(tillMonth).padStart(2, "0")}`
                : ""
            }
            onChange={(e) => {
              const [year, month] = e.target.value.split("-");
              setTillYear(year);
              setTillMonth(month);
            }}
            className="mt-1 p-2 border rounded-md"
          />
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
              fromMonth={fromMonth}
              fromYear={fromYear}
              tillMonth={tillMonth}
              tillYear={tillYear}
              onClose={handleCloseRentDisplay}
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

export default PaymentCard;
