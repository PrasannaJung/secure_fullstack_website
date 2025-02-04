// utils/recaptcha.js
const axios = require("axios");
const ApiError = require("./ApiError");

const verifyRecaptcha = async (token) => {
  try {
    const response = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: token,
        },
      },
    );

    const { success, score } = response.data;

    if (!success || score < 0.5) {
      throw new ApiError(400, "ReCAPTCHA verification failed");
    }

    return true;
  } catch (error) {
    throw new ApiError(400, "ReCAPTCHA verification failed");
  }
};

module.exports = verifyRecaptcha;
