import axios from "axios";

const API_URL = "/api";

/**
 * Service for handling Area-related API operations
 */
const AreaService = {
  /**
   * Get all areas from the database
   * @returns {Promise<Array>} Array of area objects
   */
  getAllAreas: async () => {
    try {
      const response = await axios.get(`${API_URL}/areas`);
      return response.data;
    } catch (error) {
      console.error("Error fetching areas:", error);
      throw error;
    }
  },

  /**
   * Get a single area by ID
   * @param {string} id - The ID of the area to retrieve
   * @returns {Promise<Object>} Area object
   */
  getAreaById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/areas/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching area ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new area in the database
   * @param {Object} areaData - Data for the new area
   * @returns {Promise<Object>} Newly created area object
   */
  saveArea: async (areaData) => {
    try {
      const response = await axios.post(`${API_URL}/areas`, areaData);
      return response.data;
    } catch (error) {
      console.error("Error saving area:", error);
      throw error;
    }
  },

  /**
   * Update an existing area
   * @param {string} id - The ID of the area to update
   * @param {Object} areaData - The updated area data
   * @returns {Promise<Object>} Updated area object
   */
  updateArea: async (id, areaData) => {
    try {
      const response = await axios.put(`${API_URL}/areas/${id}`, areaData);
      return response.data;
    } catch (error) {
      console.error(`Error updating area ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete an area (soft delete)
   * @param {string} id - The ID of the area to delete
   * @returns {Promise<Object>} Result of the operation
   */
  deleteArea: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/areas/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting area ${id}:`, error);
      throw error;
    }
  },

  /**
   * Find areas that contain a specific point
   * @param {Array} coordinates - [longitude, latitude] of the point
   * @returns {Promise<Array>} Array of areas containing the point
   */
  findAreasContainingPoint: async (coordinates) => {
    try {
      const [longitude, latitude] = coordinates;
      const response = await axios.get(`${API_URL}/areas/point`, {
        params: { longitude, latitude },
      });
      return response.data;
    } catch (error) {
      console.error("Error finding areas for point:", error);
      throw error;
    }
  },
};

export default AreaService;
