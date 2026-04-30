import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: process.env.VERCEL ? "/" : "/Focus-Tracker/",
  build: {
    cssMinify: false,
  },
  plugins: [react()],
});
