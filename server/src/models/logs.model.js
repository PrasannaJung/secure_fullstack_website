// models/Log.model.js
const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
  {
    level: {
      type: String,
      required: true,
      enum: ["info", "error"],
      default: "info",
    },
    message: {
      type: String,
      required: true,
    },
    method: {
      type: String,
      required: true,
      enum: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    },
    url: {
      type: String,
      required: true,
    },
    headers: {
      type: mongoose.Schema.Types.Mixed,
    },
    query: {
      type: mongoose.Schema.Types.Mixed,
    },
    body: {
      type: mongoose.Schema.Types.Mixed,
    },
    ip: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
    },
    statusCode: {
      type: Number,
    },
    duration: {
      type: String,
    },
    username: {
      type: String, // Add username field
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

const Log = mongoose.model("Log", logSchema);

module.exports = Log;
