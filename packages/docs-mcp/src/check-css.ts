import {
  checkDeclarations,
  type Declaration,
  type UnreviewedDeclaration,
} from "@bolerish/lint/declarations";
import postcss, { CssSyntaxError } from "postcss";

const limitations = [
  "Only color, typography and spacing declarations in the shared lint policy are checked. Layout, semantic role, contrast, component choice and rendered states require review.",
  "Variables, functions, custom properties and token-bearing shorthands are unreviewed. Their values and design-token provenance are not resolved.",
  "Zero diagnostics is not a conformance verdict. coverage.complete describes supported static declarations only, not the whole interface.",
];

/** Parse supplied text only; no plugins, imports, filesystem reads or source mutation. */
export function checkCss(css: string) {
  if (!css.trim() || css.length > 100_000)
    return {
      error: {
        code: "INVALID_CSS_INPUT",
        message: "Provide 1–100000 characters of CSS containing declarations.",
      },
    };
  try {
    const root = postcss.parse(css, { from: undefined });
    const declarations: Declaration[] = [];
    const unreviewed: UnreviewedDeclaration[] = [];
    root.walkDecls((node) => {
      const declaration = {
        property: node.prop,
        value: node.value,
        line: node.source?.start?.line ?? 1,
        column: node.source?.start?.column ?? 1,
      };
      let parent = node.parent;
      while (parent && parent.type !== "root") {
        if (
          parent.type === "atrule" &&
          ["font-face", "property"].includes(parent.name.toLowerCase())
        ) {
          unreviewed.push({ ...declaration, reason: "descriptor" });
          return;
        }
        parent = parent.parent;
      }
      declarations.push(declaration);
    });
    const blocks = new Set([
      "media",
      "supports",
      "container",
      "layer",
      "scope",
      "starting-style",
      "keyframes",
      "-webkit-keyframes",
      "font-face",
      "property",
    ]);
    root.walkAtRules((node) => {
      if (node.nodes && blocks.has(node.name.toLowerCase())) return;
      unreviewed.push({
        property: `@${node.name}`,
        value: node.params,
        line: node.source?.start?.line ?? 1,
        column: node.source?.start?.column ?? 1,
        reason: "unsupported-at-rule",
      });
    });
    const result = checkDeclarations(declarations);
    result.coverage.unreviewed.push(...unreviewed);
    result.coverage.complete =
      result.coverage.checked > 0 && result.coverage.unreviewed.length === 0;
    result.coverage.declarations += unreviewed.filter(
      (entry) => entry.reason === "descriptor",
    ).length;
    return { ...result, limitations };
  } catch (error) {
    if (error instanceof CssSyntaxError)
      return {
        error: {
          code: "CSS_SYNTAX_ERROR",
          message: error.reason,
          line: error.line,
          column: error.column,
        },
      };
    return {
      error: {
        code: "CSS_CHECK_FAILED",
        message: "CSS could not be inspected; no conformance result is available.",
      },
    };
  }
}
