require("dotenv").config();
const https = require("https");
const fs = require("fs");

const app = require("./app");
const connectDb = require("./config/connectDb");

const PORT = process.env.PORT || 5000;

const sslOptions = {
  key: fs.readFileSync(__dirname + "/ssl/privkey.pem"),
  cert: fs.readFileSync(__dirname + "/ssl/cert.pem"),
};

connectDb()
  .then(() => {
    https.createServer(sslOptions, app).listen(PORT, () => {
      console.log(`Server running on port https://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to database", err);
    process.exit(1);
  });
