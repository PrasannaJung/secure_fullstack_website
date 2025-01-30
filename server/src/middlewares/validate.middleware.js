const { ZodError } = require("zod");
const ApiError = require("../utils/ApiError");

const validate = (schema) => (req, res, next) => {
  try {
    // Validate request body
    schema.parse(req.body);
    next(); // If validation passes, proceed to the next middleware
  } catch (error) {
    if (error instanceof ZodError) {
      const details = error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      next(new ApiError(400, "Validation failed", details));
    } else {
      next(error);
    }
  }
};

module.exports = validate;
