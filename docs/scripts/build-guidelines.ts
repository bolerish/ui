import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";

import { searchText, type SearchDocument } from "../src/shared/lib/search.ts";
import { siteOrigin } from "../src/shared/lib/site.ts";
import { guideMarkdown } from "./guide-markdown.ts";

const source = new URL("../src/app/(site)/docs/_content/foundations/", import.meta.url);
const output = new URL("../public/", import.meta.url);
const checking = process.argv.includes("--check");
if (!checking) await rm(new URL("llms-full.en.txt", output), { force: true });
async function emitFile(path: URL, content: string) {
  if (checking) {
    const actual = await readFile(path, "utf8");
    if (actual !== content) throw new Error(`Generated documentation is stale: ${path.pathname}`);
    return;
  }
  await writeFile(path, content);
}

async function readPage(directory: URL, suffix: string) {
  const page = await readFile(new URL("docs.mdx", directory), "utf8");
  const locale = suffix ? "en" : "ko";
  // shortcut: blocks contain static Markdown only; use an MDX parser if they gain expressions.
  const sections = page
    .split(`<LocaleContent locale="${locale}">\n`)
    .slice(1)
    .map((block) => {
      const end = block.indexOf("\n</LocaleContent>");
      if (end < 0) throw new Error(`Unclosed locale block: ${directory.pathname}`);
      return block.slice(0, end).trim();
    });
  if (sections.length !== 2 || !sections[0].startsWith("# ") || !sections[1])
    throw new Error(`Expected overview and usage blocks for ${locale}: ${directory.pathname}`);
  return { overview: sections[0], content: `${sections.join("\n\n")}\n` };
}

const order = JSON.parse(await readFile(new URL("order.json", source), "utf8"));
const components = new URL("../src/app/(site)/docs/_content/components/", import.meta.url);
const componentNames = (await readdir(components)).sort();
const apiSource = new URL("../src/app/(site)/docs/_content/api/", import.meta.url);
const apiNames = (await readdir(apiSource, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();
const guideSource = new URL("../src/app/(site)/docs/_content/guides/", import.meta.url);
const guides = (await readdir(guideSource)).filter((name) => name.endsWith(".mdx")).sort();
const guideOutput = new URL("guides/", output);
if (!checking) {
  await rm(guideOutput, { recursive: true, force: true });
  await mkdir(guideOutput, { recursive: true });
}
const guideLinks: string[] = [];
const englishGuides: string[] = [];
for (const file of guides) {
  const slug = file.slice(0, -4);
  const content = await readFile(new URL(file, guideSource), "utf8");
  for (const locale of ["en", "ko"] as const) {
    const markdown = guideMarkdown(content, locale, file);
    const name = `${slug}${locale === "en" ? ".en" : ""}.md`;
    await emitFile(new URL(name, guideOutput), markdown);
    if (locale === "en") {
      guideLinks.push(`- [${markdown.split("\n")[0].slice(2)}](./guides/${name})`);
      englishGuides.push(markdown);
    }
  }
}
const documentPaths = [
  ...guides.map((file) => `/docs/${file.slice(0, -4)}`),
  ...order.map(({ slug }: { slug: string }) => `/docs/foundations/${slug}`),
  ...componentNames.map((slug) => `/docs/components/${slug}`),
  ...apiNames.map((slug) => `/docs/api/${slug}`),
];
await emitFile(
  new URL("robots.txt", output),
  `User-agent: *\nAllow: /\nSitemap: ${siteOrigin}/sitemap.xml\n`,
);
await emitFile(
  new URL("sitemap.xml", output),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[
    "/",
    "/ko",
    ...documentPaths.flatMap((path) => [path, `${path}/ko`]),
  ]
    .map((path) => `  <url><loc>${siteOrigin}${path}</loc></url>`)
    .join("\n")}\n</urlset>\n`,
);
const links: string[] = [];
const apiOutput = new URL("api/", output);
if (!checking) await rm(apiOutput, { recursive: true, force: true });
if (!checking) await mkdir(apiOutput, { recursive: true });
const sourceLinks: string[] = [];
for (const [label, directory, names] of [
  [
    "tokens",
    new URL("../../packages/tokens/src/", import.meta.url),
    ["semantic.stylex.ts", "density.stylex.ts", "themes.stylex.ts"],
  ],
  [
    "shared-types",
    new URL("../../packages/ui/src/", import.meta.url),
    ["styles/control-layout.ts", "typography.ts", "theme.ts", "gradient.ts", "surface.ts"],
  ],
] as const) {
  for (const name of names) {
    const content = await readFile(new URL(name, directory), "utf8");
    const fileName = `${label}-${name.split("/").at(-1)}.md`;
    await emitFile(
      new URL(fileName, apiOutput),
      `# ${name}\n\nGenerated from the current @bolerish/ui checkout. The installed package declarations take precedence.\n\n\`\`\`ts\n${content}\`\`\`\n`,
    );
    sourceLinks.push(`- [${label}: ${name}](./api/${fileName})`);
  }
}
const installation = await readFile(new URL("../../README.md", import.meta.url), "utf8");
await emitFile(new URL("installation.md", output), installation);
const catalog: string[] = [];
catalog.push(
  "- [p](../api/paragraph.en.md): Compatibility alias for Paragraph. Use Paragraph in new code.",
);

if (!checking) await rm(new URL("guidelines/", output), { recursive: true, force: true });
if (!checking) await mkdir(new URL("guidelines/", output), { recursive: true });
for (const locale of ["ko", "en"]) {
  const suffix = locale === "ko" ? "" : ".en";
  const entries = locale === "en" ? [...englishGuides] : [];
  const search: SearchDocument[] = [];
  for (const file of guides) {
    const content = guideMarkdown(
      await readFile(new URL(file, guideSource), "utf8"),
      locale as "en" | "ko",
      file,
    );
    search.push({
      section: "guide",
      slug: file.slice(0, -4),
      title: content.split("\n")[0].slice(2),
      text: searchText(content.replace(/^# .*\n/, "")),
    });
  }
  for (const { slug } of order) {
    const content = await readFile(
      new URL(`${slug}/guidelines${locale === "ko" ? ".kr" : ""}.md`, source),
      "utf8",
    );
    const title = content.split("\n")[0].slice(2);
    search.push({
      section: "foundations",
      slug,
      title,
      text: searchText(content.replace(/^# .*\n/, "")),
    });
    entries.push(content);
    if (locale === "en") links.push(`- [${title}](./guidelines/${slug}${suffix}.md)`);
    await emitFile(new URL(`guidelines/${slug}${suffix}.md`, output), content);
  }
  for (const slug of apiNames) {
    const content = await readFile(
      new URL(`${slug}/reference${locale === "ko" ? ".kr" : ""}.md`, apiSource),
      "utf8",
    );
    const title = content.split("\n")[0].slice(2);
    search.push({ section: "api", slug, title, text: searchText(content.replace(/^# .*\n/, "")) });
    entries.push(content);
    await emitFile(new URL(`${slug}${suffix}.md`, apiOutput), content);
    if (locale === "en") sourceLinks.push(`- [${title} API](./api/${slug}${suffix}.md)`);
  }
  for (const slug of componentNames) {
    const { overview, content } = await readPage(new URL(`${slug}/`, components), suffix);
    const title = overview.split("\n")[0].slice(2);
    search.push({
      section: "components",
      slug,
      title,
      text: searchText(content.replace(/^# .*\n/, "")),
    });
    const componentSource = await readFile(
      new URL(`../../packages/ui/src/${slug}.tsx`, import.meta.url),
      "utf8",
    );
    const apiFile = `${slug}${suffix}.md`;
    const reference = `${content}\n## Installed API reference\n\nThis source is exported from the current checkout. Read the declarations in your installed package before using it.\n\n\`\`\`tsx\n${componentSource}\`\`\`\n`;
    await emitFile(new URL(apiFile, apiOutput), reference);
    if (locale === "en") sourceLinks.push(`- [${title} API](./api/${apiFile})`);
    if (locale === "en")
      catalog.push(
        `- [${slug}](../api/${apiFile}): ${
          overview
            .trim()
            .split("\n")
            .find((line, index) => index > 0 && line.trim()) ?? title
        }`,
      );
    entries.push(content);
    if (locale === "en") links.push(`- [${title}](./guidelines/${slug}${suffix}.md)`);
    await emitFile(new URL(`guidelines/${slug}${suffix}.md`, output), content);
  }
  if (locale === "en") {
    const full = entries.join("\n\n---\n\n");
    await emitFile(new URL("llms-full.txt", output), full);
  }
  await emitFile(new URL(`search.${locale}.json`, output), JSON.stringify(search));
}
await emitFile(
  new URL("llms.txt", output),
  [
    "# @bolerish/ui",
    "",
    "> Read these rules before composing screens with @bolerish/ui. Verify component APIs against the installed source.",
    "",
    "## Package guides",
    ...guideLinks,
    "",
    "## Reference",
    "- [Installation and appearance defaults](./installation.md)",
    "- [Generated agent skill](./agent/SKILL.md)",
    "- [Complete guidelines](./llms-full.txt)",
    "- [LLM usage guide](./bolerish-for-llms.md)",
    "",
    "## Foundations and components",
    ...links,
    "",
    "## Exact API and token source",
    ...sourceLinks,
    "",
  ].join("\n"),
);
if (!checking) await mkdir(new URL("agent/", output), { recursive: true });
await emitFile(
  new URL("agent/SKILL.md", output),
  [
    "---",
    "name: bolerish",
    "description: Use installed @bolerish/ui React and StyleX components before building custom UI. Read local source contracts and generated references for controls, spacing, density, fonts and motion.",
    "---",
    "",
    "# @bolerish/ui",
    "",
    "Generated from canonical component documentation. Do not edit this file by hand.",
    "",
    "1. Import installed components from @bolerish/ui and load @bolerish/ui/global.css once. Set data-bolerish-theme=light or dark on html for precompiled light/dark themes. No StyleX compiler is needed for this path.",
    "2. Check the catalog before writing a new control. Read the linked reference and the installed props; never infer shadcn/Base UI size, variant or style APIs.",
    "Preserve installed use client directives for interactive components in RSC apps; do not move DOM effects to server execution.",
    "3. Use the [installation guide](../installation.md) for package themes and optional StyleX extensions. Runtime end-user fonts and motion take precedence; respect OS reduced motion unless the end user explicitly selects on.",
    "4. Read [spacing](../guidelines/spacing.en.md) and [state](../guidelines/state.en.md) before composing the UI. Keep product data and domain layout in the app.",
    "5. Verify local TypeScript, CSS compilation and the actual consumer interaction. Finding a reference does not prove installed-version compatibility.",
    "",
    "## APIs",
    "",
    ...apiNames.map((slug) => `- [${slug}](../api/${slug}.en.md)`),
    "",
    "## Components",
    "",
    ...catalog,
    "",
  ].join("\n"),
);
await emitFile(
  new URL("bolerish-for-llms.md", output),
  `# @bolerish/ui usage guide for coding agents\n\nGenerated from canonical English documentation and current source.\n\nRead the [agent workflow](./agent/SKILL.md), [installation guide](./installation.md) and [complete guidelines](./llms-full.txt). Check the installed source before using any props; the package ships compiled components and CSS, with data-bolerish-theme=light or dark on html selecting the built-in theme. Runtime user preferences take precedence over app defaults.\n\nUse the [spacing roles](./guidelines/spacing.en.md) and exact component API references linked from [the index](./llms.txt). Preserve keyboard access, focus and disabled boundaries. Respect OS reduced motion unless the end user explicitly selects on.\n`,
);
console.log(
  checking
    ? "Generated @bolerish/ui documentation is current."
    : "Exported localized user guidelines and canonical English agent references.",
);
