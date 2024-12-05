"use client";
import { useState, useEffect } from "react";
import { FaMoneyBillWave } from "react-icons/fa";
import { PAYMENT_MODES } from "../../lib/constants/formConstants";
import { useRentCalculation } from "../../lib/hooks/useRentCalculation";

const TransactionForm = ({ userId, onSubmit }) => {
  const [formData, setFormData] = useState({
    fromMonth: new Date().getMonth() + 1,
    fromYear: new Date().getFullYear(),
    tillMonth: new Date().getMonth() + 1,
    tillYear: new Date().getFullYear(),
    paymentMode: PAYMENT_MODES.CASH,
    paymentDetails: {
      chequeOrDDNumber: "",
      upiTransactionId: "",
    },
    status: "Pending",
  });

  const { calculatedAmount, monthsPaid } = useRentCalculation(
    formData.fromMonth,
    formData.fromYear,
    formData.tillMonth,
    formData.tillYear,
    1000 // base monthly charge
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      calculatedAmount,
      monthsPaid,
    });
  };

  return (
    <div className="text-black bg-white rounded-md till py-3 px-5">
      <form onSubmit={handleSubmit} className="space-y-6 text-black">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Date Range Selection */}
          <div className="flex flex-col">
            <label className="font-medium text-gray-700">From Month</label>
            <input
              type="month"
              value={`${formData.fromYear}-${String(
                formData.fromMonth
              ).padStart(2, "0")}`}
              onChange={(e) => {
                const [year, month] = e.target.value.split("-");
                setFormData((prev) => ({
                  ...prev,
                  fromMonth: parseInt(month),
                  fromYear: parseInt(year),
                }));
              }}
              className="mt-1 p-2 border rounded-md"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Till Month</label>
            <input
              type="month"
              value={`${formData.tillYear}-${String(
                formData.tillMonth
              ).padStart(2, "0")}`}
              onChange={(e) => {
                const [year, month] = e.target.value.split("-");
                setFormData((prev) => ({
                  ...prev,
                  tillMonth: parseInt(month),
                  tillYear: parseInt(year),
                }));
              }}
              className="mt-1 p-2 border rounded-md"
            />
          </div>

          {/* Calculated Amount Display */}
          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Total Amount</label>
            <div className="mt-1 p-2 border rounded-md bg-gray-50">
              ₹{calculatedAmount}
            </div>
          </div>

          {/* Payment Mode Selection */}
          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Payment Mode</label>
            <select
              value={formData.paymentMode}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  paymentMode: e.target.value,
                }))
              }
              className="mt-1 p-2 border rounded-md"
            >
              {Object.values(PAYMENT_MODES).map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
          </div>

          {/* Conditional Payment Details */}
          {formData.paymentMode === PAYMENT_MODES.UPI && (
            <div className="flex flex-col">
              <label className="font-medium text-gray-700">
                UPI Transaction ID
              </label>
              <input
                type="text"
                value={formData.paymentDetails.upiTransactionId}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    paymentDetails: {
                      ...prev.paymentDetails,
                      upiTransactionId: e.target.value,
                    },
                  }))
                }
                className="mt-1 p-2 border rounded-md"
              />
            </div>
          )}

          {(formData.paymentMode === PAYMENT_MODES.DD ||
            formData.paymentMode === PAYMENT_MODES.CHEQUE) && (
            <div className="flex flex-col">
              <label className="font-medium text-gray-700">
                {formData.paymentMode} Number
              </label>
              <input
                type="text"
                value={formData.paymentDetails.chequeOrDDNumber}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    paymentDetails: {
                      ...prev.paymentDetails,
                      chequeOrDDNumber: e.target.value,
                    },
                  }))
                }
                className="mt-1 p-2 border rounded-md"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Submit Transaction
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;
