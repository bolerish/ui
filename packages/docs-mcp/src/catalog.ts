import { createHash } from "node:crypto";
export const toolNames = { search: "search_docs", get: "get_doc", css: "check_css" } as const;
export type CatalogDocument = {
  id: string;
  section: string;
  title: string;
  url: string;
  content: string;
};
export type Catalog = {
  version: string;
  packages: Record<string, string>;
  documents: CatalogDocument[];
  bundle: ReturnType<typeof createBundle>;
};
export function createBundle(
  version: string,
  packages: Record<string, string>,
  documents: CatalogDocument[],
) {
  return {
    schemaVersion: 1,
    contentHash: createHash("sha256")
      .update(JSON.stringify({ version, packages, documents }))
      .digest("hex"),
    documentCount: documents.length,
    tools: Object.values(toolNames),
  };
}
