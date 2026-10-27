import { readFileSync } from "node:fs";

import { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";

type Document = {
  id: string;
  section: string;
  title: string;
  url: string;
  content: string;
};
const catalog: { version: string; packages: Record<string, string>; documents: Document[] } =
  JSON.parse(readFileSync(new URL("./documents.json", import.meta.url), "utf8"));

function textResult(value: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(value) }] };
}

export function createServer() {
  const server = new McpServer(
    { name: "bolerish-docs", version: catalog.version },
    {
      instructions:
        "Search bolerish documentation before composing UI. Use get_doc with an ID from search_docs for exact APIs, examples and tokens. References are bundled at build time; the consumer's installed package declarations take precedence.",
    },
  );
  server.registerTool(
    "search_docs",
    {
      description:
        "Find bolerish components, exact API references, real examples, tokens and Foundations. An empty query lists documents. Returns IDs for get_doc and the bundled package versions.",
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
      const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
      const matches = catalog.documents.filter((doc) => {
        if (section && doc.section !== section) return false;
        const text = `${doc.id} ${doc.title} ${doc.content}`.toLowerCase();
        return terms.every((term) => text.includes(term));
      });
      return textResult({
        packages: catalog.packages,
        total: matches.length,
        nextOffset: offset + limit < matches.length ? offset + limit : null,
        documents: matches.slice(offset, offset + limit).map(({ content, ...doc }) => ({
          ...doc,
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
    "get_doc",
    {
      description:
        "Read a complete bolerish reference by its exact search_docs ID, including original example source or token definitions where available. Check bundled versions against the installed package.",
      inputSchema: z.object({ id: z.string().min(1).max(200) }),
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    ({ id }) => {
      const document = catalog.documents.find((doc) => doc.id === id);
      if (!document)
        return {
          ...textResult({ error: `Unknown document: ${id}. Use search_docs to find an ID.` }),
          isError: true,
        };
      return textResult({ packages: catalog.packages, document });
    },
  );
  return server;
}
