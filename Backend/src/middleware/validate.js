const { AppError } = require("../utils/AppError");

function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      return next(new AppError("Validation failed.", 400, "VALIDATION_ERROR", details));
    }

    req.validated = result.data;
    next();
  };
}

module.exports = { validate };
