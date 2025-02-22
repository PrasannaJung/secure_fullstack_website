const path = require("path");
const express = require("express");

const app = express();
const cors = require("cors");
const morgan = require("morgan");
const xss = require("xss-clean");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");

const errorHandler = require("./utils/errorHandler");
const logger = require("./logger");

app.use(
  cors({
    origin: process.env.ORIGIN,
    methods: "GET, POST, PUT, DELETE, OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true,
  }),
);
app.options("*", cors());

app.use(express.json());
app.use(morgan("dev"));
app.use(xss());
app.use(helmet());
app.use(mongoSanitize());

// servce static public folder which is outside src
app.use(express.static(path.join(__dirname, "..", "public")));
const loggerMiddleware = require("./middlewares/logger.middleware");

app.use(loggerMiddleware);

// importing routes
const authRoutes = require("./routes/auth.routes");
const servicesRoutes = require("./routes/service.routes");
const reviewsRoutes = require("./routes/review.routes");
const uploadRoutes = require("./routes/upload.routes");
const orderRoutes = require("./routes/order.routes");
const paymentRoutes = require("./routes/payment.routes");

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/services", servicesRoutes);
app.use("/api/v1/reviews", reviewsRoutes);
app.use("/api/v1/file", uploadRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1", paymentRoutes);

app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`, { stack: err.stack });
  next(err);
});

// for error handling
app.use(errorHandler);

module.exports = app;
