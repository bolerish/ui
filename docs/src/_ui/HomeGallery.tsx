import {
  colorVars,
  radiusVars,
  sizeVars,
  spacingVars,
  typo,
} from "@bolerish/tokens/semantic.stylex";
import { Separator } from "@bolerish/ui/separator";
import { ArrowUpRightIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import { Link } from "@tanstack/react-router";

import type { getHomeGallery } from "@/_shared/home-gallery";
import { documentLink } from "@/shared/lib/paths";
import { useDocumentationGlobals } from "@/shared/model/useDocumentationGlobals";

export function HomeGallery({ items }: { items: ReturnType<typeof getHomeGallery> }) {
  const { locale } = useDocumentationGlobals();
  const ko = locale === "ko";
  return (
    <section
      id="components"
      {...stylex.props(styles.gallery)}
      data-docs="home-gallery"
      aria-labelledby="gallery-title"
    >
      <h2 id="gallery-title" {...stylex.props(styles.galleryTitle)}>
        {ko ? "컴포넌트와 블록" : "Components & blocks"}
      </h2>
      <div {...stylex.props(styles.grid)}>
        {items.map((page) => (
          <article
            key={`${page.section}/${page.slug}`}
            {...stylex.props(styles.item, stylex.defaultMarker())}
            data-docs="gallery-item"
          >
            <header {...stylex.props(styles.itemHeader)}>
              <h3 {...stylex.props(styles.itemTitle)}>{page.title}</h3>
              <Link
                {...documentLink(page, locale)}
                search={{}}
                {...stylex.props(styles.itemLink)}
                aria-label={`${page.title} ${ko ? "문서" : "Docs"}`}
              >
                {ko ? "문서" : "Docs"}
                <ArrowUpRightIcon {...stylex.props(styles.itemIcon)} aria-hidden="true" />
              </Link>
            </header>
            <Separator />
            <div {...stylex.props(styles.preview)} data-docs="gallery-preview" lang="en">
              <page.Example />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

const styles = stylex.create({
  gallery: {
    scrollMarginTop: "90px",
  },
  galleryTitle: {
    fontSize: typo.fontSizeSm,
    fontWeight: typo.fontWeightMedium,
    color: "var(--docs-muted)",
    marginTop: "0",
    marginRight: "0",
    marginBottom: spacingVars.space6,
    marginLeft: "0",
  },
  grid: {
    columns: {
      default: "3",
      "@media (max-width: 1200px)": "2",
      "@media (max-width: 760px)": "1",
    },
    columnGap: spacingVars.space6,
  },
  item: {
    breakInside: "avoid",
    marginBottom: spacingVars.space8,
    minWidth: "0",
    background: colorVars.bgSubtle,
    borderWidth: sizeVars.stroke,
    borderStyle: "solid",
    borderColor: colorVars.strokeDefault,
    borderTopLeftRadius: radiusVars.lg,
    borderTopRightRadius: radiusVars.lg,
    borderBottomRightRadius: radiusVars.lg,
    borderBottomLeftRadius: radiusVars.lg,
  },
  itemHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacingVars.space3,
    paddingTop: spacingVars.space3,
    paddingRight: spacingVars.space5,
    paddingBottom: spacingVars.space3,
    paddingLeft: spacingVars.space5,
    background: colorVars.bgSurface,
    borderTopLeftRadius: `calc(${radiusVars.lg} - ${sizeVars.stroke})`,
    borderTopRightRadius: `calc(${radiusVars.lg} - ${sizeVars.stroke})`,
    borderBottomRightRadius: "0",
    borderBottomLeftRadius: "0",
  },
  itemTitle: {
    marginTop: "0",
    marginRight: "0",
    marginBottom: "0",
    marginLeft: "0",
    fontSize: typo.fontSizeSm,
    fontWeight: typo.fontWeightSemibold,
  },
  itemLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: spacingVars.space1,
    color: {
      default: "var(--docs-muted)",
      ":hover": colorVars.fgPrimary,
    },
    fontSize: typo.fontSizeXs,
    textDecoration: "none",
    opacity: {
      default: null,
      "@media (hover: hover) and (pointer: fine)": {
        default: "0",
        [stylex.when.ancestor(":hover")]: "1",
        [stylex.when.ancestor(":focus-within")]: "1",
      },
    },
    pointerEvents: {
      default: null,
      "@media (hover: hover) and (pointer: fine)": {
        default: "none",
        [stylex.when.ancestor(":hover")]: "auto",
        [stylex.when.ancestor(":focus-within")]: "auto",
      },
    },
  },
  itemIcon: {
    width: sizeVars.iconSm,
    height: sizeVars.iconSm,
  },
  preview: {
    minWidth: "0",
    paddingTop: {
      default: spacingVars.space6,
      "@media (max-width: 760px)": spacingVars.space4,
    },
    paddingRight: {
      default: spacingVars.space5,
      "@media (max-width: 760px)": spacingVars.space3,
    },
    paddingBottom: {
      default: spacingVars.space6,
      "@media (max-width: 760px)": spacingVars.space4,
    },
    paddingLeft: {
      default: spacingVars.space5,
      "@media (max-width: 760px)": spacingVars.space3,
    },
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    gap: spacingVars.space3,
  },
});
