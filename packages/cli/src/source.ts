import { parse } from "@babel/parser";
import { traverseFast, type ArrayExpression, type Statement } from "@babel/types";

const parserOptions = { sourceType: "module", plugins: ["typescript", "jsx"] } as const;

export function parseSource(source: string) {
  return parse(source, { ...parserOptions, tokens: true, plugins: [...parserOptions.plugins] });
}

type StylexImport = { name: string; direct: boolean };

function getViteImports(body: readonly Statement[]) {
  const defineConfigNames = new Set<string>();
  const stylexImports: StylexImport[] = [];
  for (const node of body) {
    if (node.type !== "ImportDeclaration") continue;
    if (node.source.value === "vite") {
      for (const specifier of node.specifiers) {
        if (specifier.type !== "ImportSpecifier") continue;
        if (specifier.imported.type !== "Identifier") continue;
        if (specifier.imported.name !== "defineConfig") continue;
        defineConfigNames.add(specifier.local.name);
      }
      continue;
    }
    if (
      node.source.value !== "@stylexjs/unplugin" &&
      node.source.value !== "@stylexjs/unplugin/vite"
    )
      continue;
    for (const specifier of node.specifiers) {
      if (specifier.type !== "ImportDefaultSpecifier") continue;
      stylexImports.push({
        name: specifier.local.name,
        direct: node.source.value.endsWith("/vite"),
      });
    }
  }
  return { defineConfigNames, stylexImports };
}

function hasStylexCompiler(plugins: ArrayExpression, imports: readonly StylexImport[]) {
  for (const node of plugins.elements) {
    if (node?.type !== "CallExpression") continue;
    const callee = node.callee;
    if (callee.type === "Identifier") {
      if (imports.some((binding) => binding.direct && binding.name === callee.name)) return true;
      continue;
    }
    if (callee.type !== "MemberExpression" || callee.computed) continue;
    if (callee.object.type !== "Identifier") continue;
    if (callee.property.type !== "Identifier" || callee.property.name !== "vite") continue;
    const name = callee.object.name;
    if (imports.some((binding) => !binding.direct && binding.name === name)) return true;
  }
  return false;
}

export function inspectViteConfig(source: string) {
  const file = parseSource(source);
  const { defineConfigNames, stylexImports } = getViteImports(file.program.body);
  const exported = file.program.body.find((node) => node.type === "ExportDefaultDeclaration");
  if (!exported || exported.type !== "ExportDefaultDeclaration") return undefined;

  let config = exported.declaration;
  if (config.type === "CallExpression" && config.arguments.length === 1) {
    const { callee } = config;
    if (callee.type !== "Identifier" || !defineConfigNames.has(callee.name)) return undefined;
    const argument = config.arguments[0];
    if (argument.type !== "ObjectExpression") return undefined;
    config = argument;
  }
  if (config.type !== "ObjectExpression") return undefined;

  let plugins: ArrayExpression | undefined;
  for (const property of config.properties) {
    if (property.type === "SpreadElement" || property.computed) return undefined;
    if (property.type !== "ObjectProperty") continue;
    const key = property.key;
    const isPlugins =
      (key.type === "Identifier" && key.name === "plugins") ||
      (key.type === "StringLiteral" && key.value === "plugins");
    if (!isPlugins) continue;
    if (plugins || property.value.type !== "ArrayExpression") return undefined;
    plugins = property.value;
  }
  if (!plugins) return undefined;
  return {
    plugins,
    imports: stylexImports,
    hasCompiler: hasStylexCompiler(plugins, stylexImports),
  };
}

export function configureVite(source: string) {
  const inspected = inspectViteConfig(source);
  if (!inspected || inspected.plugins.elements.some((node) => node?.type === "SpreadElement")) {
    throw new Error(
      "Could not safely update the Vite plugins array. Add the StyleX compiler manually.",
    );
  }
  if (inspected.hasCompiler) return source;
  const binding = inspected.imports[0];
  // An unused name avoids colliding with a user variable or an existing import.
  let name = "bolerishStylex";
  while (source.includes(name)) name += "_";
  let factory = `${name}.vite`;
  if (binding) factory = binding.direct ? binding.name : `${binding.name}.vite`;
  const plugin = `${factory}({ unstable_moduleResolution: { type: "commonJS" } })`;
  const offset = inspected.plugins.start! + 1;
  const configured =
    source.slice(0, offset) +
    plugin +
    (inspected.plugins.elements.length ? ", " : "") +
    source.slice(offset);
  const result = binding ? configured : `import ${name} from "@stylexjs/unplugin";\n${configured}`;
  parseSource(result);
  return result;
}

export function removeReducedMotionStyles(source: string) {
  const file = parseSource(source);
  const removals: { start: number; end: number }[] = [];
  traverseFast(file, (node) => {
    if (
      node.type !== "ObjectProperty" ||
      node.computed ||
      node.key.type !== "StringLiteral" ||
      node.key.value !== "@media (prefers-reduced-motion: reduce)"
    )
      return;
    const start = node.start!;
    let end = node.end!;
    const nextToken = file.tokens?.find(
      (token) => token.start >= end && typeof token.type !== "string",
    );
    if (nextToken && source.slice(nextToken.start, nextToken.end) === ",") end = nextToken.end;
    removals.push({ start, end });
  });
  // Keep outer ranges first so nested rules are removed with their parent.
  const outerRemovals: typeof removals = [];
  let coveredEnd = -1;
  for (const removal of removals.sort((a, b) => a.start - b.start)) {
    if (removal.end <= coveredEnd) continue;
    outerRemovals.push(removal);
    coveredEnd = removal.end;
  }
  let result = source;
  let boundary = source.length;
  for (const removal of outerRemovals.reverse()) {
    if (removal.end > boundary) continue;
    result = result.slice(0, removal.start) + result.slice(removal.end);
    boundary = removal.start;
  }
  parseSource(result);
  return result;
}
