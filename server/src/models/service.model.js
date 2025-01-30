const mongoose = require("mongoose");

const mongooseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Plumbing",
        "Electrical",
        "Cleaning",
        "Furnishing",
        "Repair",
        "Others",
      ],
    },
    image: {
      type: String,
      // required: true,
    },
    description: {
      type: String,
      // required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      // required: true,
    },
    contact: {
      type: String,
      required: true,
    },
    provider: {
      // type: String,
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    arrivalTime: {
      type: String,
      default: "6 hours",
    },
    servicesIncluded: {
      // array of strings,
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const Service = mongoose.model("Service", mongooseSchema);

module.exports = Service;
