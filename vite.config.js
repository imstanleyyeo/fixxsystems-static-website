import { defineConfig } from "vite";
import legacy from "@vitejs/plugin-legacy";
import viteImagemin from "vite-plugin-imagemin";
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Automatically scan the 'src' folder for all .html files so you never have to list them manually
const srcDir = resolve(__dirname, 'src');
const htmlFiles = fs.readdirSync(srcDir).filter(file => file.endsWith('.html'));

const inputEntries = {};
htmlFiles.forEach(file => {
  const name = file.replace(/\.html$/, '');
  inputEntries[name] = resolve(srcDir, file);
});

export default defineConfig({
  root: "src",
  publicDir: "../public",
  base: "./",
  build: {
    rollupOptions: {
      input: inputEntries,
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