const axios = require("axios");

async function sendOtp(number, message) {
  const url = "https://api.managepoint.co/api/sms/send";
  // const url = "https://api.managepoint.co/api/sms/check-credit";

  const payload = {
    apiKey: process.env.SMS_API_KEY,
    to: number,
    message: message,
  };

  const response = await axios.post(url, payload);
  const data = await response.data;
  return data;
}

module.exports = sendOtp;
