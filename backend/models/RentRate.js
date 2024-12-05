const mongoose = require("mongoose");

const RentRateSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    effectiveDate: { type: Date, required: true },
  },
  { timestamps: true }
);
const RentRate = mongoose.model("RentRate", RentRateSchema);
module.exports = RentRate;
