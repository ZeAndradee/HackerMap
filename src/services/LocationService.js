import useApi from "../hooks/useApi";

const api = useApi();

export const saveUserLocation = async (locationData) => {
  try {
    const response = await api.post("/locations", locationData);
    return response.data.data;
  } catch (error) {
    console.error("Error saving location:", error);
    throw error;
  }
};

export const updateUserLocation = async (userId, locationData) => {
  try {
    // Using PATCH to only update the latest location for this user
    const response = await api.patch(`/locations/user/${userId}`, locationData);
    return response.data.data;
  } catch (error) {
    console.error(`Error updating location for user ${userId}:`, error);
    throw error;
  }
};

export const getUserLocations = async (userId) => {
  try {
    const response = await api.get(`/locations/user/${userId}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching locations for user ${userId}:`, error);
    throw error;
  }
};

export const getAllLocations = async () => {
  try {
    const response = await api.get("/locations");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching all locations:", error);
    throw error;
  }
};

// Get locations within a specific geographic area (e.g., a radius or polygon)
export const getLocationsInArea = async (areaId) => {
  try {
    const response = await api.get(`/locations/area/${areaId}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching locations in area ${areaId}:`, error);
    throw error;
  }
};
