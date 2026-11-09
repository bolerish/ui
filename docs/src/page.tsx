import { spacingVars, typo } from "@bolerish/tokens/semantic.stylex";
import { Button } from "@bolerish/ui/button";
import { ArrowUpRightIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import { Link, createFileRoute } from "@tanstack/react-router";

import { getHomeGallery, preloadHome } from "@/_shared/home-gallery";
import { localizedLinks } from "@/shared/lib/head";
import { documentLink } from "@/shared/lib/paths";
import { useDocumentationGlobals } from "@/shared/model/useDocumentationGlobals";

import { HomeGallery } from "./_ui/HomeGallery";
export const Route = createFileRoute("/")({
  ssr: true,
  loader: preloadHome,
  pendingMs: Infinity,
  staleTime: 300_000,
  head: () => ({
    links: localizedLinks("/", "en"),
    meta: [
      { title: "bolerish/ui — A React design system for consistent interfaces." },
      {
        name: "description",
        content:
          "React components for consistent surfaces and interactions. Explore every component and block.",
      },
    ],
  }),
  component: HomePage,
});
export function HomePage() {
  const { locale } = useDocumentationGlobals();
  const ko = locale === "ko";
  return (
    <div {...stylex.props(styles.root)}>
      <section {...stylex.props(styles.hero)}>
        <h1 {...stylex.props(styles.title)}>
          bolerish
          <wbr />
          <span {...stylex.props(styles.suffix)}>/ui</span>
        </h1>
        <p {...stylex.props(styles.description)}>
          {ko
            ? "일관된 인터페이스를 위한 React 디자인 시스템."
            : "A React design system for consistent interfaces."}
        </p>
        <Button
          nativeButton={false}
          render={
            <Link
              {...documentLink({ section: "guide", slug: "getting-started" }, locale)}
              search={{}}
            />
          }
        >
          {ko ? "시작하기" : "Get started"}
          <ArrowUpRightIcon aria-hidden="true" />
        </Button>
      </section>
      <HomeGallery items={getHomeGallery()} />
    </div>
  );
}

const styles = stylex.create({
  title: {
    fontFamily:
      'var(--bolerish-font-code, ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace)',
    fontWeight: typo.fontWeightMedium,
    letterSpacing: "0.035em",
    whiteSpace: "normal",
    fontSize: `clamp(calc(${typo.fontSizeXl} * 1.75), 6vw, calc(${typo.fontSizeXl} * 3))`,
    lineHeight: "1.08",
    marginTop: "0",
    marginRight: "0",
    marginBottom: spacingVars.space6,
    marginLeft: "0",
  },
  root: {
    width: "100%",
    paddingTop: "0",
    paddingRight: { default: spacingVars.space8, "@media (max-width: 760px)": spacingVars.space4 },
    paddingBottom: `calc(${spacingVars.space4} * 6)`,
    paddingLeft: { default: spacingVars.space8, "@media (max-width: 760px)": spacingVars.space4 },
  },
  hero: {
    paddingTop: {
      default: `calc(${spacingVars.space2} * 11)`,
      "@media (max-width: 760px)": `calc(${spacingVars.space2} * 7)`,
    },
    paddingRight: {
      default: "0",
      "@media (max-width: 760px)": "0",
    },
    paddingBottom: {
      default: `calc(${spacingVars.space2} * 9)`,
      "@media (max-width: 760px)": `calc(${spacingVars.space2} * 7)`,
    },
    paddingLeft: {
      default: "0",
      "@media (max-width: 760px)": "0",
    },
    maxWidth: "680px",
  },
  suffix: {
    fontWeight: typo.fontWeightRegular,
    color: "var(--docs-muted)",
  },
  startLink: {
    textDecoration: "none",
  },
  description: {
    fontSize: {
      default: `calc(${typo.fontSizeMd} * 1.25)`,
      "@media (max-width: 760px)": typo.fontSizeLg,
    },
    lineHeight: "1.6",
    color: "var(--docs-muted)",
    marginTop: "0",
    marginRight: "0",
    marginBottom: `calc(${spacingVars.space0_5} * 14.0)`,
    marginLeft: "0",
    maxWidth: "540px",
  },
});
