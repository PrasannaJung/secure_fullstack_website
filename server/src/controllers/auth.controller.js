const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const User = require("../models/user.model");
const asyncHandler = require("../utils/asyncHandler");
const sendOtp = require("../utils/sendOtp");

const signupUser = asyncHandler(async (req, res) => {
  const { username, phone, password } = req.body;

  const existing = await User.findOne({ phone });
  if (existing) {
    throw new ApiError(400, "User with the given phone number already exists");
  }
  const generateOtp = () => Math.floor(100000 + Math.random() * 900000);
  const otp = generateOtp();
  const otpExpiry = new Date(Date.now() + 45 * 60 * 1000);

  const user = new User({ username, phone, password, otp, otpExpiry });
  await user.save();

  const data = await sendOtp(phone, `Your verification OTP is\n${otp}`);

  console.log(data);

  return res.json(new ApiResponse(true, "User created successfully", null));
});

const loginUser = asyncHandler(async (req, res) => {
  const { phone, password } = req.body;

  const user = await User.findOne({ phone });
  if (!user) {
    throw new ApiError(
      400,
      "User account with the given phone number does not exist",
    );
  }

  if (user.lockUntil && user.lockUntil > Date.now()) {
    throw new ApiError(
      429,
      "Account is temporarily locked. Please try again later.",
    );
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    await user.incrementLoginAttempts();
    throw new ApiError(400, "Invalid phone number or password");
  }

  await user.resetLoginAttempts();

  if (user.isPasswordExpired()) {
    throw new ApiError(
      403,
      "Your password has expired. Please update your password.",
    );
  }

  const userData = {
    username: user.username,
    phone: user.phone,
    email: user.email,
    image: user.image,
  };

  const token = user.generateAuthToken();

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
  return res.json(
    new ApiResponse(true, "Login successful", { token, userData }),
  );
});

const verifyOtp = asyncHandler(async (req, res) => {
  const { phone, otp } = req.body;
  const user = await User.findOne({ phone });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (!user.otpExpiry || user.otpExpiry < Date.now()) {
    throw new ApiError(400, "OTP has expired");
  }

  if (user.otp === otp) {
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    return res
      .status(200)
      .json(new ApiResponse(true, "OTP successfully verified"));
  } else {
    throw new ApiError(400, "Invalid OTP code");
  }
});

const resendOtp = asyncHandler(async (req, res) => {
  const { phone } = req.body;
  const generateOtp = () => Math.floor(100000 + Math.random() * 900000);
  const otp = generateOtp();

  const user = await User.findOne({ phone });
  if (!user) {
    throw new ApiError(400, "User not found. Give a valid phone number");
  }

  user.otp = otp;
  const data = await sendOtp(phone, `Your verification OTP is\n${otp}`);

  if (data.success) {
    return res
      .status(200)
      .json(new ApiResponse(true, "OTP resent successfully"));
  }
});

const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  return res.json(new ApiResponse(true, "User fetched successfully", user));
});

const updateUser = asyncHandler(async (req, res) => {
  console.log(req.body);

  const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
  });

  return res.json(
    new ApiResponse(true, "User updated successfully", updatedUser),
  );
});

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isMatch = await user.matchPassword(oldPassword);
  if (!isMatch) {
    throw new ApiError(400, "Old password is incorrect");
  }

  try {
    await user.changePassword(newPassword);
    return res.json(new ApiResponse(true, "Password changed successfully"));
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});

module.exports = {
  signupUser,
  loginUser,
  verifyOtp,
  resendOtp,
  getUser,
  updateUser,
  changePassword,
};
