import axios from "axios";

// Create API instance directly instead of using the hook
const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor to handle common error cases
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log("401 Error intercepted: Unauthorized.");
    }
    return Promise.reject(error);
  }
);

export const getAllAreas = async () => {
  try {
    const response = await api.get("/areas");
    // The actual areas are in response.data.data, not just response.data
    return response.data.data;
  } catch (error) {
    console.error("Error fetching areas:", error);
    throw error;
  }
};

export const getAreaById = async (id) => {
  try {
    const response = await api.get(`/areas/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching area ${id}:`, error);
    throw error;
  }
};

export const saveArea = async (areaData) => {
  try {
    const response = await api.post("/areas", areaData);
    return response.data.data;
  } catch (error) {
    console.error("Error saving area:", error);
    throw error;
  }
};

export const updateArea = async (id, areaData) => {
  try {
    const response = await api.put(`/areas/${id}`, areaData);
    return response.data.data;
  } catch (error) {
    console.error(`Error updating area ${id}:`, error);
    throw error;
  }
};

export const deleteArea = async (id) => {
  try {
    const response = await api.delete(`/areas/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error deleting area ${id}:`, error);
    throw error;
  }
};

export const findAreasContainingPoint = async (coordinates) => {
  try {
    const [longitude, latitude] = coordinates;
    const response = await api.get("/areas/point", {
      params: { longitude, latitude },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error finding areas for point:", error);
    throw error;
  }
};
