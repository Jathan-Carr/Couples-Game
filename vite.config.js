import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  server: {
    host: true,
    port: 4721,
    strictPort: true,
    warmup: {
      clientFiles: ["./src/main.js", "./src/js/app.js", "./src/js/questions.js", "./src/css/main.css"],
    },
  },
  preview: {
    host: true,
    port: 4721,
    strictPort: true,
  },
});
