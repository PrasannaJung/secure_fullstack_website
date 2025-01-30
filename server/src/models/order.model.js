const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      // required: true,
      default: "Pending",
      enum: ["Pending", "Accepted", "Rejected"],
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      // type: String,
      required: true,
      ref: "User",
    },
    // shipping: {
    //   type: String,
    //   // required:
    //   default:""
    // }
  },
  {
    timestamps: true,
  },
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
