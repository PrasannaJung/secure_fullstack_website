const express = require("express");
const router = express.Router();

const {
  verifyPayment,
  createPaymentOrder,
  getAllPayments,
} = require("../controllers/payment.controller");
const isAuthenticated = require("../middlewares/isAuthenticated.middleware");

router.get("/esewa/verify-payment", verifyPayment);
router.post("/order/esewa/:oid/", isAuthenticated, createPaymentOrder);

router.get("/payments/all", isAuthenticated, getAllPayments);

module.exports = router;
