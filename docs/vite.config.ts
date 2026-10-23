import { cloudflare } from "@cloudflare/vite-plugin";
import mdx from "@mdx-js/rollup";
import stylex from "@stylexjs/unplugin/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import reactCompiler from "babel-plugin-react-compiler";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { defineConfig } from "vite";

export default defineConfig({
  server: { port: 3000 },
  resolve: { dedupe: ["react", "react-dom", "@stylexjs/stylex"] },
  ssr: {
    optimizeDeps: {
      include: ["react", "react/jsx-runtime", "react/jsx-dev-runtime", "react-dom/server"],
    },
  },
  plugins: [
    {
      ...mdx({
        include: /\.mdx$/,
        exclude: /\?raw/,
        providerImportSource: "@mdx-js/react",
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug],
      }),
      enforce: "pre",
    },
    stylex({ useCSSLayers: true, babelConfig: { plugins: [reactCompiler] } } as Parameters<
      typeof stylex
    >[0]),
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tanstackStart(),
    react({ include: /\.[jt]sx?$|\.mdx$/ }),
  ],
});
