import api from "./api";

const verifyOtp = async (phone, otp) => {
  const payload = { phone, otp };
  const response = await api.post("/auth/verify-otp", payload);
  const data = await response.data;
  return data;
};
const resendOtp = async (phone) => {
  const payload = { phone };
  const response = await api.post("/auth/resend-otp", payload);
  const data = await response.data;
  return data;
};

const getMe = async () => {
  const response = await api.get("/auth/me");
  const data = await response.data;
  console.log("THE DATA IS ", data);
  return data;
};

const updateUser = async (userData) => {
  const response = await api.post("/auth/update", userData);
  const data = await response.data;
  return data;
};

const uploadImage = async (formData) => {
  const response = await api.post("/file/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  const data = await response.data;
  return data;
};

export { verifyOtp, resendOtp, getMe, updateUser, uploadImage };
