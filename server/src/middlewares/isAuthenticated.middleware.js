const ApiError = require("../utils/ApiError");
const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
  // get jwt token from the request header and verify it
  const token = req.header("Authorization");
  if (!token) {
    throw new ApiError(401, "Access denied. No token provided");
  }

  // get the actual token value since it comes in the form "Bearer token"
  const tokenValue = token.split(" ")[1];

  try {
    const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    throw new ApiError(401, "Invalid token value or token expired");
  }
};

module.exports = isAuthenticated;
