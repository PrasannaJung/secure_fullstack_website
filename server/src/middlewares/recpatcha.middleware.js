const ApiError = require("../utils/ApiError");
const verifyRecaptcha = require("../utils/recaptcha");

const recaptchaMiddleware = async (req, res, next) => {
  try {
    const { recaptchaToken } = req.body;

    if (!recaptchaToken) {
      throw new ApiError(400, "ReCAPTCHA token is required");
    }

    await verifyRecaptcha(recaptchaToken);
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = recaptchaMiddleware;
