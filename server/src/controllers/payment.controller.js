const crypto = require("crypto");
const Payment = require("../models/payment.model");
const { v4 } = require("uuid");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

exports.createPaymentOrder = async (req, res, next) => {
  const { paymentAmount } = req.body;
  const orderId = req.params.oid + "-" + v4() + "-" + req.user.id;
  console.log("The order id and payment amount  is ", orderId, paymentAmount);
  const signature = this.createSignature(
    `total_amount=${paymentAmount},transaction_uuid=${orderId},product_code=EPAYTEST`,
  );
  const formData = {
    amount: paymentAmount,
    failure_url: "http://localhost:3000/failure",
    product_delivery_charge: "0",
    product_service_charge: "0",
    product_code: "EPAYTEST",
    signature: signature,
    signed_field_names: "total_amount,transaction_uuid,product_code",
    success_url: "http://localhost:5000/api/v1/esewa/verify-payment",
    tax_amount: "0",
    total_amount: paymentAmount,
    transaction_uuid: orderId,
  };

  res.json({
    message: "Order Created Sucessfully",
    formData,
    payment_method: "esewa",
  });
};

exports.verifyPayment = async (req, res, next) => {
  try {
    const { data } = req.query;
    const decodedData = JSON.parse(
      Buffer.from(data, "base64").toString("utf-8"),
    );
    console.log(decodedData);

    if (decodedData.status !== "COMPLETE") {
      return res.status(400).json({ message: "errror" });
    }
    const message = decodedData.signed_field_names
      .split(",")
      .map((field) => `${field}=${decodedData[field] || ""}`)
      .join(",");
    console.log(message);

    const orderId = decodedData.transaction_uuid.split("-")[0];
    const decodedArray = decodedData.transaction_uuid.split("-");
    const userId = decodedArray[decodedArray.length - 1];
    console.log("The order id is " + orderId);

    if (decodedData.status !== "COMPLETE") {
      console.log("The status is not complete");
      return res.redirect(`http://localhost:3000/my/orders/${orderId}`);
    }
    const payment = new Payment({
      order: orderId,
      user: userId,
      amount: decodedData.total_amount,
    });

    await payment.save();

    res.redirect("http://localhost:3000/my/orders");
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({ error: err?.message || "No Orders found" });
  }
};

exports.createSignature = (message) => {
  const secret = "8gBm/:&EnhH.1/q";
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(message);

  // Get the digest in base64 format
  const hashInBase64 = hmac.digest("base64");
  return hashInBase64;
};

exports.getAllPayments = asyncHandler(async (req, res, next) => {
  const payments = await Payment.find({ user: req.user.id }).populate({
    path: "order", // Populate the `order` field in Payment
    populate: {
      path: "service", // Inside `order`, populate the `service` field
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(true, "Payments fetched successfully", payments));
});
