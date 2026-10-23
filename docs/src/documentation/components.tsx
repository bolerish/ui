import {
  colorVars,
  radiusVars,
  sizeVars,
  spacingVars,
  typo,
} from "@bolerish/tokens/semantic.stylex";
import { Paragraph } from "@bolerish/ui/paragraph";
import * as stylex from "@stylexjs/stylex";
import { Link } from "@tanstack/react-router";
import { isValidElement, type ReactNode, type ComponentProps } from "react";
import type { Components } from "react-markdown";

import { findDocument } from "./catalog";
import { CodeBlock } from "./CodeBlock";
import { useLocale } from "./locale";
import { documentLink, legacyDocumentPath } from "./paths";
import { tableHeaders } from "./table-headers";

function DocumentationLink({ href, children, ...props }: ComponentProps<"a">) {
  const locale = useLocale();
  const [path, hash] = (href ?? "").split("#");
  const canonical = legacyDocumentPath(path);
  const [, section, slug] = canonical.replace(/^\/docs\//, "/").split("/");
  const page =
    canonical === "/docs/getting-started"
      ? findDocument("guide", "getting-started")
      : findDocument(section, slug);
  return page ? (
    <Link {...props} {...documentLink(page, locale)} search={{}} hash={hash}>
      {children}
    </Link>
  ) : (
    <a {...props} href={href}>
      {children}
    </a>
  );
}

const styles = stylex.create({
  h1: {
    color: colorVars.fgPrimary,
    fontFamily: typo.fontFamilyHeading,
    fontSize: typo.fontSizeXl,
    fontWeight: typo.fontWeightSemibold,
    lineHeight: typo.lineHeightTight,
    marginBlock: spacingVars.space6,
  },
  h2: {
    color: colorVars.fgPrimary,
    fontFamily: typo.fontFamilyHeading,
    fontSize: typo.fontSizeLg,
    fontWeight: typo.fontWeightSemibold,
    lineHeight: typo.lineHeightTight,
    marginTop: spacingVars.space8,
    marginBottom: spacingVars.space4,
    paddingBottom: spacingVars.space2,
  },
  h3: {
    color: colorVars.fgPrimary,
    fontFamily: typo.fontFamilyHeading,
    fontSize: typo.fontSizeMd,
    fontWeight: typo.fontWeightSemibold,
    marginTop: spacingVars.space6,
    marginBottom: spacingVars.space3,
  },
  p: { marginBlock: spacingVars.space3 },
  list: {
    color: colorVars.fgSecondary,
    fontFamily: typo.fontFamilyBody,
    fontSize: typo.fontSizeSm,
    lineHeight: typo.lineHeightNormal,
    paddingInlineStart: spacingVars.space6,
    marginBlock: spacingVars.space3,
  },
  ordered: { listStyleType: "decimal" },
  unordered: { listStyleType: "disc" },
  item: { marginBlock: spacingVars.space2 },
  link: { color: colorVars.fgAction, textDecoration: "underline", textUnderlineOffset: "0.2em" },
  scroll: { overflowX: "auto", marginBlock: spacingVars.space4 },
  table: {
    borderCollapse: "collapse",
    width: "100%",
    fontSize: typo.fontSizeSm,
    lineHeight: typo.lineHeightNormal,
  },
  selectionTable: { tableLayout: "fixed" },
  propsTable: { minWidth: "44rem", "--docs-table-header-wrap": "nowrap" },
  situationColumn: { width: "30%" },
  choiceColumn: { width: "30%" },
  codeColumn: { width: "40%" },
  cell: {
    overflowWrap: "anywhere",
    color: colorVars.fgPrimary,
    paddingBlock: spacingVars.space3,
    paddingInline: spacingVars.space3,
    textAlign: "start",
    verticalAlign: "top",
  },
  th: {
    backgroundColor: colorVars.bgSubtle,
    fontWeight: typo.fontWeightSemibold,
    whiteSpace: "var(--docs-table-header-wrap, normal)",
  },
  code: {
    whiteSpace: "nowrap",
    fontFamily: "var(--bolerish-font-code)",
    backgroundColor: colorVars.bgSubtle,
    color: colorVars.fgPrimary,
    borderRadius: radiusVars.sm,
    paddingInline: spacingVars.space1,
    fontSize: "0.9em",
  },
  quote: {
    borderInlineStart: `${sizeVars.focusRing} solid ${colorVars.strokeStrong}`,
    color: colorVars.fgSecondary,
    backgroundColor: colorVars.bgSubtle,
    borderRadius: radiusVars.sm,
    paddingInline: spacingVars.space4,
    paddingBlock: spacingVars.space1,
    marginBlock: spacingVars.space4,
    marginInline: 0,
  },
});

export const documentationComponents: Components = {
  h1: ({ node: _node, children, ...props }) => (
    <h1 {...props} {...stylex.props(styles.h1)}>
      {children}
    </h1>
  ),
  h2: ({ node: _node, children, ...props }) => (
    <h2 {...props} {...stylex.props(styles.h2)}>
      {children}
    </h2>
  ),
  h3: ({ node: _node, children, ...props }) => (
    <h3 {...props} {...stylex.props(styles.h3)}>
      {children}
    </h3>
  ),
  p: ({ node: _node, ...props }) => (
    <Paragraph {...props} variant="description" xstyle={styles.p} />
  ),
  ul: ({ node: _node, ...props }) => (
    <ul {...props} {...stylex.props(styles.list, styles.unordered)} />
  ),
  ol: ({ node: _node, ...props }) => (
    <ol {...props} {...stylex.props(styles.list, styles.ordered)} />
  ),
  li: ({ node: _node, ...props }) => <li {...props} {...stylex.props(styles.item)} />,
  a: ({ node: _node, children, ...props }) => (
    <DocumentationLink {...props} {...stylex.props(styles.link)}>
      {children}
    </DocumentationLink>
  ),
  table: ({ node: _node, children, ...props }) => {
    const headers = tableHeaders(children);
    const isSelectionTable =
      headers.join("|") === "사용 상황|권장 선택|적용 코드" ||
      headers.join("|") === "Situation|Recommended choice|Code";
    const isPropsTable =
      headers.join("|") === "속성|기본값|값|용도" ||
      headers.join("|") === "Prop|Default|Values|Meaning";

    return (
      <div {...stylex.props(styles.scroll)}>
        <table
          {...props}
          {...stylex.props(
            styles.table,
            isSelectionTable && styles.selectionTable,
            isPropsTable && styles.propsTable,
          )}
        >
          {isSelectionTable ? (
            <colgroup>
              <col {...stylex.props(styles.situationColumn)} />
              <col {...stylex.props(styles.choiceColumn)} />
              <col {...stylex.props(styles.codeColumn)} />
            </colgroup>
          ) : null}
          {children}
        </table>
      </div>
    );
  },
  th: ({ node: _node, ...props }) => <th {...props} {...stylex.props(styles.cell, styles.th)} />,
  td: ({ node: _node, ...props }) => <td {...props} {...stylex.props(styles.cell)} />,
  code: ({ node: _node, ...props }) => <code {...props} {...stylex.props(styles.code)} />,
  blockquote: ({ node: _node, ...props }) => <aside {...props} {...stylex.props(styles.quote)} />,
  pre: ({ children }) => {
    if (!isValidElement<{ children?: ReactNode; className?: string }>(children))
      return <pre>{children}</pre>;
    const code = String(children.props.children ?? "").trimEnd();
    const languages: Record<string, "tsx" | "json" | "bash"> = {
      "language-tsx": "tsx",
      "language-json": "json",
      "language-bash": "bash",
    };
    const language = languages[children.props.className ?? ""] ?? "tsx";
    return <CodeBlock code={code} language={language} />;
  },
};
