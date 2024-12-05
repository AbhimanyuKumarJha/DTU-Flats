// transactionRouter.js

const express = require("express");
const transactionController = require("../controllers/transactionController");

const router = express.Router();

// Route to create a new transaction
router.post("/", transactionController.createTransaction);

// Route to get all transactions
router.get("/", transactionController.getAllTransactions);

// Route to get transactions by status
router.get("/status/:status", transactionController.getTransactionByStatus);

// Route to get transactions by month and year
router.get(
  "/month/:month/year/:year",
  transactionController.getTransactionsByMonth
);
// Add this route
router.get("/user/:userId", transactionController.getTransactionsByUserId);

// Route to get a transaction by ID
router.get("/:id", transactionController.getTransactionById);

// Route to update a transaction by ID
router.put("/:id", transactionController.updateTransaction);

// Route to delete a transaction by ID
router.delete("/:id", transactionController.deleteTransaction);

module.exports = router;
