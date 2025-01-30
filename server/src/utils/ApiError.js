class ApiError extends Error {
  constructor(statusCode, message = "Something went wrong", details = []) {
    super();
    this.statusCode = statusCode;
    this.message = message;
    this.details = details;
    this.success = false;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
