const mongoose = require("mongoose");
const { sendTransactionEmail } = require('../utils/emailService'); // Import the email service

const TransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    monthsPaid: [
      {
        month: { type: Number, required: true }, // e.g., 1 for January, 2 for February
        year: { type: Number, required: true },
      },
    ],
    calculatedAmount: { type: Number, required: true },
    paymentMode: {
      type: String,
      enum: ["DD", "Cheque", "Cash", "UPI"],
      required: true,
    },
    paymentDetails: {
      chequeOrDDNumber: { type: String },
      upiTransactionId: { type: String },
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
    },
    transactionDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Middleware to automatically update the updatedAt field on save
// transactionSchema.pre('save', function(next) {
//   this.updatedAt = Date.now();
//   next();
// });

// Add validation for monthsPaid
TransactionSchema.path("monthsPaid").validate(function (value) {
  return value && value.length > 0;
}, "At least one month must be specified");

// Add validation for payment details based on payment mode
TransactionSchema.pre("save", function (next) {
  if (this.paymentMode === "UPI" && !this.paymentDetails.upiTransactionId) {
    next(new Error("UPI transaction ID is required for UPI payments"));
  } else if (
    (this.paymentMode === "Cheque" || this.paymentMode === "DD") &&
    !this.paymentDetails.chequeOrDDNumber
  ) {
    next(new Error("Cheque/DD number is required for Cheque/DD payments"));
  } else if (
    this.paymentMode === "Cash" &&
    (this.paymentDetails.upiTransactionId ||
      this.paymentDetails.chequeOrDDNumber)
  ) {
    next(new Error("Payment details should not be provided for Cash payments"));
  }
  next();
});

// Add this after your TransactionSchema definition
TransactionSchema.index({
  userId: 1,
  "monthsPaid.year": 1,
  "monthsPaid.month": 1,
  transactionDate: -1,
});

TransactionSchema.path("transactionDate").validate(function (value) {
  return value <= new Date();
}, "Transaction date cannot be in the future");

// Add post-save middleware for email notifications
TransactionSchema.post('save', async function(doc) {
  const isUpdate = this.isModified(); // Check if this is an update operation
  await sendTransactionEmail(doc, isUpdate);
});

// You might also want to handle updates specifically
TransactionSchema.post('findOneAndUpdate', async function(doc) {
  if (doc) {
    await sendTransactionEmail(doc, true);
  }
});

const Transaction = mongoose.model("Transaction", TransactionSchema);

module.exports = Transaction;
