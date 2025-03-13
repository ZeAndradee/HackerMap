import axios from "axios";

const useApi = () => {
  // Use port 3000 for the API server
  const baseURL =
    import.meta.env?.VITE_API_URL || "https://hackermap-api.onrender.com";

  const api = axios.create({
    baseURL,
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

  return api;
};

export default useApi;
