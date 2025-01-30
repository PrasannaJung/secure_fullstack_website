const router = require("express").Router();

const {
  signupUser,
  loginUser,
  verifyOtp,
  resendOtp,
  getUser,
  updateUser,
} = require("../controllers/auth.controller");
const validate = require("../middlewares/validate.middleware");
const { signupSchema } = require("../validators/auth.validator");
const loginLimiter = require("../middlewares/loginLimiter.middleware");
const isAuthenticated = require("../middlewares/isAuthenticated.middleware");

router.post("/signup", validate(signupSchema), signupUser);
router.post("/login", loginUser);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.get("/me", isAuthenticated, getUser);
router.post("/update", isAuthenticated, updateUser);

module.exports = router;
