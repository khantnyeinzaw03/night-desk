import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const api = process.env.API_PROXY_TARGET ?? "http://localhost:3000";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    watch: {
      usePolling: process.env.CHOKIDAR_USEPOLLING === "1",
    },
    proxy: {
      "/scrape": api,
      "/health": api,
    },
  },
});
