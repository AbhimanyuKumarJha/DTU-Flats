// transactionController.js

const Transaction = require("../models/Transaction");
const User = require("../models/User");

// Create a new transaction
exports.createTransaction = async (req, res) => {
  try {
    const {
      userId,
      paymentMode,
      calculatedAmount,
      monthsPaid,
      paymentDetails,
      status,
    } = req.body;

    // Basic validation on the server-side
    if (
      !userId ||
      !paymentMode ||
      !calculatedAmount ||
      !monthsPaid ||
      monthsPaid.length === 0
    ) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const transaction = new Transaction({
      userId,
      paymentMode,
      calculatedAmount,
      monthsPaid,
      paymentDetails,
      status,
    });
    await transaction.save();

    // Update user's transactions array
    await User.findByIdAndUpdate(
      userId,
      { $push: { transactions: transaction._id } },
      { new: true }
    );

    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all transactions
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().populate("userId");
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single transaction by ID
exports.getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id).populate(
      "userId"
    );
    if (!transaction)
      return res.status(404).json({ error: "Transaction not found" });
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a transaction by ID
exports.updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("userId");
    if (!transaction)
      return res.status(404).json({ error: "Transaction not found" });
    res.status(200).json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// Update a transaction by ID for a specific user
exports.updateTransactionByUserId = async (req, res) => {
  try {
    const { userId, transactionId } = req.params;
    
    // Find the transaction and verify ownership
    const transaction = await Transaction.findById(transactionId);
    if (!transaction || transaction.userId.toString() !== userId) {
      return res.status(404).json({ 
        error: "Transaction not found or does not belong to the user" 
      });
    }

    // Update only the allowed fields
    const allowedUpdates = {
      status: req.body.status,
      paymentDetails: req.body.paymentDetails
    };

    // Update the transaction
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      transactionId,
      allowedUpdates,
      { 
        new: true,
        runValidators: true 
      }
    ).populate("userId");

    res.status(200).json(updatedTransaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a transaction by ID
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    // Remove transaction reference from user
    await User.findByIdAndUpdate(transaction.userId, {
      $pull: { transactions: transaction._id },
    });

    await Transaction.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get transactions by status
exports.getTransactionByStatus = async (req, res) => {
  try {
    const status = req.params.status;
    const transactions = await Transaction.find({ status }).populate("userId");
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get transactions by month and year
exports.getTransactionsByMonth = async (req, res) => {
  try {
    const { month, year } = req.params;

    // Validate month and year
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);

    if (monthNum < 1 || monthNum > 12) {
      return res
        .status(400)
        .json({ error: "Invalid month. Month should be between 1 and 12" });
    }

    if (yearNum < 2000 || yearNum > 2100) {
      return res.status(400).json({ error: "Invalid year" });
    }

    const transactions = await Transaction.find({
      monthsPaid: {
        $elemMatch: { month: monthNum, year: yearNum },
      },
    }).populate("userId");
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get transactions by user ID (updated version)
exports.getTransactionsByUserId = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.params.userId })
      .populate("userId")
      .sort({ transactionDate: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
