import { sizeVars, spacingVars, typo } from "@bolerish/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";

// Shared by document pages and the standalone not-found view.
export const documentStyles = stylex.create({
  article: {
    width: "100%",
    minWidth: "0",
    maxWidth: "820px",
    marginInline: "auto",
    paddingTop: {
      default: spacingVars.space12,
      "@media (max-width: 760px)": spacingVars.space8,
    },
    paddingRight: {
      default: spacingVars.space12,
      "@media (max-width: 1150px)": spacingVars.space10,
      "@media (max-width: 760px)": spacingVars.space4,
    },
    paddingBottom: {
      default: `calc(${spacingVars.space0_5} * 50.0)`,
      "@media (max-width: 760px)": `calc(${spacingVars.space4} * 4)`,
    },
    paddingLeft: {
      default: spacingVars.space12,
      "@media (max-width: 1150px)": spacingVars.space10,
      "@media (max-width: 760px)": spacingVars.space4,
    },
    lineHeight: "1.75",
  },
  title: {
    fontSize: {
      default: `calc(${typo.fontSizeXl} * 1.5)`,
      "@media (max-width: 760px)": `calc(${typo.fontSizeXl} * 1.25)`,
    },
    letterSpacing: "-0.035em",
    lineHeight: "1.2",
    marginTop: "0",
    marginRight: "0",
    marginBottom: spacingVars.space6,
    marginLeft: "0",
  },
  heading: {
    scrollMarginTop: `calc(var(--docs-header-height, 65px) + ${spacingVars.space6} + ${sizeVars.stroke})`,
  },
  paragraph: {
    overflowWrap: "anywhere",
  },
  pre: {
    marginTop: "0",
    marginRight: "0",
    marginBottom: "0",
    marginLeft: "0",
    fontFamily: "var(--bolerish-font-code, monospace)",
    whiteSpace: "pre",
  },
  details: {
    marginTop: spacingVars.space10,
    color: "var(--docs-muted)",
  },
});
