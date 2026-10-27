import postcss, { type Root } from "postcss";

/** Reuse compiled values while keeping explicit StyleX themes in control. */
export function addThemeSelectors(css: string, themes: Record<"light" | "dark", string>) {
  const root = postcss.parse(css);
  for (const mode of ["light", "dark"] as const) {
    const classes = themes[mode].split(/\s+/).filter(Boolean);
    const found = new Set<string>();
    root.walkRules((rule) => {
      // StyleX emits standalone or repeated class selectors, optionally on :root.
      const matches = classes.filter((name) =>
        rule.selectors.some((selector) =>
          [`.${name}`, `.${name}:root`, `.${name}.${name}`, `.${name}.${name}:root`].includes(
            selector,
          ),
        ),
      );
      if (!matches.length) return;
      for (const name of matches) found.add(name);
      const attribute = `[data-bolerish-theme="${mode}"]`;
      rule.selectors = [...rule.selectors, attribute, `${attribute}:root`];
    });
    if (!classes.length || classes.some((name) => !found.has(name))) {
      throw new Error(`Missing compiled ${mode} theme rules`);
    }
  }
  return moveVariables(root).toString();
}

export function layerVariables(css: string) {
  return moveVariables(postcss.parse(css)).toString();
}

function moveVariables(root: Root) {
  // Precompiled variables must not outrank the consumer's layered StyleX themes.
  const variables = postcss.atRule({ name: "layer", params: "priority1" });
  root.each((node) => {
    if (
      node.type !== "rule" &&
      !(node.type === "atrule" && ["media", "supports"].includes(node.name))
    )
      return;
    let count = 0;
    let onlyVariables = true;
    node.walkDecls((decl) => {
      count++;
      if (!decl.prop.startsWith("--")) onlyVariables = false;
    });
    if (count && onlyVariables) variables.append(node);
  });
  if (variables.nodes?.length) root.append(variables);
  return root;
}
