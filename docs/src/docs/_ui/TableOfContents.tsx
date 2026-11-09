import { colorVars, spacingVars, typo } from "@bolerish/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";

import { useLocale } from "@/shared/model/locale";

export function TableOfContents({
  headings,
}: {
  headings: Record<string, { id: string; title: string }[]>;
}) {
  const locale = useLocale();
  return (
    <nav
      {...stylex.props(styles.root)}
      data-docs="table-of-contents"
      aria-label={locale === "ko" ? "이 페이지에서" : "On this page"}
    >
      <p {...stylex.props(styles.title)}>{locale === "ko" ? "이 페이지에서" : "On this page"}</p>
      {(headings[locale] ?? []).map((heading) => (
        <a {...stylex.props(styles.link)} href={`#${heading.id}`} key={heading.id}>
          {heading.title}
        </a>
      ))}
    </nav>
  );
}

// These dimensions preserve the documentation layout; controls keep their own DS behavior.
const styles = stylex.create({
  root: {
    alignSelf: "start",
    position: "sticky",
    top: "var(--docs-header-height, 65px)",
    paddingTop: spacingVars.space12,
    paddingRight: spacingVars.space6,
    paddingBottom: spacingVars.space4,
    paddingLeft: spacingVars.space2,
    maxHeight: "calc(100dvh - var(--docs-header-height, 65px))",
    overflowY: "auto",
    overflowAnchor: "none",
    scrollbarGutter: "stable",
    scrollbarWidth: "thin",
    fontSize: typo.fontSizeXs,
    lineHeight: "1.6",
    color: "var(--docs-muted)",
    display: {
      default: null,
      "@media (max-width: 1150px)": "none",
    },
  },
  title: {
    fontWeight: typo.fontWeightMedium,
    marginBottom: `calc(${spacingVars.space0_5} * 7.0)`,
    color: colorVars.fgPrimary,
  },
  link: {
    display: "block",
    textDecoration: "none",
    marginBlock: `calc(${spacingVars.space0_5} * 4.5)`,
    color: {
      default: null,
      ":hover": colorVars.fgPrimary,
    },
  },
});
