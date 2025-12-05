require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
// const mongoSanitize = require("express-mongo-sanitize"); // Temporarily disabled - incompatible with Express 5
const morgan = require("morgan");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const budgetRoutes = require("./routes/budget");
const transactionsRoutes = require("./routes/transaction");
const aiRoutes = require("./routes/ai");

const app = express();

// Security middleware
app.use(helmet()); // Set security headers

// CORS configuration - restrict to specific origins in production
const corsOptions = {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Rate limiting - prevent brute force attacks
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
});
app.use("/api/", limiter);

// Stricter rate limit for auth routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs (increased for development)
    message: "Too many login attempts, please try again later.",
    skipSuccessfulRequests: true,
});
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

// Body parser with size limits
app.use(express.json({ limit: "10kb" })); // Limit body size to prevent DoS
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Data sanitization against NoSQL injection
// app.use(mongoSanitize()); // Temporarily disabled - incompatible with Express 5



// Logging middleware
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
} else {
    app.use(morgan("combined"));
}

// routes
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/transactions", transactionsRoutes);
app.use("/api/ai", aiRoutes);

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
(async () => {
    await connectDB(
        process.env.MONGO_URI
    );
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})();
