import React, { useEffect, useState, useMemo } from "react";
import api from "../services/api"; // Import API to fetch rent rates
import { generateMonthsPaidArray } from "./dateUtils"; // Import utility to generate months

const RentDisplay = ({
  fromMonth,
  fromYear,
  tillMonth,
  tillYear,
  onClose,
  isFloorDiscount,
}) => {
  const baseMonthlyCharge = 1000;
  const [rentRates, setRentRates] = useState([]);
  const [monthlyCalculations, setMonthlyCalculations] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [floorDiscount, setFloorDiscount] = useState(0);
  const [yearDiscount, setYearDiscount] = useState(0);

  // Fetch Rent Rates
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

  // Calculate Rent based on Rent Rates and Date Range
  useEffect(() => {
    if (rentRates.length > 0) {
      calculateRent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rentRates, fromMonth, fromYear, tillMonth, tillYear]);

  // Fetch Discounts and Apply Conditions
  useEffect(() => {
    const fetchDiscount = async () => {
      try {
        const data = await api.getDiscount();
        if (data && data.length > 0) {
          if (isFloorDiscount) {
            setFloorDiscount(data[0].onFloor);
          }
          if (
            tillYear - fromYear > 1 ||
            (tillYear - fromYear === 1 && tillMonth - fromMonth >= -1) ||
            (tillYear - fromYear === 0 && tillMonth - fromMonth >= 11)
          ) {
            setYearDiscount(data[0].onYear);
          }
        }
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchDiscount();
  }, []);

  // Apply Discount Conditions
  useEffect(() => {
    if (!isFloorDiscount) {
      setFloorDiscount(0);
    }

    const yearDifference = tillYear - fromYear;
    const monthDifference = tillMonth - fromMonth;

    if (
      !(yearDifference > 1) &&
      !(yearDifference === 1 && monthDifference >= -1) &&
      !(yearDifference === 0 && monthDifference >= 11)
    ) {
      setYearDiscount(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFloorDiscount, tillMonth, tillYear, fromMonth, fromYear]);

  // Calculate Rent Amounts
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

  // Calculate Discount Amounts and Grand Total using useMemo
  const floorDiscountAmount = useMemo(() => {
    return totalAmount * (floorDiscount / 100);
  }, [totalAmount, floorDiscount]);

  const yearDiscountAmount = useMemo(() => {
    return totalAmount * (yearDiscount / 100);
  }, [totalAmount, yearDiscount]);

  const grandTotal = useMemo(() => {
    return totalAmount - floorDiscountAmount - yearDiscountAmount;
  }, [totalAmount, floorDiscountAmount, yearDiscountAmount]);

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
      <div className="flex justify-between text-black">
        
        <span>Floor Discount: {floorDiscount ? floorDiscount : 0}%</span>
        <span>₹{floorDiscountAmount.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-black">
        <span>Year Discount: {yearDiscount ? yearDiscount : 0}%</span>
        <span>₹{yearDiscountAmount.toFixed(2)}</span>
      </div>

      <div className="mt-2">________________</div>
      <div className="flex justify-between font-bold text-black">
        <span>Grand Total:</span>
        <span>₹{grandTotal.toFixed(2)}</span>
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
