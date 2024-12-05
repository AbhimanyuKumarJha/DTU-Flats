"use client";
import { useState } from "react";
import {
  GENDER_OPTIONS,
  FLOOR_OPTIONS,
  CERTIFICATE_OPTIONS,
} from "../../lib/constants/formConstants";

const UserDetailsSection = ({ formData, setFormData, onSubmit }) => {
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error for the field
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleFloorSelection = (value) => {
    setFormData((prev) => ({
      ...prev,
      floorNumber: prev.floorNumber.includes(value)
        ? prev.floorNumber.filter((floor) => floor !== value)
        : [...prev.floorNumber, value],
    }));
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-6"
    >
      {/* Form fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name Field */}
        <div className="flex flex-col">
          <label className="font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 p-2 border rounded-md"
          />
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name}</span>
          )}
        </div>

        {/* Add other fields similarly */}
        {/* ... */}

        <button
          type="submit"
          className="col-span-2 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Next
        </button>
      </div>
    </form>
  );
};

export default UserDetailsSection;
