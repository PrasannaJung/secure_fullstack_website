import api from "./api";

// CREATE A NEW BOOKING
const createBooking = async ({ service, date, time, address, provider }) => {
  const response = await api.post("/orders/book", {
    service,
    date,
    time,
    address,
    provider,
  });
  const data = await response.data;
  return data;
};

// GET ALL BOOKINGS FOR THE CURRENT USER
const getAllUserBookings = async () => {
  const response = await api.get("/orders/user");
  const data = await response.data;
  return data;
};

// GET A SINGLE BOOKING BY ID
const getBookingById = async (id) => {
  const response = await api.get(`/orders/${id}`);
  const data = await response.data;
  return data;
};

// UPDATE A BOOKING BY ID
const updateBooking = async (id, updatedDetails) => {
  const response = await api.put(`/orders/${id}`, updatedDetails);
  const data = await response.data;
  return data;
};

// DELETE A BOOKING BY ID
const cancelUserOrder = async (id) => {
  const response = await api.delete(`/orders/${id}`);
  const data = await response.data;
  return data;
};

const getOrderById = async (id) => {
  const response = await api.get(`/orders/${id}`);
  const data = await response.data;
  return data;
};

export {
  createBooking,
  getAllUserBookings,
  getBookingById,
  updateBooking,
  cancelUserOrder,
  getOrderById,
};
