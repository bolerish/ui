import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    ...(mode === "test"
      ? [
          {
            name: "preview-test-design-system",
            transform(code: string, id: string) {
              if (id === fileURLToPath(new URL("./src/design-systems/index.ts", import.meta.url))) {
                return `${code}\nimport { alternateSystem } from "/test/alternate-system.tsx";\ndesignSystems.fixture = alternateSystem;`;
              }
            },
          },
        ]
      : []),
  ],
  resolve: { dedupe: ["react", "react-dom", "@json-render/react", "@json-render/core"] },
  server: {
    host: "127.0.0.1",
    port: 3010,
    strictPort: true,
    fs: {
      strict: true,
      allow: [
        fileURLToPath(new URL(".", import.meta.url)),
        fileURLToPath(new URL("../../node_modules", import.meta.url)),
        fileURLToPath(new URL("../../packages/ui/dist", import.meta.url)),
        fileURLToPath(new URL("../../packages/json-render/dist", import.meta.url)),
      ],
    },
  },
}));
