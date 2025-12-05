const Transaction = require("../models/Transaction");

exports.deleteTransaction = async (req, res, next) => {
  try {
    const tx = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!tx) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
};

//create new transaction
exports.addTransaction = async (req, res, next) => {
  try {
    const { amount, type, category, date, description } = req.body;
    const tx = new Transaction({
      user: req.user._id,
      amount,
      type,
      category,
      date,
      description,
    });
    await tx.save();
    res.status(201).json(tx);
  } catch (err) {
    next(err);
  }
};

//update transaction
exports.updateTransaction = async (req, res, next) => {
  try {
    const tx = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!tx) return res.status(404).json({ message: "Transaction not found" });
    res.json(tx);
  } catch (err) {
    next(err);
  }
};

//get transaction by id
exports.getTransaction = async (req, res, next) => {
  try {
    const tx = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!tx) return res.status(404).json({ message: "Transaction not found" });
    res.json(tx);
  } catch (err) {
    next(err);
  }
};
//get all transactions of a user
exports.getTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id }).sort({
      date: -1,
    });
    res.json(transactions);
  } catch (err) {
    next(err);
  }
};


exports.monthlySummary = async (req, res, next) => {
  try {
    const { year, month } = req.query; // numeric
    const y = Number(year) || new Date().getFullYear();
    const m = Number(month) != null ? Number(month) : new Date().getMonth() + 1;
    const start = new Date(y, m - 1, 1);
    const end = new Date(y, m, 1);
    const pipeline = [
      { $match: { user: req.user._id, date: { $gte: start, $lt: end } } },
      {
        $group: {
          _id: { type: "$type", category: "$category" },
          total: { $sum: "$amount" },
        },
      },
    ];
    const results = await Transaction.aggregate(pipeline);
    // format
    const summary = results.reduce((acc, cur) => {
      const t = cur._id.type;
      acc[t] = acc[t] || { total: 0, byCategory: {} };
      acc[t].total += cur.total;
      if (cur._id.category) acc[t].byCategory[cur._id.category] = cur.total;
      return acc;
    }, {});
    res.json(summary);
  } catch (err) {
    next(err);
  }
};
