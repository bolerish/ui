import { fileURLToPath } from "node:url";

import stylex from "@stylexjs/unplugin/vite";
import { defineConfig } from "vite";

export default defineConfig({
  build: { outDir: fileURLToPath(new URL("./.browser-dist/", import.meta.url)), emptyOutDir: true },
  plugins: [stylex({ useCSSLayers: false })],
  publicDir: fileURLToPath(new URL("../../docs/public/", import.meta.url)),
  optimizeDeps: { exclude: ["@bolerish/tokens"] },
  root: fileURLToPath(new URL("./test/browser/", import.meta.url)),
  resolve: { dedupe: ["react", "react-dom", "@stylexjs/stylex"] },
  server: { fs: { allow: [fileURLToPath(new URL("../../", import.meta.url))] } },
});
