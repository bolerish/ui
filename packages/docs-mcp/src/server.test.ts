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
  assert.deepEqual(tools.map(({ name }) => name).sort(), ["check_css", "get_doc", "search_docs"]);
  assert.ok(tools.every(({ annotations }) => annotations?.readOnlyHint === true));

  async function call(name: string, args: Record<string, unknown>) {
    const result = await client.callTool({ name, arguments: args });
    assert.notEqual(result.isError, true, JSON.stringify(result.content));
    const block = result.content[0];
    assert.equal(block.type, "text");
    if (block.type !== "text") throw new Error("Expected a text response");
    return JSON.parse(block.text);
  }

  await t.test("task phrases expose components, foundations and valid examples", async () => {
    for (const [queries, component, foundation] of [
      [["저장 실패 알림", "save failure notification"], "components/toast", "foundations/feedback"],
      [["즉시 적용되는 설정", "immediate setting"], "components/switch", "foundations/overview"],
      [["선택된 행", "selected row"], "components/table", "foundations/state"],
    ] as const) {
      for (const query of queries) {
        const result = await call("search_docs", { query });
        assert.deepEqual(
          result.documents.map((doc: { id: string }) => doc.id).sort(),
          [component, foundation].sort(),
        );
        assert.equal(result.total, 2);
        for (const doc of result.documents) {
          assert.equal("rank" in doc, false);
          assert.deepEqual(doc.matchReasons, ["keyword"]);
        }
        const filtered = await call("search_docs", { query, section: "foundations", limit: 1 });
        assert.equal(filtered.total, 1);
        assert.equal(filtered.documents[0].id, foundation);
        assert.equal(filtered.nextOffset, null);
        const first = await call("search_docs", { query, limit: 1 });
        assert.equal(first.total, 2);
        assert.equal(first.nextOffset, 1);
        const last = await call("search_docs", { query, limit: 1, offset: 1 });
        assert.equal(last.total, 2);
        assert.equal(last.nextOffset, null);
        assert.notEqual(first.documents[0].id, last.documents[0].id);
        const doc = result.documents.find((doc: { id: string }) => doc.id === component);
        assert.ok(doc.relatedExamples.length > 0);
        for (const id of doc.relatedExamples) {
          assert.ok(id.startsWith(`examples/${component.slice(11)}/`));
          assert.equal((await call("get_doc", { id })).document.id, id);
        }
        assert.equal((await call("search_docs", { query: query + " zzz-no-matching" })).total, 0);
      }
    }
    for (const query of [
      "notselected row",
      "selected rowsomething",
      "미선택된 행",
      "선택된 행동",
    ]) {
      assert.equal((await call("search_docs", { query })).total, 0, query);
    }
  });

  await t.test("bundle, ranking, phrases and section views", async () => {
    const { createHash } = await import("node:crypto");
    const catalog = JSON.parse(
      await readFile(new URL("../dist/documents.json", import.meta.url), "utf8"),
    );
    const full = await call("get_doc", { id: "components/button" });
    assert.equal(
      full.bundle.contentHash,
      createHash("sha256")
        .update(
          JSON.stringify({
            version: catalog.version,
            packages: catalog.packages,
            documents: catalog.documents,
          }),
        )
        .digest("hex"),
    );
    assert.equal(full.bundle.documentCount, catalog.documents.length);
    assert.deepEqual([...full.bundle.tools].sort(), tools.map((t) => t.name).sort());
    assert.equal(
      (await call("search_docs", { query: "button" })).documents[0].id,
      "components/button",
    );
    for (const [query, id] of [
      ["저장 실패 알림", "components/toast"],
      ["즉시 적용되는 설정", "components/switch"],
      ["선택된 행", "components/table"],
    ]) {
      assert.equal((await call("search_docs", { query })).documents[0].id, id);
      assert.equal((await call("search_docs", { query: query + " zzz-no-matching" })).total, 0);
    }
    const outline = await call("get_doc", { id: "components/button", view: "outline" });
    assert.ok(outline.sections.length);
    assert.ok(full.relatedExamples.includes("examples/button/Default"));
    assert.deepEqual(outline.relatedExamples, full.relatedExamples);
    const selected = await call("get_doc", {
      id: "components/button",
      heading: outline.sections[0].id,
    });
    assert.ok(full.document.content.includes(selected.document.content));
    assert.deepEqual(selected.relatedExamples, full.relatedExamples);
    for (const args of [
      { id: "components/button", heading: "" },
      { id: "components/button", heading: "missing" },
      { id: "components/button", view: "outline", heading: "x" },
    ])
      assert.equal((await client.callTool({ name: "get_doc", arguments: args })).isError, true);
  });

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

  await t.test("CSS checks return located findings and explicit incomplete coverage", async () => {
    const result = await call("check_css", {
      css: ".card {\n  color: #fff;\n  padding-inline: 16px;\n  line-height: 1.75;\n}",
    });
    assert.deepEqual(
      result.diagnostics.map(
        ({ ruleId, line, column }: { ruleId: string; line: number; column: number }) => [
          ruleId,
          line,
          column,
        ],
      ),
      [
        ["bolerish-ui/color-tokens", 2, 3],
        ["bolerish-ui/spacing-tokens", 3, 3],
      ],
    );
    assert.equal(result.coverage.checked, 3);
    assert.equal(
      result.packages["@bolerish/lint"],
      JSON.parse(await readFile(new URL("../../lint/package.json", import.meta.url), "utf8"))
        .version,
    );
    assert.ok(result.limitations.length > 0);
    const incomplete = await call("check_css", {
      css: '@import "https://invalid.example/never-load.css"; @font-face { font-family: Example; src: url(never-load.woff2); } @property --x { syntax: "*"; inherits: false; } @media (width < 768px) { .card { gap: var(--gap, 16px); border-bottom: 1px solid red; --surface: #fff; padding:0; } }',
    });
    assert.equal(incomplete.coverage.complete, false);
    assert.equal(incomplete.coverage.checked, 1);
    assert.ok(
      incomplete.coverage.unreviewed.some(
        ({ reason }: { reason: string }) => reason === "descriptor",
      ),
    );
    assert.ok(
      incomplete.coverage.unreviewed.some(
        ({ property }: { property: string }) => property === "@import",
      ),
    );
    for (const css of ["/* Site exceptions */", ".card {}", ".card { display:flex; width:736px; }"])
      assert.equal((await call("check_css", { css })).coverage.complete, false);
    const nested = await call("check_css", {
      css: "@media (width < 768px) { .card { padding:16px } } @keyframes move { from { margin-left:12px } }",
    });
    assert.equal(nested.diagnostics.length, 2);
    const defaultPage = await call("check_css", { css: ".card {" + "color:red;".repeat(55) + "}" });
    assert.equal(defaultPage.totalIssues, 55);
    assert.equal(defaultPage.diagnostics.length, 50);
    assert.equal(defaultPage.nextOffset, 50);
    const pagedCss = ".card { color:red; gap:var(--gap); padding:16px }";
    const first = await call("check_css", { css: pagedCss, limit: 1 });
    assert.equal(first.totalIssues, 3);
    assert.equal(first.diagnosticsTotal, 2);
    assert.equal(first.coverage.unreviewedTotal, 1);
    assert.equal(first.diagnostics.length, 1);
    assert.equal(first.coverage.unreviewed.length, 0);
    assert.equal(first.coverage.complete, false);
    assert.equal(first.nextOffset, 1);
    const second = await call("check_css", { css: pagedCss, limit: 1, offset: first.nextOffset });
    assert.equal(second.diagnostics.length, 0);
    assert.equal(second.coverage.unreviewed.length, 1);
    assert.equal(second.nextOffset, 2);
    const last = await call("check_css", { css: pagedCss, limit: 1, offset: second.nextOffset });
    assert.equal(last.diagnostics.length, 1);
    assert.equal(last.nextOffset, null);
    const empty = await call("check_css", { css: pagedCss, offset: 3 });
    assert.equal(empty.totalIssues, 3);
    assert.equal(empty.diagnostics.length, 0);
    assert.equal(empty.coverage.complete, false);
    const failure = await client.callTool({
      name: "check_css",
      arguments: { css: ".card { color:red" },
    });
    assert.equal(failure.isError, true);
    const failureBlock = failure.content[0];
    assert.equal(failureBlock.type, "text");
    if (failureBlock.type !== "text") throw new Error("Expected text");
    const error = JSON.parse(failureBlock.text).error;
    assert.equal(error.code, "CSS_SYNTAX_ERROR");
    assert.equal(error.line, 1);
    assert.equal(error.column, 1);
    const workflow = await call("get_doc", { id: "guides/agent-workflow" });
    assert.equal(workflow.document.id, "guides/agent-workflow");
    assert.ok(workflow.document.content.includes("check_css"));
    assert.ok(
      (await call("search_docs", { query: "agent workflow", section: "guides" })).documents.some(
        ({ id }: { id: string }) => id === "guides/agent-workflow",
      ),
    );
  });

  await t.test("unknown IDs and invalid input fail without breaking later requests", async () => {
    for (const [name, args] of [
      ["get_doc", { id: "../../package.json" }],
      ["get_doc", { id: "components/missing" }],
      ["get_doc", {}],
      ["check_css", {}],
      ["check_css", { css: ".x{}", limit: 0 }],
      ["check_css", { css: ".x{}", limit: 201 }],
      ["check_css", { css: ".x{}", offset: -1 }],
      ["check_css", { css: "" }],
      ["check_css", { css: "   " }],
      ["check_css", { css: ".card { color:red" }],
      ["check_css", { css: "x".repeat(100001) }],
      ["search_docs", { section: "unknown" }],
      ["search_docs", { limit: 0 }],
      ["search_docs", { limit: 51 }],
      ["search_docs", { query: "x".repeat(201) }],
      ["search_docs", { offset: -1 }],
    ] as const) {
      const result = await client.callTool({ name, arguments: args });
      assert.equal(result.isError, true, `${name} ${JSON.stringify(args)}`);
    }
    const recovered = await call("check_css", { css: ".card { padding:0; }" });
    assert.equal(recovered.coverage.checked, 1);
    const result = await call("get_doc", { id: "components/button" });
    assert.equal(result.document.id, "components/button");
  });
});
