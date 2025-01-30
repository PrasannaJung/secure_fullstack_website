const Order = require("../models/order.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

// Create a new order
const createOrder = asyncHandler(async (req, res, next) => {
  const { service, date, time, address, provider } = req.body;

  if (!service || !date || !time || !address || !provider) {
    throw new ApiError(400, "Missing required fields");
  }

  // check if this service has already been ordered by the user
  const existingOrder = await Order.findOne({ user: req.user.id, service });

  if (existingOrder) {
    throw new ApiError(400, "You have already ordered this service");
  }

  const newOrder = new Order({
    user: req.user.id,
    service,
    date,
    time,
    address,
    provider,
  });

  await newOrder.save();
  res
    .status(201)
    .json(new ApiResponse(true, "Order created successfully", newOrder));
});

// Get all orders for the logged-in user
const getAllUserOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id }).populate(
    "service provider",
  );

  res.json(new ApiResponse(true, "Orders fetched successfully", orders));
});

// Get all orders for the logged-in provider
const getAllProviderOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ provider: req.user.id }).populate(
    "service user",
  );

  res.json(new ApiResponse(true, "Orders fetched successfully", orders));
});

// Get an order by ID
const getOrderById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findById(id).populate("user service provider");

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  res.json(new ApiResponse(true, "Order fetched successfully", order));
});

// Update an order by ID
const updateOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const updatedOrder = await Order.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedOrder) {
    throw new ApiError(404, "Order not found");
  }

  res.json(new ApiResponse(true, "Order updated successfully", updatedOrder));
});

// Delete an order by ID
const cancelOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  // check if the user is the owner of the order
  const order = await Order.findById(id);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (order.user.toString() !== req.user.id) {
    throw new ApiError(403, "You are not authorized to delete this order");
  }

  const deletedOrder = await Order.findByIdAndDelete(id);

  if (!deletedOrder) {
    throw new ApiError(404, "Order not found");
  }

  res.json(new ApiResponse(true, "Order deleted successfully"));
});

module.exports = {
  createOrder,
  getAllUserOrders,
  getAllProviderOrders,
  getOrderById,
  updateOrder,
  cancelOrder,
};
