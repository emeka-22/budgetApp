const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    budget: { type: mongoose.Schema.Types.ObjectId, ref: "Budget" },
    amount: { type: Number, required: true },
    type: { type: String, enum: ["income", "expense"], required: true },
    category: { type: String },
    date: { type: Date, default: Date.now },
    note: { type: String },
    recurring: {
      frequency: {
        type: String,
        enum: ["daily", "weekly", "monthly", "yearly"],
        default: null,
      },
      nextDate: { type: Date },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
