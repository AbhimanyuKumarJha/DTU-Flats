// rentRateRouter.js

const express = require("express");
const rentRateController = require("../controllers/rentRateController");

const router = express.Router();

// Route to create a new rent rate
router.post("/", rentRateController.createRentRate);

// Route to get all rent rates
router.get("/", rentRateController.getAllRentRates);

// Route to get a rent rate by ID
router.get("/:id", rentRateController.getRentRateById);

// Route to update a rent rate by ID
router.put("/:id", rentRateController.updateRentRate);

// Route to delete a rent rate by ID
router.delete("/:id", rentRateController.deleteRentRate);

module.exports = router;
