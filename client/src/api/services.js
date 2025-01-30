import api from "./api";

// GET ALL SERVICES WITH PAGINATION AND FILTERING
const getAllServices = async (
  page = 1,
  limit = 10,
  search = "",
  locations = [],
  categories = [],
) => {
  // Build query parameters
  const params = new URLSearchParams({
    page,
    limit,
    search,
  });

  // Add locations and categories if provided
  if (locations.length > 0) {
    locations.forEach((location) => params.append("location[]", location));
  }
  if (categories.length > 0) {
    categories.forEach((category) => params.append("category[]", category));
  }

  // Fetch data from the API
  const response = await api.get(`/services?${params.toString()}`);
  const data = await response.data;
  return data;
};

// GET SINGLE SERVICE BY ID
const getServiceById = async (id) => {
  const response = await api.get(`/services/${id}`);
  const data = await response.data;
  return data;
};

export { getAllServices, getServiceById };
