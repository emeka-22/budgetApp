const express = require("express");
const router = express.Router();
const { chat } = require("../controllers/aiController");
const auth = require("../middleware/auth");

// POST /api/ai/chat - Send message to AI
router.post("/chat", auth, chat);

module.exports = router;
