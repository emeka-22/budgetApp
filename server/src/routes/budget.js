const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { budgetValidation } = require("../middleware/validators");
const {
  createBudget,
  getBudgets,
  getBudget,
  updateBudget,
  deleteBudget,
} = require("../controllers/budgetController");

router.use(auth);
router.post("/", budgetValidation, createBudget);
router.get("/", getBudgets);
router.get("/:id", getBudget);
router.put("/:id", budgetValidation, updateBudget);
router.delete("/:id", deleteBudget);

module.exports = router;
