const Discount = require("../models/Discount");

exports.createDiscount = async (req, res) => {
  try {
    const { onYear, onFloor } = req.body;
    const discount = new Discount({ onYear, onFloor });
    await discount.save();
    res.status(201).json(discount);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDiscount = async (req, res) => {
  try {
    const discount = await Discount.find();
    res.status(200).json(discount);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateDiscount = async (req, res) => {
  try {
    const { id } = req.params;
    const { onYear, onFloor } = req.body;
    const discount = await Discount.findByIdAndUpdate(id, { onYear, onFloor });
    res.status(200).json(discount);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteDiscount = async (req, res) => {
  try {
    const { id } = req.params;
    await Discount.findByIdAndDelete(id);
    res.status(200).json({ message: "Discount deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
