require("dotenv").config();

const app = require("./app");
const connectDb = require("./config/connectDb");

const PORT = process.env.PORT || 5000;

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to database", err);
    process.exit(1);
  });
