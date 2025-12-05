const errorHandler = (err, req, res, next) => {
  // Log error for debugging (in production, use proper logging service)
  if (process.env.NODE_ENV === "development") {
    console.error(err.stack);
  } else {
    // In production, log to a file or service, not console
    console.error({
      message: err.message,
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method,
    });
  }

  // Don't expose internal error details in production
  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Generic error response
  const response = {
    success: false,
    message: statusCode === 500 && process.env.NODE_ENV === "production"
      ? "An unexpected error occurred"
      : message,
  };

  // Include stack trace only in development
  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
