import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3003,
    strictPort: true,
    proxy: { "/api": process.env.ADMIN_DEV_API_URL || "http://localhost:8888" },
  },
});
