// order.routes.js
const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const isAuthenticated = require("../middlewares/isAuthenticated.middleware");

router.post("/book", isAuthenticated, orderController.createOrder);

router.get("/user", isAuthenticated, orderController.getAllUserOrders);

router.get("/:id", isAuthenticated, orderController.getOrderById);

router.put("/:id", orderController.updateOrder);

router.delete("/:id", isAuthenticated, orderController.cancelOrder);

module.exports = router;
