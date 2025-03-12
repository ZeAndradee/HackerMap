import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Add server proxy configuration for API requests
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000", // Adjust this if your backend runs on a different port
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
