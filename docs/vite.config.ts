import { readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

import mdx from "@mdx-js/rollup";
import stylex from "@stylexjs/unplugin/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import reactCompiler from "babel-plugin-react-compiler";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { defineConfig } from "vite";

const markdownDependencies = ["react-markdown", "rehype-slug", "remark-gfm"];

const pages = ["/", "/ko"];
for (const section of ["guides", "components", "foundations"]) {
  const directory = new URL(`./src/app/(site)/docs/_content/${section}/`, import.meta.url);
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (
      section === "guides"
        ? entry.name.endsWith(".mdx")
        : entry.isDirectory() && existsSync(new URL(`${entry.name}/docs.mdx`, directory))
    ) {
      const path =
        section === "guides"
          ? `/docs/${entry.name.slice(0, -4)}`
          : `/docs/${section}/${entry.name}`;
      pages.push(path, `${path}/ko`);
    }
    if (entry.isDirectory() && section !== "guides") {
      for (const file of readdirSync(new URL(`${entry.name}/`, directory))) {
        if (section === "foundations" ? file.endsWith("Example.tsx") : file.endsWith(".tsx"))
          pages.push(`/preview/${entry.name}--${file.slice(0, -4)}`);
      }
    }
  }
}

export default defineConfig({
  server: { port: 3000 },
  preview: { host: "127.0.0.1" },
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
    dedupe: ["react", "react-dom", "@stylexjs/stylex"],
  },
  // Discover MDX-only imports before requests; SSR optimizer reloads can split React instances.
  optimizeDeps: { include: markdownDependencies },
  ssr: {
    optimizeDeps: {
      include: [
        "react",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "react-dom/server",
        ...markdownDependencies,
      ],
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
    // Keep shell media rules above shared component atoms in the cascade.
    stylex({ useCSSLayers: true, babelConfig: { plugins: [reactCompiler] } } as Parameters<
      typeof stylex
    >[0]),
    tanstackStart({
      router: {
        entry: "./app/router.tsx",
        routesDirectory: "app",
        generatedRouteTree: "app/routeTree.gen.ts",
        indexToken: "page",
        routeFileIgnorePattern:
          "(^|/)(_components|_lib|_content|_config)(/|$)|(^|/)(router[.]tsx|routeTree[.]gen[.]ts)$|[.](test|spec)[.]",
      },
      prerender: {
        enabled: true,
        autoStaticPathsDiscovery: false,
        crawlLinks: false,
        concurrency: 4,
        failOnError: true,
      },
      pages: [
        ...pages.map((path) => ({ path })),
        { path: "/404", prerender: { autoSubfolderIndex: false } },
      ],
    }),
    react({ include: /\.[jt]sx?$|\.mdx$/ }),
  ],
});
