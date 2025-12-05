const { body, validationResult } = require("express-validator");

// Validation middleware to check for errors
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Validation failed", errors: errors.array() });
    }
    next();
};

// Auth validation rules
const registerValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 2, max: 50 })
        .withMessage("Name must be between 2 and 50 characters")
        .escape(),
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email format")
        .normalizeEmail(),
    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d])/)
        .withMessage("Password must contain uppercase, lowercase, number, and special character"),
    validate,
];

const loginValidation = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email format")
        .normalizeEmail(),
    body("password")
        .notEmpty()
        .withMessage("Password is required"),
    validate,
];

// Transaction validation rules
const transactionValidation = [
    body("amount")
        .notEmpty()
        .withMessage("Amount is required")
        .isFloat({ min: 0.01 })
        .withMessage("Amount must be a positive number"),
    body("type")
        .notEmpty()
        .withMessage("Type is required")
        .isIn(["income", "expense"])
        .withMessage("Type must be either 'income' or 'expense'"),
    body("category")
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage("Category must be less than 50 characters")
        .escape(),
    body("date")
        .optional()
        .isISO8601()
        .withMessage("Invalid date format"),
    body("description")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Description must be less than 500 characters")
        .escape(),
    validate,
];

// Budget validation rules
const budgetValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 2, max: 100 })
        .withMessage("Name must be between 2 and 100 characters")
        .escape(),
    body("amount")
        .notEmpty()
        .withMessage("Amount is required")
        .isFloat({ min: 0.01 })
        .withMessage("Amount must be a positive number"),
    body("category")
        .trim()
        .notEmpty()
        .withMessage("Category is required")
        .isLength({ max: 50 })
        .withMessage("Category must be less than 50 characters")
        .escape(),
    body("startDate")
        .notEmpty()
        .withMessage("Start date is required")
        .isISO8601()
        .withMessage("Invalid start date format"),
    body("endDate")
        .notEmpty()
        .withMessage("End date is required")
        .isISO8601()
        .withMessage("Invalid end date format")
        .custom((endDate, { req }) => {
            if (new Date(endDate) <= new Date(req.body.startDate)) {
                throw new Error("End date must be after start date");
            }
            return true;
        }),
    validate,
];

module.exports = {
    registerValidation,
    loginValidation,
    transactionValidation,
    budgetValidation,
};
