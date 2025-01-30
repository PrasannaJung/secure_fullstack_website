const ApiError = require("../utils/ApiError");

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    throw new ApiError(
      403,
      "Access denied. Not authorized to access this resource",
    );
  }
  next();
};

module.exports = isAdmin;
