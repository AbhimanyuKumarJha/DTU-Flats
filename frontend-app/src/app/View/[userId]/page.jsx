"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ViewBox from "../viewBox";
import PopUp from "../../utils/popup";
import api from "../../lib/services/api";

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
      // console.log("Fetching user data for userId:", userId);
      const userData = await api.getUserById(userId);
      // console.log("Fetched user data:", userData);
      setUser(userData);

      const userTransactions = await api.getTransactionsByUserId(userId);
      // console.log("Fetched transactions:", userTransactions);
      setTransactions(userTransactions);
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

  const handleDownload = (transaction) => {
    // Implement actual download logic here (e.g., generate PDF)
    // For demonstration, we'll show a popup notification
    setPopupMessage(
      `Download initiated for Transaction ID: ${transaction._id}`
    );
    setShowPopup(true);

    // Hide popup after 3 seconds
    setTimeout(() => {
      setShowPopup(false);
    }, 3000);
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
