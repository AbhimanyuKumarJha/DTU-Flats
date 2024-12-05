"use client";
import { useState } from "react";
import UserDetailsSection from "./components/UserDetailsSection.jsx";
import TransactionForm from "./components/TransactionForm.jsx";
import { api } from "../lib/services/api.js";
import { userSchema } from "../lib/validations/formSchemas.js";
import PopUp from "../utils/popup.jsx";

const Form = () => {
  const [step, setStep] = useState("user");
  const [userId, setUserId] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    user: {
      name: "",
      dateOfBirth: "",
      gender: "",
      address: "",
      floorNumber: [],
      mobileNumber: "",
      alternateMobileNumber: "",
      isActive: false,
      certificateIssued: "",
    },
  });

  const handleUserSubmit = async () => {
    try {
      const validatedData = userSchema.parse(formData.user);
      const user = await api.createUser(validatedData);
      setUserId(user._id);
      setStep("transaction");
    } catch (error) {
      console.error("Error creating user:", error);
      // Handle validation errors
    }
  };

  const handleTransactionSubmit = async (transactionData) => {
    try {
      await api.createTransaction({
        ...transactionData,
        userId,
      });
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        // Reset form
        setStep("user");
        setUserId(null);
        setFormData({
          user: {
            name: "",
            dateOfBirth: "",
            gender: "",
            address: "",
            floorNumber: [],
            mobileNumber: "",
            alternateMobileNumber: "",
            isActive: false,
            certificateIssued: "",
          },
        });
      }, 3000);
    } catch (error) {
      console.error("Error creating transaction:", error);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      {step === "user" ? (
        <UserDetailsSection
          formData={formData.user}
          setFormData={(userData) =>
            setFormData((prev) => ({ ...prev, user: userData }))
          }
          onSubmit={handleUserSubmit}
        />
      ) : (
        <TransactionForm userId={userId} onSubmit={handleTransactionSubmit} />
      )}
      {showSuccess && <PopUp />}
    </div>
  );
};

export default Form;
