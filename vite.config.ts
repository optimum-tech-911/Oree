import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./app"),
    },
  },
  server: {
    host: true,
    port: 5173,
  },
  preview: {
    host: true,
    port: 4173,
  },
  build: {
    target: "es2022",
    sourcemap: true,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            { name: "react-core", test: /node_modules\/(react|react-dom|react-router|react-router-dom)\// },
            { name: "supabase", test: /node_modules\/(@supabase|ws)\// },
            { name: "motion", test: /node_modules\/(motion|framer-motion)\// },
            { name: "query", test: /node_modules\/@tanstack\/react-query\// },
          ],
        },
      },
    },
  },
});
