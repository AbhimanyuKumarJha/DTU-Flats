"use client";
import { useState, useEffect } from "react";
import UserDetailsSection from "./components/UserDetailsSection.jsx";
import TransactionForm from "./components/TransactionForm.jsx";
import api from "../lib/services/api.js";
import { userSchema } from "../lib/validations/formSchemas.js";
import PopUp from "../utils/popup.jsx";

const Form = ({
  data,
  mode = "create",
  updatelist,
  onChange,
  closeModal,
  triggerPopup,
}) => {
  const [step, setStep] = useState("user");
  const [userId, setUserId] = useState(data ? data.id : null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: data?.name || "",
    dateOfBirth: data?.dateOfBirth || "",
    gender: data?.gender || "",
    address: data?.address || "",
    floorNumber: data?.floorNumber || [],
    mobileNumber: data?.mobileNumber || "",
    alternateMobileNumber: data?.alternateMobileNumber || "",
    isActive: data?.isActive || false,
    certificateIssued: data?.certificateIssued || "",
  });
  const [errors, setErrors] = useState({});

  const handleUserSubmit = async (userData) => {
    try {
      const processedData = {
        ...userData,
        alternateMobileNumber: userData.alternateMobileNumber || undefined,
      };

      const validatedData = userSchema.parse(processedData);

      let user;
      if (mode === "edit" && userId) {
        // Update existing user
        user = await api.updateUser(userId, validatedData);
      } else {
        // Create new user
        user = await api.createUser(validatedData);
      }

      if (mode === "create") {
        setUserId(user._id);
        setStep("transaction");
      } else {
        // For edit mode, refresh the list and close the modal
        updatelist();
        closeModal();
        triggerPopup(); // Show success popup
      }
    } catch (error) {
      if (error.name === "ZodError") {
        const newErrors = {};
        error.errors.forEach((err) => {
          let message = err.message;
          switch (err.code) {
            case "invalid_type":
              if (err.received === "undefined") {
                message = `${
                  err.path[0].charAt(0).toUpperCase() + err.path[0].slice(1)
                } is required`;
              }
              break;
            case "invalid_string":
              if (err.validation === "regex") {
                message = "Please enter a valid format";
              }
              break;
          }
          newErrors[err.path[0]] = message;
        });
        setErrors(newErrors);

        // Scroll to the first error
        const firstErrorField = document.querySelector(".text-red-500");
        if (firstErrorField) {
          firstErrorField.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      } else {
        console.error("Error creating/updating user:", error);
      }
    }
  };

  const handleTransactionSubmit = async (transactionData) => {
    try {
      // Submit all transactions
      await api.createTransactions(userId, transactionData.transactions);

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setStep("user");
        setUserId(null);
        setFormData({
          name: "",
          dateOfBirth: "",
          gender: "",
          address: "",
          floorNumber: [],
          mobileNumber: "",
          alternateMobileNumber: "",
          isActive: false,
          certificateIssued: "",
        });
        if (mode === "create") {
          updatelist(); // Refresh the list after creating
        }
      }, 3000);
    } catch (error) {
      console.error("Error creating transaction:", error);
      alert("Error submitting transactions. Please try again.");
    }
  };

  return (
    <div className="w-3/5 max-w-3xl max-h-screen backdrop-blur-md transition-all transform hover:shadow-2xl overflow-y-auto scrollbar-hide bg-white bg-opacity-60 shadow-lg rounded-lg p-6 mx-auto">
      {step === "user" ? (
        <UserDetailsSection
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleUserSubmit}
          errors={errors}
          setErrors={setErrors}
        />
      ) : (
        <TransactionForm userId={userId} onSubmit={handleTransactionSubmit} />
      )}
      {showSuccess && <PopUp />}
    </div>
  );
};

export default Form;
