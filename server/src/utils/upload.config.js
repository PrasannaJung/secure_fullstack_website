const express = require("express");
const fs = require("fs");
const multer = require("multer");
const path = require("path");

// Multer configuration for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = path.join("public", "uploads");
    const subFolder = file.fieldname.toLowerCase();
    uploadPath = path.join(uploadPath, subFolder);
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`,
    ); // Generate unique file names
  },
});

// File filter to restrict allowed file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only JPEG, PNG, and GIF are allowed."),
      false,
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
});

const handleUpload = (req, res, next) => {
  const uploadHandler = upload.fields([
    { name: "serviceImage", maxCount: 1 },
    { name: "profileImage", maxCount: 1 },
  ]);

  uploadHandler(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: `Multer error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ message: `Error: ${err.message}` });
    }
    next();
  });
};

module.exports = handleUpload;
