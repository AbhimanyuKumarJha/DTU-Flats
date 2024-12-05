const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    minlength: [3, "Name must be at least 3 characters long"],
    maxlength: [50, "Name cannot exceed 50 characters"],
  },
  dateOfBirth: {
    type: Date,
    required: [true, "Date of Birth is required"],
  },
  gender: {
    type: String,
    required: [true, "Gender is required"],
    enum: {
      values: ["Male", "Female", "Other"],
      message: "Gender must be Male, Female, or Other",
    },
  },
  address: {
    type: String,
    required: [true, "Address is required"],
    minlength: [5, "Address must be at least 5 characters long"],
    maxlength: [100, "Address cannot exceed 100 characters"],
  },
  floorNumber: {
    type: [String],
    enum: {
      values: ["UG", "FF", "SF", "TF"],
      message: "Invalid floor number",
    },
    validate: [arrayLimit, "You can select up to 5 floors"],
  },
  certificateIssued: {
    type: String,
    required: [true, "Certificate issuance status is required"],
    enum: {
      values: ["Yes", "No"],
      message: "Certificate Issued must be Yes or No",
    },
  },
  mobileNumber: {
    type: String,
    required: [true, "Mobile number is required"],
  },
  alternateMobileNumber: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  transactions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
    },
  ],
});

function arrayLimit(val) {
  return val.length <= 5;
}

module.exports = mongoose.model("User", userSchema);
