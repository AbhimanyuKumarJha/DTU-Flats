const mongoose = require("mongoose");

const DiscountSchema = new mongoose.Schema(
  {
    onYear: { type: Number, required: true },
    onFloor: { type: Number, required: true },
  },
  { timestamps: true }
);
const Discount = mongoose.model("Discount", DiscountSchema);
module.exports = Discount;
