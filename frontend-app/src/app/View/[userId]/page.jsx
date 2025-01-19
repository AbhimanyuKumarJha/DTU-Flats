"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ViewBox from "../viewBox";
import PopUp from "../../utils/popup";
import api from "../../lib/services/api";
import { generateAndDownloadPDF } from "../../lib/utils/pdfGenerator";
const UserDetailPage = () => {
  const params = useParams();
  const userId = params.userId;

  // console.log("Navigated to UserDetailPage with userId:", userId);

  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);

  // Popup State
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const fetchUserData = async () => {
    try {
      const [userData, userTransactions, rentRates, discountData] =
        await Promise.all([
          api.getUserById(userId),
          api.getTransactionsByUserId(userId),
          api.getRentRates(),
          api.getDiscount(),
        ]);

      setUser(userData);

      // Add rentRates and discounts to each transaction
      const transactionsWithDetails = userTransactions.map((tx) => ({
        ...tx,
        rentRates,
        floorDiscount: discountData[0]?.onFloor || 0,
        yearDiscount: discountData[0]?.onYear || 0,
      }));

      setTransactions(transactionsWithDetails);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Failed to load user data.");
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const calculateRentDetails = (transaction) => {
    const baseMonthlyCharge = 1000;
    const rentRates = transaction.rentRates || [];
    const floorDiscount = transaction.floorDiscount || 0;
    const yearDiscount = transaction.yearDiscount || 0;

    const months = transaction.monthsPaid;
    let total = 0;
    const monthlyCalculations = months.map(({ month, year }) => {
      const date = new Date(year, month - 1);
      const applicableRate = rentRates.find(
        (rate) => new Date(rate.effectiveDate) <= date
      );
      const amount = applicableRate ? applicableRate.amount : baseMonthlyCharge;
      total += amount;
      return { month, year, amount };
    });

    const floorDiscountAmount = total * (floorDiscount / 100);
    const yearDiscountAmount = total * (yearDiscount / 100);
    const grandTotal = total - floorDiscountAmount - yearDiscountAmount;

    return {
      monthlyCalculations,
      totalAmount: total,
      floorDiscount,
      yearDiscount,
      floorDiscountAmount,
      yearDiscountAmount,
      grandTotal,
    };
  };

  const handleDownload = async (transaction) => {
    try {
      // Fetch user data using the userId from the transaction
      const userData = await api.getUserById(transaction.userId._id);
      // console.log("handledownload userdata",userData);
      const rentDetails = calculateRentDetails(transaction);
      const transactionWithRentDetails = { ...transaction, rentDetails, userData }; // Include user data
      await generateAndDownloadPDF(transactionWithRentDetails);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  if (!user) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl text-black font-extrabold mb-6 text-center">
        User Details
      </h1>
      <ViewBox
        user={user}
        transactions={transactions}
        onDownload={handleDownload}
      />
      {/* Popup Notification */}
      {showPopup && <PopUp message={popupMessage} />}
    </div>
  );
};

export default UserDetailPage;
