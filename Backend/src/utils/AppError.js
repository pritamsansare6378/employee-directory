class AppError extends Error {
  constructor(message, statusCode = 500, code, details) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    if (details) this.details = details;
    Error.captureStackTrace?.(this, this.constructor);
  }
}

module.exports = { AppError };
