import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: [
      {
        find: /^core$/,
        replacement: fileURLToPath(new URL("./src/core/index.ts", import.meta.url)),
      },
      {
        find: /^integrations$/,
        replacement: fileURLToPath(new URL("./src/integrations/index.ts", import.meta.url)),
      },
      {
        find: /^integrations\/(.*)$/,
        replacement: fileURLToPath(new URL("./src/integrations/$1", import.meta.url)),
      },
    ],
  },
  build: {
    emptyOutDir: true,
  },
});