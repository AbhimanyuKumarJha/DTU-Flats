import React, { useEffect, useState } from "react";
import api from "../services/api"; // Import API to fetch rent rates
import { generateMonthsPaidArray } from "./dateUtils"; // Import utility to generate months

const RentDisplay = ({ fromMonth, fromYear, tillMonth, tillYear, onClose }) => {
  const baseMonthlyCharge = 1000;
  const [rentRates, setRentRates] = useState([]);
  const [monthlyCalculations, setMonthlyCalculations] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const fetchRentRates = async () => {
      try {
        const rates = await api.getRentRates();
        setRentRates(
          rates.sort(
            (a, b) => new Date(b.effectiveDate) - new Date(a.effectiveDate)
          )
        );
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchRentRates();
  }, []);

  useEffect(() => {
    if (rentRates.length > 0) {
      calculateRent();
    }
  }, [rentRates, fromMonth, fromYear, tillMonth, tillYear]);

  const calculateRent = () => {
    const months = generateMonthsPaidArray(
      fromMonth,
      fromYear,
      tillMonth,
      tillYear
    );
    let total = 0;
    const calculations = months.map(({ month, year }) => {
      const date = new Date(year, month - 1);
      const applicableRate = rentRates.find(
        (rate) => new Date(rate.effectiveDate) <= date
      );
      const amount = applicableRate ? applicableRate.amount : baseMonthlyCharge;
      total += amount;
      return { month, year, amount };
    });

    setMonthlyCalculations(calculations);
    setTotalAmount(total);
  };

  return (
    <div className="bg-white p-4 rounded shadow-lg max-w-md w-full mt-2 text-black">
      <h2 className="text-lg font-bold mb-2">Rent Calculations</h2>
      {monthlyCalculations.map(({ month, year, amount }) => (
        <div key={`${month}-${year}`} className="flex justify-between">
          <span>
            {new Intl.DateTimeFormat("en-US", { month: "long" }).format(
              new Date(year, month - 1)
            )}{" "}
            {year}:
          </span>
          <span className="text-black font-semibold">₹{amount}</span>
        </div>
      ))}
      <div className="mt-2">________________</div>
      <div className="flex justify-between font-bold">
        <span>Total:</span>
        <span>₹{totalAmount.toFixed(2)}</span>
      </div>
      <button
        onClick={onClose}
        className="mt-4 bg-red-500 text-white px-2 rounded"
      >
        Close
      </button>
    </div>
  );
};

export default RentDisplay;
