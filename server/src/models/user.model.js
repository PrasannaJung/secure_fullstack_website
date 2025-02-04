const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  passwordChangedAt: {
    type: Date,
    default: Date.now,
  },
  loginAttempts: {
    type: Number,
    default: 0,
  },
  lockUntil: {
    type: Date,
  },
  otp: {
    type: String,
  },
  otpExpiry: {
    type: Date,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ["user", "provider"],
    default: "user",
  },
  location: {
    type: String,
  },
  image: {
    type: String,
  },
  email: {
    type: String,
  },
  previousPasswords: {
    type: [String],
    default: [],
  },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  // Store last 3 passwords before updating
  if (this.password) {
    if (this.previousPasswords.length >= 3) {
      this.previousPasswords.pop(); // Keep only last 3
    }
    this.previousPasswords.unshift(this.password); // Add current password before changing
  }

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordChangedAt = Date.now();
  next();
});

// Compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      id: this._id,
      role: this.role,
      username: this.username,
      isVerified: this.isVerified,
      image: this.image,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    },
  );
  return token;
};

userSchema.methods.isPasswordExpired = function () {
  const ninetyDaysAgo = Date.now() - 90 * 24 * 60 * 60 * 1000;
  return this.passwordChangedAt < ninetyDaysAgo;
};

userSchema.methods.changePassword = async function (newPassword) {
  for (const oldPassword of this.previousPasswords) {
    if (await bcrypt.compare(newPassword, oldPassword)) {
      throw new Error("New password cannot be one of your last 3 passwords.");
    }
  }

  this.password = newPassword;
  await this.save();
};

userSchema.methods.incrementLoginAttempts = async function () {
  if (this.lockUntil && this.lockUntil > Date.now()) {
    return;
  }

  if (this.loginAttempts >= 4) {
    this.lockUntil = Date.now() + 15 * 60 * 1000; // Lock for 15 minutes
    this.loginAttempts = 5;
  } else {
    this.loginAttempts += 1;
  }

  await this.save();
};

userSchema.methods.resetLoginAttempts = async function () {
  this.loginAttempts = 0;
  this.lockUntil = undefined;
  await this.save();
};

// Change Password Function

const User = mongoose.model("User", userSchema);
module.exports = User;
