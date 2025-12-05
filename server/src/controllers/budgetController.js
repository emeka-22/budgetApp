const Budget = require("../models/Budget");
const Transaction = require("../models/Transaction");
// create budget
exports.createBudget = async (req, res, next) => {
  try {
    const { name, amount, category, startDate, endDate } = req.body;
    if (!name || !amount || !category || !startDate || !endDate) {
      return res.status(400).json({ message: "Missing fields" });
    }
    const budget = await Budget.create({
      user: req.user._id,
      name,
      amount,
      category,
      startDate,
      endDate,
    });
    res.status(201).json(budget);
  } catch (err) {
    next(err);
  }
};
// get all budgets
exports.getBudgets = async (req, res, next) => {
  try {
    const budgets = await Budget.find({ user: req.user._id });
    res.json(budgets);
  } catch (err) {
    next(err);
  }
};

exports.getBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!budget) return res.status(404).json({ message: "Budget not found" });
    const transactions = await Transaction.find({
      budget: budget._id,
    }).sort({ date: -1 });
    res.json({ budget, transactions });
  } catch (err) {
    next(err);
  }
};

exports.updateBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!budget) return res.status(404).json({ message: "Budget not found" });
    res.json(budget);
  } catch (err) {
    next(err);
  }
};

exports.deleteBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!budget) return res.status(404).json({ message: "Budget not found" });
    // optionally delete associated transactions
    await Transaction.deleteMany({ budget: req.params.id });
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
};
