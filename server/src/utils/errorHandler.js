const errorHandler = (error, req, res, next) => {
  errorMessage =
    error.message.trim() === "" ? "Something went wrong" : error.message;
  statusCode = error.statusCode || 500;
  details = error.details || [];

  return res
    .status(statusCode)
    .json({ success: error.success, message: errorMessage, details });
};

module.exports = errorHandler;
