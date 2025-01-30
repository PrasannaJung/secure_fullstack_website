const mongoose = require("mongoose");

async function connectDb() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (err) {
    console.error("Error connecting to database", err);
    process.exit(1);
  }
}

module.exports = connectDb;
