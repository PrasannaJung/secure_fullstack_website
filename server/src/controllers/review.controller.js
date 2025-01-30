const Review = require("../models/review.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const createReview = asyncHandler(async (req, res, next) => {
  const { rating, review, serviceId } = req.body;
  console.log(req.body);

  if (!rating || !review || !serviceId) {
    throw new ApiError(400, "Missing required fields");
  }

  const newReview = new Review({
    review,
    rating: Number(rating),
    service: serviceId,
    user: req.user.id,
  });

  await newReview.save();
  res
    .status(201)
    .json(new ApiResponse(true, "Review created successfully", newReview));
});

const getReviewsForService = asyncHandler(async (req, res, next) => {
  const { serviceId } = req.params;

  const reviews = await Review.find({ service: serviceId })
    .populate("user", "username image")
    .populate("service", "name image")
    .sort({ createdAt: -1 });

  return res.json(
    new ApiResponse(true, "Reviews fetched successfully", reviews),
  );
});

const getReviewsForUser = asyncHandler(async (req, res, next) => {
  const reviews = await Review.find({ user: req.user.id })
    .populate("service", "name image")
    .sort({ createdAt: -1 });

  return res.json(
    new ApiResponse(true, "Reviews fetched successfully", reviews),
  );
});

module.exports = {
  createReview,
  getReviewsForService,
  getReviewsForUser,
};
