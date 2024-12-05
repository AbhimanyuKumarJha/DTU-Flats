"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import { z } from "zod";
import {
  FaUser,
  FaCalendarAlt,
  FaHome,
  FaFileAlt,
  FaPhoneAlt,
  FaRupeeSign,
} from "react-icons/fa";
import PopUp from "../utils/popup";
import TransactionForm from "../Add/components/TransactionForm";

// Define Zod schema
const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["Male", "Female", "Other"], {
    errorMap: () => ({ message: "Please select a gender" }),
  }),
  address: z.string().min(1, "Address is required").max(500),
  floorNumber: z
    .array(z.enum(["UG", "FF", "SF", "TF", "SU"]))
    .min(1, "Please select at least one floor"),
  units: z
    .string()
    .min(1, "Number of units is required")
    .transform((val) => Number(val))
    .pipe(z.number().positive("Units must be greater than 0")),
  monthlyCharges: z
    .string()
    .min(1, "Monthly charges are required")
    .transform((val) => Number(val))
    .pipe(z.number().positive("Monthly charges must be greater than 0")),
  certificateIssued: z.enum(["Yes", "No"], {
    errorMap: () => ({ message: "Please select certificate status" }),
  }),
  mobileNumber: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number"),
  alternateMobileNumber: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number")
    .optional()
    .or(z.literal("")),
  isActive: z.boolean(),
});
const transactionSchema = z.object({
  year: z.number().min(2000).max(2100),
  month: z.number().min(1).max(12),
  dueDate: z.string().min(1, "Due date is required"),
  paymentStatus: z.enum(["due", "done", "overdue"]),
  amountDue: z
    .string()
    .min(1, "Amount is required")
    .transform((val) => Number(val))
    .pipe(z.number().positive("Amount must be greater than 0")),
  amountPaid: z
    .string()
    .transform((val) => Number(val))
    .pipe(z.number().min(0, "Amount paid cannot be negative"))
    .optional(),
  paymentDate: z.string().optional(),
});

// Combined schema for both user and transactions
const combinedSchema = z.object({
  userData: formSchema, // Your existing formSchema
  transactions: z.array(transactionSchema),
});

const Form = ({
  data,
  updatelist,
  showUpdateMessage,
  closeModal,
  triggerPopup,
}) => {
  const [formData, setFormData] = useState(
    data || {
      name: "",
      dateOfBirth: "",
      gender: "",
      address: "",
      floorNumber: [],
      units: "",
      monthlyCharges: "",
      certificateIssued: "",
      mobileNumber: "",
      alternateMobileNumber: "",
      isActive: false,
    }
  );
  const [transactions, setTransactions] = useState([]);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const id = formData.id || "";

  const trigger = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error for the field being changed
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleFloorSelection = (e) => {
    const { value } = e.target;
    setFormData((prevData) => {
      const floors = prevData.floorNumber.includes(value)
        ? prevData.floorNumber.filter((floor) => floor !== value)
        : [...prevData.floorNumber, value];
      return { ...prevData, floorNumber: floors };
    });
    // Clear floor number error when selection changes
    setErrors((prev) => ({ ...prev, floorNumber: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate form data
      const validatedUserData = formSchema.parse(formData);

      // If there are transactions, validate them
      let validatedTransactions = [];
      if (transactions.length > 0) {
        validatedTransactions = transactions.map((transaction) =>
          transactionSchema.parse(transaction)
        );
      }

      const url = id ? "/api/updateform" : "/api/submitform";
      const response = await axios.post(
        url,
        {
          userData: validatedUserData,
          transactions: validatedTransactions,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (updatelist) {
        updatelist();
        closeModal();
        triggerPopup();
      }
      console.log("Response from API:", response.data);
      trigger();
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Transform Zod errors into a more usable format
        const formattedErrors = {};
        error.errors.forEach((err) => {
          formattedErrors[err.path[0]] = err.message;
        });
        setErrors(formattedErrors);
      } else {
        console.error("Error submitting form:", error);
      }
    }

    // try {
    //   const response = await axios.post("/api/submit", {
    //     userData: formData,
    //     transactions: transactions,
    //   });

    //   console.log("Submission successful:", response.data);
    //   // Handle success (e.g., show success message, redirect, etc.)
    // } catch (error) {
    //   console.error("Error submitting form:", error);
    //   // Handle error (e.g., show error message)
    // }
  };
  return (
    <div className="flex justify-center items-center relative top-8">
      <form
        onSubmit={handleSubmit}
        className="w-3/5 max-w-3xl p-10 bg-white bg-opacity-60 shadow-lg rounded-lg space-y-4 backdrop-blur-md transition-all transform hover:shadow-2xl overflow-y-auto"
        style={{
          maxHeight: "80vh",
          overflowY: "auto",
          display: "grid",
          gap: "1rem",
        }}
      >
        <div className="flex justify-center mb-1">
          <img
            src="/DTU,_Delhi_official_logo.png"
            alt="Logo"
            className="h-20"
          />
        </div>
        <h2 className="text-4xl font-bold text-center text-gray-800">
          {id === "" ? "Add Record" : "Edit Record"}
        </h2>

        {/* Active Status Toggle */}
        <div className="flex items-center">
          <label className="font-semibold text-black mr-2">User Status:</label>
          <label className="flex items-center cursor-pointer">
            <input
              disabled
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="sr-only"
            />
            <div
              className={`w-10 h-6 bg-gray-300 rounded-full p-1 ${
                formData.isActive ? "bg-green-500" : "bg-gray-300"
              } transition-all`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform ${
                  formData.isActive ? "translate-x-4" : "translate-x-0"
                } transition-all`}
              ></div>
            </div>
            <span className="ml-2 text-black">
              {formData.isActive ? "Active" : "Non-Active"}
            </span>
          </label>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name Field */}
          <div className="flex flex-col">
            <label className="font-semibold text-black">Name:</label>
            <div className="relative">
              <FaUser className="absolute top-3 left-2 text-gray-500" />
              <input
                disabled
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className={`w-full p-2 pl-8 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:border-blue-500 hover:ring-2 hover:ring-blue-300 ${
                  errors.name ? "border-red-500" : ""
                }`}
              />
            </div>
            {errors.name && (
              <span className="text-red-500 text-sm mt-1">{errors.name}</span>
            )}
          </div>

          {/* Date of Birth Field */}
          <div className="flex flex-col">
            <label className="font-semibold text-black">Date of Birth:</label>
            <div className="relative">
              <FaCalendarAlt className="absolute top-3 left-2 text-gray-500" />
              <input
                disabled
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
              disabled
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={`w-full p-2 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:border-blue-500 hover:ring-2 hover:ring-blue-300 ${
                errors.gender ? "border-red-500" : ""
              }`}
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
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
                disabled
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
              <span className="text-red-500 text-sm mt-1">
                {errors.address}
              </span>
            )}
          </div>

          {/* Mobile Number Field */}
          <div className="flex flex-col">
            <label className="font-semibold text-black">Mobile Number:</label>
            <div className="relative">
              <FaPhoneAlt className="absolute top-3 left-2 text-gray-500" />
              <input
                disabled
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
                disabled
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
              {["UG", "FF", "SF", "TF", "SU"].map((floor) => (
                <label key={floor} className="flex items-center space-x-2">
                  <input
                    disabled
                    type="checkbox"
                    name="floorNumber"
                    value={floor}
                    checked={formData.floorNumber.includes(floor)}
                    onChange={handleFloorSelection}
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
          </div>

          {/* Units Field */}
          <div className="flex flex-col">
            <label className="font-semibold text-black">No of Units:</label>
            <input
              disabled
              type="number"
              name="units"
              value={formData.units}
              onChange={handleChange}
              className={`w-full p-2 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:border-blue-500 hover:ring-2 hover:ring-blue-300 ${
                errors.units ? "border-red-500" : ""
              }`}
            />
            {errors.units && (
              <span className="text-red-500 text-sm mt-1">{errors.units}</span>
            )}
          </div>

          {/* Monthly Charges Field */}
          <div className="flex flex-col">
            <label className="font-semibold text-black">Monthly Charges:</label>
            <div className="relative">
              <FaRupeeSign className="absolute top-3 left-3 text-gray-500" />

              <input
                disabled
                type="number"
                name="monthlyCharges"
                value={formData.monthlyCharges}
                onChange={handleChange}
                className={`w-full pl-10 p-2 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:border-blue-500 hover:ring-2 hover:ring-blue-300 ${
                  errors.monthlyCharges ? "border-red-500" : ""
                }`}
              />
            </div>
            {errors.monthlyCharges && (
              <span className="text-red-500 text-sm mt-1">
                {errors.monthlyCharges}
              </span>
            )}
          </div>

          {/* Certificate Issued Field */}
          <div className="flex flex-col">
            <label className="font-semibold text-black">
              Certificate Issued:
            </label>
            <select
              disabled
              name="certificateIssued"
              value={formData.certificateIssued}
              onChange={handleChange}
              className={`w-full p-2 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:border-blue-500 hover:ring-2 hover:ring-blue-300 ${
                errors.certificateIssued ? "border-red-500" : ""
              }`}
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
            {errors.certificateIssued && (
              <span className="text-red-500 text-sm mt-1">
                {errors.certificateIssued}
              </span>
            )}
          </div>
        </div>

        <TransactionForm
          transactions={transactions}
          setTransactions={setTransactions}
          monthlyCharges={formData.monthlyCharges}
        />

        {/* Submit Button */}
        {transactions.length == 0 ? (
          <></>
        ) : (
          <button
            type="submit"
            className="w-full py-3 mt-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            {id === "" ? "Submit" : "Update"}
          </button>
        )}
      </form>

      {/* Success Popup */}
      {showSuccess && <PopUp />}
    </div>
  );
};

export default Form;
