import { execFileSync } from "node:child_process";
import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import type { SearchDocument } from "../../../docs/src/shared/lib/search.ts";

const root = new URL("../../../", import.meta.url);
const publicRoot = new URL("docs/public/", root);
const output = new URL("../dist/", import.meta.url);
execFileSync(
  process.execPath,
  ["--experimental-strip-types", fileURLToPath(new URL("docs/scripts/build-guidelines.ts", root))],
  { stdio: "inherit" },
);

const manifest = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
const packages: Record<string, string> = {};
for (const name of ["ui", "tokens", "lint"]) {
  const pkg = JSON.parse(await readFile(new URL(`packages/${name}/package.json`, root), "utf8"));
  packages[pkg.name] = pkg.version;
}
const documents: {
  id: string;
  section: string;
  title: string;
  url: string;
  content: string;
}[] = [];
const search: SearchDocument[] = JSON.parse(
  await readFile(new URL("search.en.json", publicRoot), "utf8"),
);
for (const entry of search) {
  let section = entry.section;
  let path = `api/${entry.slug}.en.md`;
  if (section === "guide") {
    section = "guides";
    path = `guides/${entry.slug}.en.md`;
  } else if (section === "foundations") path = `guidelines/${entry.slug}.en.md`;
  const page = section === "guides" ? entry.slug : `${section}/${entry.slug}`;
  documents.push({
    id: `${section}/${entry.slug}`,
    section,
    title: entry.title,
    url: `${manifest.homepage}/docs/${page}`,
    content: await readFile(new URL(path, publicRoot), "utf8"),
  });
  if (section !== "components") continue;
  const directory = new URL(`docs/src/app/(site)/docs/_content/components/${entry.slug}/`, root);
  for (const filename of (await readdir(directory)).sort()) {
    if (!filename.endsWith(".tsx") || filename.endsWith(".test.tsx")) continue;
    const name = filename.slice(0, -4);
    const source = await readFile(new URL(filename, directory), "utf8");
    documents.push({
      id: `examples/${entry.slug}/${name}`,
      section: "examples",
      title: `${entry.title}: ${name}`,
      url: `${manifest.homepage}/preview/${entry.slug}--${name}`,
      content: `# ${entry.title}: ${name}\n\nSource: docs/src/app/(site)/docs/_content/components/${entry.slug}/${filename}\n\n\`\`\`tsx\n${source}\`\`\`\n`,
    });
  }
}
for (const name of ["semantic", "density", "themes"]) {
  documents.push({
    id: `tokens/${name}`,
    section: "tokens",
    title: `${name} tokens`,
    url: `${manifest.homepage}/api/tokens-${name}.stylex.ts.md`,
    content: await readFile(new URL(`api/tokens-${name}.stylex.ts.md`, publicRoot), "utf8"),
  });
}
for (const filename of (await readdir(new URL("api/", publicRoot))).sort()) {
  if (!filename.startsWith("shared-types-") || !filename.endsWith(".md")) continue;
  const content = await readFile(new URL(`api/${filename}`, publicRoot), "utf8");
  documents.push({
    id: `api/${filename.replace(/\.(ts|tsx)\.md$/, "")}`,
    section: "api",
    title: content.split("\n")[0].slice(2),
    url: `${manifest.homepage}/api/${filename}`,
    content,
  });
}
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await writeFile(
  new URL("documents.json", output),
  JSON.stringify({
    version: manifest.version,
    packages,
    documents,
  }),
);
