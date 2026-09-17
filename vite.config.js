import { defineConfig } from "vite";
import legacy from "@vitejs/plugin-legacy";
import viteImagemin from "vite-plugin-imagemin";

export default defineConfig({
  root: "src",
  publicDir: "../public",
  base: "./",
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
      },
    },
    outDir: "../dist",
    emptyOutDir: true,
  },
  css: {
    preprocessorOptions: {
      scss: {},
    },
  },
  plugins: [
    legacy(),
    viteImagemin({
      mozjpeg: { quality: 75 },
      pngquant: { quality: [0.7, 0.9] },
      svgo: {
        plugins: [
          { name: "removeViewBox", active: false },
          { name: "cleanupIDs", active: true },
        ],
      },
    }),
  ],
});
