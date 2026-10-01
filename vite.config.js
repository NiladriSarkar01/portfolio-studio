import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      // All /api calls forwarded to Spring Boot
      "/api": {
        target: "https://portfolio-studio-backend.onrender.com",
        changeOrigin: true,
      },
    },
  },
});
