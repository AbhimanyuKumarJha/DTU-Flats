import { useState, useEffect } from "react";
import api from "../services/api";
import { generateMonthsPaidArray } from "../utils/dateUtils";

export const useRentCalculation = (
  fromMonth,
  fromYear,
  tillMonth,
  tillYear,
  baseMonthlyCharge
) => {
  const [rentRates, setRentRates] = useState([]);
  const [calculatedAmount, setCalculatedAmount] = useState(0);
  const [monthsPaid, setMonthsPaid] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRentRates();
  }, []);

  useEffect(() => {
    if (rentRates.length > 0) {
      calculateRent();
    }
  }, [fromMonth, fromYear, tillMonth, tillYear, rentRates]);

  const fetchRentRates = async () => {
    try {
      setIsLoading(true);
      const rates = await api.getRentRates();
      setRentRates(
        rates.sort(
          (a, b) => new Date(b.effectiveDate) - new Date(a.effectiveDate)
        )
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateRent = () => {
    let total = 0;
    const months = generateMonthsPaidArray(
      fromMonth,
      fromYear,
      tillMonth,
      tillYear
    );

    months.forEach(({ month, year }) => {
      const date = new Date(year, month - 1);
      const applicableRate = rentRates.find(
        (rate) => new Date(rate.effectiveDate) <= date
      );

      total += applicableRate ? applicableRate.amount : baseMonthlyCharge;
    });

    setCalculatedAmount(total);
    setMonthsPaid(months);
  };

  return {
    calculatedAmount,
    monthsPaid,
    isLoading,
    error,
  };
};

export default useRentCalculation;
