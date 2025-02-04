const Service = require("../models/service.model");
const Review = require("../models/review.model");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

// Create a new service
const createService = asyncHandler(async (req, res, next) => {
  const {
    name,
    category,
    image,
    description,
    price,
    location,
    contact,
    arrivalTime,
    servicesIncluded,
    // provider,
  } = req.body;

  if (!name || !category || !price || !contact || !arrivalTime) {
    throw new ApiError(400, "Missing required fields");
  }

  const service = new Service({
    name,
    category,
    image,
    description,
    price,
    location,
    contact,
    arrivalTime,
    servicesIncluded,
    // provider,
  });

  await service.save();
  res
    .status(201)
    .json(new ApiResponse(true, "Service created successfully", service));
});

const getAllServices = asyncHandler(async (req, res, next) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    location = [],
    category = [],
  } = req.query;
  const skip = (page - 1) * limit;

  // Build the filter query
  const searchQuery = {
    ...(search && {
      $or: [
        { name: { $regex: search, $options: "i" } }, // Case-insensitive search on 'name'
        { description: { $regex: search, $options: "i" } }, // Case-insensitive search on 'description'
      ],
    }),
    ...(location.length > 0 && {
      location: { $in: Array.isArray(location) ? location : [location] },
    }), // Matches any of the selected locations
    ...(category.length > 0 && {
      category: { $in: Array.isArray(category) ? category : [category] },
    }), // Matches any of the selected categories
  };

  const [services, total] = await Promise.all([
    Service.find(searchQuery)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })
      .populate("provider", "username phone"),
    Service.countDocuments(searchQuery),
  ]);

  const totalPages = Math.ceil(total / limit);

  res.json(
    new ApiResponse(true, "Services fetched successfully", {
      services,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalServices: total,
      },
    }),
  );
});

// Get a single service with reviews
const getSingleService = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const service = await Service.findById(id).populate(
    "provider",
    "username phone",
  );
  if (!service) {
    throw new ApiError(404, "Service not found");
  }

  const reviews = await Review.find({ service: id })
    .populate("user", "username image")
    .sort({ createdAt: -1 });

  res.json(
    new ApiResponse(true, "Service fetched successfully", { service, reviews }),
  );
});

// GET ALL SERVICES NAME AND ID BY SEARCHING
const getAllServicesNameAndId = asyncHandler(async (req, res, next) => {
  const { search = "" } = req.query;

  const services = await Service.find({
    name: { $regex: search, $options: "i" },
  }).select("name");

  res.json(new ApiResponse(true, "Services fetched successfully", services));
});

const updateServiceStatus = asyncHandler(async (req, res, next) => {
  const sid = req.params.id;
  const { newStatus } = req.body;

  const newService = await Service.findByIdAndUpdate(
    sid,
    {
      status: newStatus,
    },
    {
      new: true,
    },
  );

  return res
    .status(200)
    .json(new ApiResponse(true, "Status Updated Successfully"), newService);
});

module.exports = {
  createService,
  getAllServices,
  getSingleService,
  getAllServicesNameAndId,
  updateServiceStatus,
};
