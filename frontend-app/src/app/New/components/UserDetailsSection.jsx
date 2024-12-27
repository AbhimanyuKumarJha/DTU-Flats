"use client";
import { useState } from "react";
import {
  GENDER_OPTIONS,
  FLOOR_OPTIONS,
  CERTIFICATE_OPTIONS,
} from "../../lib/constants/formConstants";
import {
  FaUser,
  FaCalendarAlt,
  FaHome,
  FaFileAlt,
  FaPhoneAlt,
  FaRupeeSign,
  FaEnvelope,
} from "react-icons/fa";
import { useRouter } from "next/router";
  
const UserDetailsSection = ({
  formData,
  setFormData,
  onSubmit,
  errors,
  setErrors,
  mode
}) => {
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevUser) => ({
      ...prevUser,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleFloorSelection = (value) => {
    setFormData((prevUser) => {
      const currentFloors = prevUser.floorNumber || [];

      const updatedFloors = currentFloors.includes(value)
        ? currentFloors.filter((floor) => floor !== value)
        : currentFloors.length < 5
        ? [...currentFloors, value]
        : currentFloors;

      return {
        ...prevUser,
        floorNumber: updatedFloors,
      };
    });

    setErrors((prev) => ({ ...prev, floorNumber: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ensure isActive is set to false if not already set
    const completeFormData = {
      ...formData,
      isActive: formData.isActive || false,
    };
    onSubmit(completeFormData);
  };
  // const router = useRouter(); // Move inside the component
  // const route_name = router.pathname.includes("edit") ? "edit" : "create"; // Determine mode based on route
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Form fields */}
      <div className="w-full p-10 rounded-lg space-y-4">
        <div className="flex justify-center mb-1">
          <img
            src="/DTU,_Delhi_official_logo.png"
            alt="Logo"
            className="h-20"
          />
        </div>
        <h2 className="text-4xl font-bold text-center text-gray-800">
            {mode === "edit" ? "Edit Details" : "Add Details"}
        </h2>

        {/* Name Field */}
        <div className="flex flex-col">
          <label className="font-semibold text-black">Name</label>
          <div className="relative">
            <FaUser className="absolute top-3 left-2 text-gray-500" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full p-2 pl-8 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:border-blue-500 hover:ring-2 hover:ring-blue-300"
            />
            {errors.name && (
              <span className="text-red-500 text-sm">{errors.name}</span>
            )}
          </div>
        </div>

        {/* Date of Birth Field */}
        <div className="flex flex-col">
          <label className="font-semibold text-black">Date of Birth:</label>
          <div className="relative">
            <FaCalendarAlt className="absolute top-3 left-2 text-gray-500" />
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className={`w-full p-2 pl-8 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:border-blue-500 hover:ring-2 hover:ring-blue-300 ${
                errors.dateOfBirth ? "border-red-500" : ""
              }`}
            />
          </div>
          {errors.dateOfBirth && (
            <span className="text-red-500 text-sm mt-1">
              {errors.dateOfBirth}
            </span>
          )}
        </div>

        {/* Gender Field */}
        <div className="flex flex-col">
          <label className="font-semibold text-black">Gender:</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className={`w-full p-2 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:border-blue-500 hover:ring-2 hover:ring-blue-300 ${
              errors.gender ? "border-red-500" : ""
            }`}
          >
            <option value="">Select</option>
            {GENDER_OPTIONS.map((gender) => (
              <option key={gender} value={gender}>
                {gender}
              </option>
            ))}
          </select>
          {errors.gender && (
            <span className="text-red-500 text-sm mt-1">{errors.gender}</span>
          )}
        </div>

        {/* Address Field */}
        <div className="flex flex-col">
          <label className="font-semibold text-black">Address:</label>
          <div className="relative">
            <FaHome className="absolute top-3 left-2 text-gray-500" />
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your address"
              className={`w-full p-2 pl-8 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:border-blue-500 hover:ring-2 hover:ring-blue-300 ${
                errors.address ? "border-red-500" : ""
              }`}
            />
          </div>
          {errors.address && (
            <span className="text-red-500 text-sm mt-1">{errors.address}</span>
          )}
        </div>

        {/* Mobile Number Field */}
        <div className="flex flex-col">
          <label className="font-semibold text-black">Mobile Number:</label>
          <div className="relative">
            <FaPhoneAlt className="absolute top-3 left-2 text-gray-500" />
            <input
              type="tel"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              placeholder="Enter mobile number"
              className={`w-full p-2 pl-8 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:border-blue-500 hover:ring-2 hover:ring-blue-300 ${
                errors.mobileNumber ? "border-red-500" : ""
              }`}
            />
          </div>
          {errors.mobileNumber && (
            <span className="text-red-500 text-sm mt-1">
              {errors.mobileNumber}
            </span>
          )}
        </div>

        {/* Alternate Mobile Number Field */}
        <div className="flex flex-col">
          <label className="font-semibold text-black">
            Alternate Mobile Number{" "}
            <span className="text-gray-500">(Optional)</span>:
          </label>
          <div className="relative">
            <FaPhoneAlt className="absolute top-3 left-2 text-gray-500" />
            <input
              type="tel"
              name="alternateMobileNumber"
              value={formData.alternateMobileNumber}
              onChange={handleChange}
              placeholder="Enter alternate mobile number"
              className={`w-full p-2 pl-8 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:border-blue-500 hover:ring-2 hover:ring-blue-300 ${
                errors.alternateMobileNumber ? "border-red-500" : ""
              }`}
            />
          </div>
          <span className="text-gray-500 text-sm mt-1">
            Leave blank if you don't want to provide an alternate number.
          </span>
          {errors.alternateMobileNumber && (
            <span className="text-red-500 text-sm mt-1">
              {errors.alternateMobileNumber}
            </span>
          )}
        </div>

        {/* Floor Number Multi-Select */}
        <div className="flex flex-col">
          <label className="font-semibold text-black">Floor Number:</label>
          <div className="flex space-x-4 mt-2">
            {FLOOR_OPTIONS.map((floor) => (
              <label key={floor} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={
                    formData.floorNumber
                      ? formData.floorNumber.includes(floor)
                      : false
                  }
                  onChange={() => handleFloorSelection(floor)}
                  className="form-checkbox h-4 w-4 text-blue-600 transition-all"
                />
                <span className="text-black">{floor}</span>
              </label>
            ))}
          </div>
          {errors.floorNumber && (
            <span className="text-red-500 text-sm mt-1">
              {errors.floorNumber}
            </span>
          )}
          {formData.floorNumber && formData.floorNumber.length >= 5 && (
            <span className="text-yellow-600 text-sm mt-1">
              Maximum 5 floors can be selected
            </span>
          )}
        </div>

        {/* Certificate Issued Field */}
        <div className="flex flex-col">
          <label className="font-semibold text-black">
            Certificate Issued:
          </label>
          <select
            name="certificateIssued"
            value={formData.certificateIssued}
            onChange={handleChange}
            className={`w-full p-2 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:border-blue-500 hover:ring-2 hover:ring-blue-300 ${
              errors.certificateIssued ? "border-red-500" : ""
            }`}
          >
            <option value="">Select</option>
            {CERTIFICATE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.certificateIssued && (
            <span className="text-red-500 text-sm mt-1">
              {errors.certificateIssued}
            </span>
          )}
        </div>

        {/* Active Status Toggle */}
        <div className="flex items-center">
          <label className="font-semibold text-black mr-2">User Status:</label>
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive || false}
              onChange={handleChange}
              className="sr-only"
            />
            <div
              className={`w-10 h-6 rounded-full p-1 transition-all ${
                formData.isActive ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-all ${
                  formData.isActive ? "translate-x-4" : "translate-x-0"
                }`}
              ></div>
            </div>
            <span className="ml-2 text-black">
              {formData.isActive ? "Active" : "Non-Active"}
            </span>
          </label>
        </div>

        {/* Email Field */}
        <div className="flex flex-col">
          <label className="font-semibold text-black">Email:</label>
          <div className="relative">
            <FaEnvelope className="absolute top-3 left-2 text-gray-500" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={`w-full p-2 pl-8 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:border-blue-500 hover:ring-2 hover:ring-blue-300 ${
                errors.email ? "border-red-500" : ""
              }`}
            />
          </div>
          {errors.email && (
            <span className="text-red-500 text-sm mt-1">{errors.email}</span>
          )}
        </div>

        {/* Alternate Email Field */}
        <div className="flex flex-col">
          <label className="font-semibold text-black">
            Alternate Email <span className="text-gray-500">(Optional)</span>:
          </label>
          <div className="relative">
            <FaEnvelope className="absolute top-3 left-2 text-gray-500" />
            <input
              type="email"
              name="alternateEmail"
              value={formData.alternateEmail}
              onChange={handleChange}
              placeholder="Enter alternate email"
              className={`w-full p-2 pl-8 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:border-blue-500 hover:ring-2 hover:ring-blue-300 ${
                errors.alternateEmail ? "border-red-500" : ""
              }`}
            />
          </div>
          <span className="text-gray-500 text-sm mt-1">
            Leave blank if you don't want to provide an alternate email.
          </span>
          {errors.alternateEmail && (
            <span className="text-red-500 text-sm mt-1">
              {errors.alternateEmail}
            </span>
          )}
        </div>

        <button
          type="submit"
          className="col-span-2 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
            Submit
        </button>
      </div>
    </form>
  );
};

export default UserDetailsSection;
