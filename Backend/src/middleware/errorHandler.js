const { config } = require("../config/env");

function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  // MySQL duplicate key error.
  if (error && error.code === "ER_DUP_ENTRY") {
    return res.status(409).json({
      success: false,
      message: "An employee with this email address already exists.",
      code: "DUPLICATE_EMAIL",
    });
  }

  const statusCode = Number.isInteger(error.statusCode) ? error.statusCode : 500;
  const isServerError = statusCode >= 500;

  if (isServerError) {
    console.error(error);
  }

  const payload = {
    success: false,
    message: isServerError && config.nodeEnv === "production"
      ? "An unexpected server error occurred."
      : (error.message || "An unexpected server error occurred."),
  };

  if (error.code) payload.code = error.code;
  if (error.details) payload.details = error.details;

  if (config.nodeEnv !== "production" && isServerError) {
    payload.stack = error.stack;
  }

  return res.status(statusCode).json(payload);
}

module.exports = { errorHandler };
