import { basename } from "node:path";

import type { Plugin } from "vite";

import { layerVariables } from "../../packages/ui/scripts/theme-selectors.ts";

/** Keep consumer defineVars defaults below explicit attribute and StyleX themes. */
export function layerStylexVariables(): Plugin {
  const replacements = new Map<string, string>();
  return {
    name: "layer-stylex-variables",
    apply: "build",
    generateBundle: {
      order: "post",
      handler(_, bundle) {
        for (const asset of Object.values(bundle)) {
          if (asset.type !== "asset" || !asset.fileName.endsWith(".css")) continue;
          const source =
            typeof asset.source === "string" ? asset.source : Buffer.from(asset.source).toString();
          const css = layerVariables(source);
          if (css === source) continue;
          const reference = this.emitFile({
            type: "asset",
            name: asset.names[0] ?? basename(asset.fileName),
            source: css,
          });
          const name = this.getFileName(reference);
          replacements.set(asset.fileName, name);
          delete bundle[asset.fileName];
        }
        // SSR also embeds CSS URLs; keep its first-paint links on the same asset.
        for (const [previous, name] of replacements) {
          for (const output of Object.values(bundle)) {
            if (output.type === "chunk") {
              output.code = output.code.replaceAll(previous, name);
              const importedCss = output.viteMetadata?.importedCss;
              if (importedCss?.delete(previous)) importedCss.add(name);
            } else if (typeof output.source === "string") {
              output.source = output.source.replaceAll(previous, name);
            }
          }
        }
      },
    },
  };
}

/** StyleX serves development CSS directly, bypassing Vite's CSS transforms. */
export function layerDevelopmentStylexVariables(): Plugin {
  return {
    name: "layer-development-stylex-variables",
    apply: "serve",
    enforce: "pre",
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        if (request.url?.split("?")[0] !== "/virtual:stylex.css") return next();
        const end = response.end.bind(response);
        response.end = ((chunk: unknown, ...args: unknown[]) => {
          const css = typeof chunk === "string" ? layerVariables(chunk) : chunk;
          return (end as (...values: unknown[]) => typeof response)(css, ...args);
        }) as typeof response.end;
        next();
      });
    },
  };
}
