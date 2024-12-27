"use client";
import { useState } from "react";
import UserDetailsSection from "./components/UserDetailsSection.jsx";
import api from "../lib/services/api.js";
import { userSchema } from "../lib/validations/formSchemas.js";

const Form = ({
  data,
  mode ,
  updatelist = () => {},
  closeModal = () => {},
  triggerPopup = () => {},
}) => {
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // Success popup
  const [loading, setLoading] = useState(false); // Loading state
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
    email: data?.email || "",
    alternateEmail: data?.alternateEmail || "",
  });
  const [errors, setErrors] = useState({});

  const scrollToTop = () => {
    const formContainer = document.querySelector('.form-container');
    if (formContainer) {
      formContainer.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  const handleUserSubmit = async (userData) => {
    if (loading) return; // Prevent duplicate submissions
    setLoading(true);
    scrollToTop(); // Scroll to top on submit

    // Check if email is provided
    if (!userData.email) {
        setErrors({ email: "Email is required" });
        setLoading(false);
        return; // Prevent submission if email is missing
    }

    try {
      const processedData = {
        ...userData,
        email: userData.email,
        alternateEmail: userData.alternateEmail || undefined,
      };

      console.log("Processed Data:", processedData); // Log the processed data

      const validatedData = userSchema.parse(processedData);
      // validatedData = {
      //   ...validatedData,
      //   email: userData.email,
      //   alternateEmail: userData.alternateEmail || undefined,
      // }
      console.log("validated Data:", validatedData );

      if (mode === "edit" && data?.id) {
        await api.updateUser(data.id, validatedData);
      } else {
        await api.createUser(validatedData);
      }

      // Show success popup
      setShowSuccessPopup(true);

      // Reset form and refresh list after delay
      setTimeout(() => {
        setShowSuccessPopup(false); // Hide popup
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
          email: "",
          alternateEmail: "",
        });
        setErrors({});
        scrollToTop(); // Ensure scroll bar moves up
        closeModal();
        updatelist();
        triggerPopup();
      }, 2000);
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
      } else {
        console.error("Error creating/updating user:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-3/5 max-w-3xl h-[80vh] mt-6 backdrop-blur-md transition-all transform overflow-y-auto scrollbar-hide bg-white bg-opacity-60 shadow-lg rounded-lg p-6 mx-auto relative form-container"
    >
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-700 bg-opacity-60 flex items-center justify-center z-50">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
          <p className="text-white text-xl mt-4 absolute top-3/4">Submitting...</p>
        </div>
      )}

      {/* User Details Section */}
      <UserDetailsSection
        formData={{
          ...formData,
          email: formData.email,
          alternateEmail: formData.alternateEmail,
        }}
        setFormData={setFormData}
        onSubmit={handleUserSubmit}
        errors={errors}
        setErrors={setErrors}
        mode={mode}
        loading={loading}
      />

      {/* Success Popup */}
      {showSuccessPopup && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-green-500 bg-opacity-95 flex items-center justify-center text-white text-2xl font-bold z-50 animate-fadeIn"
        >
           {mode === "edit" ? "User Details Updated Successfully" : "User Details Added Successfully"}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Form;
