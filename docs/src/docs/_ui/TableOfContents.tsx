import { colorVars, spacingVars, typo } from "@bolerish/tokens/semantic.stylex";
import { Link } from "@bolerish/ui/link";
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
      <div {...stylex.props(styles.links)}>
        {(headings[locale] ?? []).map((heading) => (
          <Link variant="plain" href={`#${heading.id}`} key={heading.id}>
            {heading.title}
          </Link>
        ))}
      </div>
    </nav>
  );
}

// The sticky offset follows the measured site header; Link owns its interaction styles.
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
    lineHeight: typo.lineHeightNormal,
    color: colorVars.fgSecondary,
    flexDirection: "column",
    gap: spacingVars.space4,
    display: {
      default: "flex",
      "@media (max-width: 1150px)": "none",
    },
  },
  title: {
    fontWeight: typo.fontWeightMedium,
    marginBlock: spacingVars.space0,
    color: colorVars.fgPrimary,
  },
  links: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: spacingVars.space2,
  },
});
