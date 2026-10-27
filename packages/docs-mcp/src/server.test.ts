import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { Client } from "@modelcontextprotocol/client";
import { StdioClientTransport } from "@modelcontextprotocol/client/stdio";

test("stdio tools find and return bundled references outside the checkout", async (t) => {
  const client = new Client({ name: "bolerish-test", version: "1.0.0" });
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [process.env.MCP_TEST_CLI ?? fileURLToPath(new URL("../dist/cli.js", import.meta.url))],
    cwd: tmpdir(),
    stderr: "pipe",
  });
  t.after(() => client.close());
  await client.connect(transport);
  const { tools } = await client.listTools();
  assert.deepEqual(tools.map(({ name }) => name).sort(), ["get_doc", "search_docs"]);
  assert.ok(tools.every(({ annotations }) => annotations?.readOnlyHint === true));

  async function call(name: string, args: Record<string, unknown>) {
    const result = await client.callTool({ name, arguments: args });
    assert.notEqual(result.isError, true, JSON.stringify(result.content));
    const block = result.content[0];
    assert.equal(block.type, "text");
    if (block.type !== "text") throw new Error("Expected a text response");
    return JSON.parse(block.text);
  }

  await t.test(
    "search intersects terms, filters sections and reports truncated totals",
    async () => {
      const result = await call("search_docs", { query: "  BuTtOn  ", section: "components" });
      assert.ok(result.documents.some(({ id }: { id: string }) => id === "components/button"));
      assert.ok(
        result.documents.every(({ section }: { section: string }) => section === "components"),
      );
      const none = await call("search_docs", { query: "button zzz-no-matching-document" });
      assert.equal(none.total, 0);
      assert.deepEqual(none.documents, []);
      const limited = await call("search_docs", { limit: 1 });
      assert.equal(limited.documents.length, 1);
      assert.ok(limited.total > 1);
      assert.equal(limited.nextOffset, 1);
      const next = await call("search_docs", { limit: 1, offset: limited.nextOffset });
      assert.equal(next.total, limited.total);
      assert.equal(next.documents.length, 1);
      assert.notEqual(next.documents[0].id, limited.documents[0].id);
      const end = await call("search_docs", { offset: limited.total });
      assert.deepEqual(end.documents, []);
      assert.equal(end.nextOffset, null);
    },
  );

  await t.test("component API, tokens and examples retain their canonical content", async () => {
    const button = await call("get_doc", { id: "components/button" });
    const reference = await readFile(
      new URL("../../../docs/public/api/button.en.md", import.meta.url),
      "utf8",
    );
    assert.equal(button.document.content, reference);
    assert.equal(button.document.url, "https://ui.bolerish.com/docs/components/button");
    const ui = JSON.parse(
      await readFile(new URL("../../ui/package.json", import.meta.url), "utf8"),
    );
    assert.equal(button.packages["@bolerish/ui"], ui.version);
    const token = await call("get_doc", { id: "tokens/semantic" });
    const tokenSource = await readFile(
      new URL("../../tokens/src/semantic.stylex.ts", import.meta.url),
      "utf8",
    );
    assert.ok(token.document.content.includes(tokenSource));
    const example = await call("get_doc", { id: "examples/button/Default" });
    const exampleSource = await readFile(
      new URL(
        "../../../docs/src/app/(site)/docs/_content/components/button/Default.tsx",
        import.meta.url,
      ),
      "utf8",
    );
    assert.ok(example.document.content.includes(exampleSource));
    for (const id of [
      "foundations/spacing",
      "guides/installation",
      "api/surface",
      "api/shared-types-control-layout",
    ]) {
      const result = await call("get_doc", { id });
      assert.ok(result.document.content.startsWith("# "), id);
    }
  });

  await t.test("unknown IDs and invalid input fail without breaking later requests", async () => {
    for (const [name, args] of [
      ["get_doc", { id: "../../package.json" }],
      ["get_doc", { id: "components/missing" }],
      ["get_doc", {}],
      ["search_docs", { section: "unknown" }],
      ["search_docs", { limit: 0 }],
      ["search_docs", { limit: 51 }],
      ["search_docs", { query: "x".repeat(201) }],
      ["search_docs", { offset: -1 }],
    ] as const) {
      const result = await client.callTool({ name, arguments: args });
      assert.equal(result.isError, true, `${name} ${JSON.stringify(args)}`);
    }
    const result = await call("get_doc", { id: "components/button" });
    assert.equal(result.document.id, "components/button");
  });
});
