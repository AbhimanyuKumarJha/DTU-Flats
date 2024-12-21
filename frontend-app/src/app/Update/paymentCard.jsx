import { useEffect, useState } from "react";
import { FaTrash, FaCalendar, FaEye, FaCreditCard, FaMoneyBill, FaClipboard, FaCheckCircle } from "react-icons/fa";
import { useRentCalculation } from "../lib/hooks/useRentCalculation";
import {
  PAYMENT_MODES,
  TRANSACTION_STATUS,
} from "../lib/constants/formConstants";
import RentDisplay from "../lib/utils/RentDisplay";
import CustomMonthCalendar from "../New/components/CustomMonthCalendar";

const PaymentCard = ({
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
  const [fromMonth, setFromMonth] = useState(transaction.fromMonth);
  const [fromYear, setFromYear] = useState(transaction.fromYear);
  const [tillMonth, setTillMonth] = useState(transaction.tillMonth);
  const [tillYear, setTillYear] = useState(transaction.tillYear);
  const [showRentDisplay, setShowRentDisplay] = useState(false);
  const [showFromMonthCalendar, setShowFromMonthCalendar] = useState(false);
  const [showTillMonthCalendar, setShowTillMonthCalendar] = useState(false);

  const handleRentDisplay = () => {
    setShowRentDisplay(true);
  };

  const handleCloseRentDisplay = () => {
    setShowRentDisplay(false);
  };

  const handleClickOutside = (event) => {
    const calendarElement = document.getElementById("custom-month-calendar");
    if (calendarElement && !calendarElement.contains(event.target)) {
      setShowFromMonthCalendar(false);
      setShowTillMonthCalendar(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const { calculatedAmount, monthsPaid } = useRentCalculation(
    fromMonth,
    fromYear,
    tillMonth,
    tillYear,
    0,
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
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-gradient-to-br from-white via-gray-50 to-blue-50 p-8 max-w-fit rounded-2xl shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 opacity-20 rounded-full transform translate-x-16 -translate-y-16"></div>
        
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-2 text-white">
              <FaClipboard className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Transaction #{index + 1}
            </h3>
          </div>
          {!isOnly && (
            <button
              type="button"
              onClick={onRemove}
              className="text-red-500 hover:text-red-700 transform hover:scale-110 transition-transform duration-200 p-3 rounded-full hover:bg-red-50 group relative"
            >
              <FaTrash className="w-5 h-5" />
              <span className="absolute -top-8 right-0 bg-red-600 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Remove
              </span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* Date Range Selection */}
          <div className="flex flex-col relative space-y-3">
            <label className="font-semibold text-gray-700 flex items-center gap-2 text-lg">
              <FaCalendar className="text-blue-500" /> From Month
            </label>
            <div className="flex items-center gap-2">
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
                className="flex-1 p-4 border rounded-xl text-black shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white hover:bg-blue-50"
              />
              <button
                type="button"
                onClick={() => setShowFromMonthCalendar(true)}
                className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
              >
                <FaCalendar className="w-5 h-5" />
              </button>
            </div>
            {showFromMonthCalendar && (
              <div id="custom-month-calendar" className="absolute top-full mt-2 z-50">
                <CustomMonthCalendar
                  userId={userId}
                  selectedMonth={parseInt(fromMonth)}
                  selectedYear={parseInt(fromYear)}
                  onSelect={(month, year) => {
                    setFromMonth(month.toString());
                    setFromYear(year.toString());
                    setShowFromMonthCalendar(false);
                  }}
                  onClose={() => setShowFromMonthCalendar(false)}
                />
              </div>
            )}
          </div>

          <div className="flex flex-col relative space-y-3">
            <label className="font-semibold text-gray-700 flex items-center gap-2 text-lg">
              <FaCalendar className="text-blue-500" /> Till Month
            </label>
            <div className="flex items-center gap-2">
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
                className="flex-1 p-4 border text-black rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white hover:bg-blue-50"
              />
              <button
                type="button"
                onClick={() => setShowTillMonthCalendar(true)}
                className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
              >
                <FaCalendar className="w-5 h-5" />
              </button>
            </div>
            {showTillMonthCalendar && (
              <div id="custom-month-calendar" className="absolute top-full mt-2 z-50">
                <CustomMonthCalendar
                  userId={userId}
                  selectedMonth={parseInt(tillMonth)}
                  selectedYear={parseInt(tillYear)}
                  onSelect={(month, year) => {
                    setTillMonth(month.toString());
                    setTillYear(year.toString());
                    setShowTillMonthCalendar(false);
                  }}
                  onClose={() => setShowTillMonthCalendar(false)}
                />
              </div>
            )}
          </div>

          {/* Calculated Amount Display */}
          <div className="flex flex-col space-y-3">
            <label className="font-semibold text-gray-700 flex items-center gap-2 text-lg">
              <FaMoneyBill className="text-green-500" /> Total Amount
            </label>
            <div className="p-4 border rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 flex justify-between items-center shadow-sm hover:shadow-md transition-all duration-200 group">
              <span className="text-xl font-bold text-green-700">₹{calculatedAmount.toLocaleString()}</span>
              <button
                onClick={handleRentDisplay}
                className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors duration-200 bg-white/50 py-2 px-4 rounded-lg group-hover:bg-white"
              >
                <FaEye className="w-5 h-5" /> View Details
              </button>
            </div>
            {showRentDisplay && (
              <RentDisplay
                fromMonth={fromMonth}
                fromYear={fromYear}
                tillMonth={tillMonth}
                tillYear={tillYear}
                onClose={handleCloseRentDisplay}
                isFloorDiscount={isFloorDiscount}
              />
            )}
          </div>

          {/* Payment Mode Selection */}
          <div className="flex flex-col space-y-3">
            <label className="font-semibold text-gray-700 flex items-center gap-2 text-lg">
              <FaCreditCard className="text-indigo-500" /> Payment Mode
            </label>
            <select
              value={transaction.paymentMode}
              onChange={(e) => handlePaymentModeChange(e.target.value)}
              className="p-4 border text-black rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 cursor-pointer hover:bg-indigo-50 bg-white shadow-sm"
            >
              {Object.values(PAYMENT_MODES).map((modeOption) => (
                <option key={modeOption} value={modeOption} className="py-2">
                  {modeOption}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Status */}
          <div className="flex flex-col space-y-3 md:col-span-2">
            <label className="font-semibold text-gray-700 flex items-center gap-2 text-lg">
              <FaCheckCircle className="text-blue-500" /> Payment Status
            </label>
            <select
              value={transaction.status}
              onChange={(e) =>
                onUpdate({
                  ...transaction,
                  status: e.target.value,
                })
              }
              className={`p-4 border rounded-xl transition-all duration-300 cursor-pointer text-lg font-semibold ${
                transaction.status === TRANSACTION_STATUS.COMPLETED
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600"
                  : transaction.status === TRANSACTION_STATUS.PENDING
                  ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600"
                  : "bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600"
              }`}
            >
              {Object.values(TRANSACTION_STATUS).map((statusOption) => (
                <option key={statusOption} value={statusOption} className="bg-white text-gray-700">
                  {statusOption}
                </option>
              ))}
            </select>
          </div>

          {/* Conditional Payment Details */}
          {transaction.paymentMode === PAYMENT_MODES.UPI && (
            <div className="flex flex-col space-y-3 md:col-span-2">
              <label className="font-semibold text-gray-700 flex items-center gap-2 text-lg">
                <FaClipboard className="text-blue-500" /> UPI Transaction ID
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
                className="p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white hover:bg-blue-50"
                placeholder="Enter UPI Transaction ID"
              />
            </div>
          )}

          {(transaction.paymentMode === PAYMENT_MODES.DD ||
            transaction.paymentMode === PAYMENT_MODES.CHEQUE) && (
            <div className="flex flex-col space-y-3 md:col-span-2">
              <label className="font-semibold text-gray-700 flex items-center gap-2 text-lg">
                <FaClipboard className="text-blue-500" /> {transaction.paymentMode} Number
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
                className="p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white hover:bg-blue-50"
                placeholder={`Enter ${transaction.paymentMode} Number`}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentCard;