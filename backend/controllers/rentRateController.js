// rentRateController.js

const RentRate = require("../models/RentRate");

// Create a new rent rate
exports.createRentRate = async (req, res) => {
  try {
    const rentRate = new RentRate(req.body);
    await rentRate.save();
    res.status(201).json(rentRate);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all rent rates
exports.getAllRentRates = async (req, res) => {
  try {
    const rentRates = await RentRate.find().sort({ effectiveDate: -1 });
    res.status(200).json(rentRates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a rent rate by ID
exports.getRentRateById = async (req, res) => {
  try {
    const rentRate = await RentRate.findById(req.params.id);
    if (!rentRate)
      return res.status(404).json({ error: "Rent rate not found" });
    res.status(200).json(rentRate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a rent rate by ID
exports.updateRentRate = async (req, res) => {
  try {
    const rentRate = await RentRate.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!rentRate)
      return res.status(404).json({ error: "Rent rate not found" });
    res.status(200).json(rentRate);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a rent rate by ID
exports.deleteRentRate = async (req, res) => {
  try {
    const rentRate = await RentRate.findByIdAndDelete(req.params.id);
    if (!rentRate)
      return res.status(404).json({ error: "Rent rate not found" });
    res.status(200).json({ message: "Rent rate deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
