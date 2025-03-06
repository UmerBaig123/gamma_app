const mongoose = require("mongoose");

const FXData = new mongoose.Schema(
  {
    ticker: { type: String, required: true },
    timestamp: { type: Date, required: true, default: Date.now },
    ask_price: { type: Number, required: true },
    bid_price: { type: Number, required: true },
    close_price: { type: Number, required: true },
    volume: { type: Number, required: true },
    vva: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FXData", FXData);
