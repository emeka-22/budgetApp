const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { transactionValidation } = require("../middleware/validators");
const {
  addTransaction,
  getTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction,
  monthlySummary,
} = require("../controllers/transactionController");

router.use(auth);
router.post("/", transactionValidation, addTransaction);
router.get("/", getTransactions);
router.get("/summary/monthly", monthlySummary);
router.get("/:id", getTransaction);
router.put("/:id", transactionValidation, updateTransaction);
router.delete("/:id", deleteTransaction);

module.exports = router;
