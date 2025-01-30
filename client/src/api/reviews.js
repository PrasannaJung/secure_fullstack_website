import api from "./api";

const createReview = async (rating = 5, review, serviceId) => {
  const payload = { rating, review, serviceId };
  const response = await api.post("/reviews/create", payload);
  const data = await response.data;
  return data;
};

const getReviewsForService = async (serviceId) => {
  const response = await api.get(`/reviews/service/${serviceId}`);
  const data = await response.data;
  return data;
};

const getReviewsForUser = async (userId) => {
  const response = await api.get(`/reviews/user`);
  const data = await response.data;
  return data;
};

export { createReview, getReviewsForService, getReviewsForUser };
