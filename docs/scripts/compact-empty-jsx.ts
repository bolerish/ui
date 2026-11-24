import { createRequire } from "node:module";

const lintRequire = createRequire(new URL("../../packages/lint/package.json", import.meta.url));
const parserRequire = createRequire(lintRequire.resolve("@typescript-eslint/parser"));
const ts = parserRequire("typescript");

/** Collapse empty elements after preview-only children have been omitted. */
export function compactEmptyJsx(source: string) {
  const file = ts.createSourceFile(
    "example.tsx",
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const edits: Array<{ start: number; end: number; text: string }> = [];
  function visit(node: ReturnType<typeof ts.createSourceFile>) {
    if (
      ts.isJsxElement(node) &&
      node.children.every(
        (child: ReturnType<typeof ts.createSourceFile>) =>
          ts.isJsxText(child) && !child.text.trim(),
      )
    ) {
      const opening = node.openingElement;
      edits.push({
        start: node.getStart(file),
        end: node.end,
        text: `${source.slice(opening.getStart(file), opening.end - 1).trimEnd()} />`,
      });
      return;
    }
    ts.forEachChild(node, visit);
  }
  visit(file);
  for (const edit of edits.reverse())
    source = source.slice(0, edit.start) + edit.text + source.slice(edit.end);
  return source;
}
