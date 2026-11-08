import { readFileSync } from "node:fs";

import { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";

import { toolNames, type Catalog } from "./catalog.js";
import { checkCss } from "./check-css.js";
import { searchDocuments, relatedExamples } from "./search.js";
import { getSections } from "./sections.js";
const catalog: Catalog = JSON.parse(
  readFileSync(new URL("./documents.json", import.meta.url), "utf8"),
);

function textResult(value: Record<string, unknown>) {
  return {
    content: [
      { type: "text" as const, text: JSON.stringify({ ...value, bundle: catalog.bundle }) },
    ],
  };
}

export function createServer() {
  const server = new McpServer(
    { name: "bolerish-docs", version: catalog.version },
    {
      instructions:
        "Before composing or changing UI, read guides/agent-workflow with get_doc. Search related Foundations, exact component APIs and original examples before writing controls or styles. Prefer supported props and semantic tokens. Submit added or changed CSS blocks to check_css, follow nextOffset until null and review every diagnostic and unreviewed area, and run the consuming app checks. References are bundled at build time; installed package declarations take precedence. Tools do not establish rendered correctness or guarantee agent adherence.",
    },
  );
  server.registerTool(
    toolNames.search,
    {
      description:
        "Find bolerish components, exact API references, real examples, tokens and Foundations. Ranks text and supported Korean/English task phrases with matchReasons. Filter by section and paginate with limit/offset. An empty query lists documents; returns get_doc IDs and bundled package versions.",
      inputSchema: z.object({
        query: z.string().max(200).default(""),
        section: z
          .enum(["components", "foundations", "guides", "api", "tokens", "examples"])
          .optional(),
        limit: z.number().int().min(1).max(50).default(20),
        offset: z.number().int().min(0).default(0),
      }),
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    ({ query, section, limit, offset }) => {
      const matches = searchDocuments(catalog.documents, query, section);
      return textResult({
        packages: catalog.packages,
        total: matches.length,
        nextOffset: offset + limit < matches.length ? offset + limit : null,
        documents: matches.slice(offset, offset + limit).map(({ content, ...doc }) => ({
          ...doc,
          relatedExamples: relatedExamples(catalog.documents, doc.id),
          description: content
            .split("\n")
            .filter((line) => line.trim() && !line.startsWith("#"))
            .slice(0, 2)
            .join(" ")
            .slice(0, 240),
        })),
      });
    },
  );
  server.registerTool(
    toolNames.get,
    {
      description:
        "Read a bolerish reference by its exact search_docs ID: full content, view outline, or one heading ID. Includes original examples where available and bundle snapshot metadata; compare bundled versions with installed packages.",
      inputSchema: z.object({
        id: z.string().min(1).max(200),
        view: z.enum(["full", "outline"]).default("full"),
        heading: z.string().trim().min(1).optional(),
      }),
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    ({ id, view, heading }) => {
      const document = catalog.documents.find((doc) => doc.id === id);
      if (!document)
        return {
          ...textResult({ error: `Unknown document: ${id}. Use search_docs to find an ID.` }),
          isError: true,
        };
      const sections = getSections(document.content);
      if (heading && view === "outline")
        return {
          ...textResult({ error: "heading cannot be combined with outline" }),
          isError: true,
        };
      const selected = heading ? sections.find((section) => section.id === heading) : undefined;
      if (heading && !selected)
        return { ...textResult({ error: `Unknown heading: ${heading}` }), isError: true };
      const examples = relatedExamples(catalog.documents, id);
      if (view === "outline")
        return textResult({
          packages: catalog.packages,
          document: { ...document, content: undefined },
          sections: sections.map(({ start: _start, end: _end, ...section }) => section),
          relatedExamples: examples,
        });
      return textResult({
        packages: catalog.packages,
        relatedExamples: examples,
        document: selected
          ? { ...document, content: document.content.slice(selected.start, selected.end) }
          : document,
      });
    },
  );
  server.registerTool(
    toolNames.css,
    {
      description:
        "Inspect supplied CSS text for raw color, typography and spacing values using @bolerish/lint policies. Returns located diagnostics and explicitly unreviewed declarations. No file access, fixes, import loading or conformance certification. Submit full relevant blocks rather than only selected declarations.",
      inputSchema: z.object({
        css: z.string().min(1).max(100_000),
        limit: z.number().int().min(1).max(200).default(50),
        offset: z.number().int().min(0).default(0),
      }),
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    ({ css, limit, offset }) => {
      const result = checkCss(css);
      if ("error" in result)
        return { ...textResult({ packages: catalog.packages, ...result }), isError: true };
      const issues = [
        ...result.diagnostics.map((value) => ({ kind: "diagnostic" as const, value })),
        ...result.coverage.unreviewed.map((value) => ({ kind: "unreviewed" as const, value })),
      ].sort((a, b) => a.value.line - b.value.line || a.value.column - b.value.column);
      const page = issues.slice(offset, offset + limit);
      return textResult({
        packages: catalog.packages,
        totalIssues: issues.length,
        nextOffset: offset + limit < issues.length ? offset + limit : null,
        diagnosticsTotal: result.diagnostics.length,
        diagnostics: page.flatMap((issue) => (issue.kind === "diagnostic" ? [issue.value] : [])),
        coverage: {
          ...result.coverage,
          unreviewedTotal: result.coverage.unreviewed.length,
          unreviewed: page.flatMap((issue) => (issue.kind === "unreviewed" ? [issue.value] : [])),
        },
        limitations: result.limitations,
      });
    },
  );
  return server;
}
