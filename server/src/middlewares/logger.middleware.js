const router = require("express").Router();
const jwt = require("jsonwebtoken");
const Log = require("../models/logs.model");

const decodeToken = (token) => {
  try {
    if (!token) return null;

    // Remove "Bearer " prefix if present
    if (token.startsWith("Bearer ")) {
      token = token.slice(7);
    }

    // Decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your JWT secret
    return decoded.username; // Assuming the username is stored in the token payload
  } catch (err) {
    console.error("Failed to decode token:", err);
    return null;
  }
};
router.use((req, res, next) => {
  const start = Date.now();

  // Extract the token from the Authorization header
  const token = req.headers.authorization;

  // Decode the token to get the username
  const username = decodeToken(token);

  // Log the incoming request
  const requestLog = new Log({
    level: "info",
    message: "Incoming Request",
    method: req.method,
    url: req.originalUrl,
    headers: req.headers,
    query: req.query,
    body: req.method === "GET" ? undefined : req.body,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get("User-Agent"),
    username: username || "anonymous",
  });

  requestLog.save().catch((err) => {
    console.error("Failed to save request log:", err);
  });

  res.on("finish", () => {
    const duration = Date.now() - start;

    const responseLog = new Log({
      level: "info",
      message: "Request Completed",
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get("User-Agent"),
      username: username || "anonymous",
    });

    responseLog.save().catch((err) => {
      console.error("Failed to save response log:", err);
    });
  });

  next();
});

module.exports = router;
