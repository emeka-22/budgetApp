require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/auth/register", (req, res) => {
    console.log("Register endpoint hit:", req.body);
    res.json({ success: true, message: "Test endpoint working" });
});

const PORT = 5001;
app.listen(PORT, () => console.log(`Test server running on port ${PORT}`));
