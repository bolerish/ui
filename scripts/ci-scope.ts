import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";

export function browserScope(files: readonly string[]) {
  let ui = false;
  let docs = false;
  let allRoutes = false;
  const routes = new Set<string>();
  for (const file of files) {
    if (
      file === ".oxfmtrc.json" ||
      file === "README.md" ||
      (file.startsWith("skills/") && file.endsWith(".md"))
    )
      continue;
    const document = file.match(
      /^docs\/src\/docs\/_content\/(components|foundations|api)\/([a-z0-9-]+)\/docs\.mdx$/,
    );
    const guide = file.match(/^docs\/src\/docs\/_content\/guides\/([a-z0-9-]+)\.mdx$/);
    if (document) routes.add(`/docs/${document[1]}/${document[2]}`);
    else if (guide) routes.add(`/docs/${guide[1]}`);
    else allRoutes = true;
    if (file.startsWith("docs/") && /\.mdx?$/.test(file)) {
      docs = true;
    } else if (file.startsWith("packages/lint/") || file.startsWith("packages/docs-mcp/")) {
      // Docs consume the shared CSS diagnostics and agent references.
      docs = true;
    } else {
      // Shared packages, tooling and unknown paths require full coverage.
      ui = true;
      docs = true;
    }
  }
  return { ui, docs, routes: allRoutes ? [] : [...routes].sort() };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  let scope: ReturnType<typeof browserScope> = { ui: true, docs: true, routes: [] };
  let formatOnly = false;
  const event = process.env.EVENT_NAME;
  const base = process.env.BASE_SHA;
  const head = process.env.HEAD_SHA;
  if (event === "pull_request" || (event === "push" && base && !/^0+$/.test(base))) {
    if (!base || !head) throw new Error("Change scope requires BASE_SHA and HEAD_SHA");
    const files = execFileSync(
      "git",
      [
        "diff",
        "--name-only",
        "--no-renames",
        "-z",
        event === "pull_request" ? `${base}...${head}` : `${base}..${head}`,
      ],
      { encoding: "utf8" },
    )
      .split("\0")
      .filter(Boolean);
    scope = browserScope(files);
    formatOnly = files.length > 0 && files.every((file) => file === ".oxfmtrc.json");
  }
  console.log(`format_only=${formatOnly}`);
  for (const [name, value] of Object.entries(scope))
    console.log(`${name}=${JSON.stringify(value)}`);
}
