import {
  colorVars,
  radiusVars,
  sizeVars,
  spacingVars,
  typo,
} from "@bolerish/tokens/semantic.stylex";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@bolerish/ui/accordion";
import { Badge } from "@bolerish/ui/badge";
import { Button } from "@bolerish/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@bolerish/ui/dialog";
import { Input } from "@bolerish/ui/input";
import { InputGroup } from "@bolerish/ui/input-group";
import { NativeSelect } from "@bolerish/ui/native-select";
import { Popover, PopoverTrigger, PopoverContent } from "@bolerish/ui/popover";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectPopup,
  SelectList,
  SelectItem,
} from "@bolerish/ui/select";
import {
  SlidersHorizontalIcon,
  ListIcon,
  GithubLogoIcon,
  MagnifyingGlassIcon,
  SunIcon,
  MoonIcon,
} from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import { Link, Outlet, useNavigate, useLocation, useRouterState } from "@tanstack/react-router";
import { useCallback, useEffect, useState, type RefCallback } from "react";

import { catalog } from "@/_shared/catalog";
import { isNewComponent } from "@/shared/lib/component-releases";
import { documentLink, localizedPath } from "@/shared/lib/paths";
import { parseSearchQuery, searchDocuments, type SearchDocument } from "@/shared/lib/search";
import type { DocumentationGlobals } from "@/shared/model/settings";
import {
  useDocumentationGlobals,
  useDocumentationPreferences,
} from "@/shared/model/useDocumentationGlobals";

import { documentMarker } from "./shared/styles/document-marker.stylex";

export function SiteLayout() {
  const routeId = useRouterState({ select: (state) => state.matches.at(-1)?.routeId });
  const [navigation, setNavigation] = useState({ routeId, open: false });
  if (navigation.routeId !== routeId) setNavigation({ routeId, open: false });
  const menuOpen = navigation.routeId === routeId && navigation.open;
  const home = routeId === "/" || routeId === "/ko/";
  const standalone = routeId?.startsWith("/preview/") || routeId === "/404/";
  const header = useHeaderHeight();
  if (standalone) return <Outlet />;
  function closeNavigation() {
    setNavigation({ routeId, open: false });
  }
  return (
    <div {...stylex.props(styles.root(header.height))}>
      <a {...stylex.props(styles.skipLink)} href="#content">
        Skip to content
      </a>
      <SiteHeader
        headerRef={header.ref}
        home={home}
        menuOpen={menuOpen}
        onToggleMenu={() => setNavigation({ routeId, open: !menuOpen })}
        onNavigate={closeNavigation}
      />
      <div {...stylex.props(styles.layout, home && styles.homeLayout)}>
        {!home ? <Sidebar open={menuOpen} onNavigate={closeNavigation} /> : null}
        <main {...stylex.props(styles.main)} id="content" tabIndex={-1}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function SiteHeader({
  headerRef,
  home,
  menuOpen,
  onToggleMenu,
  onNavigate,
}: {
  headerRef: RefCallback<HTMLElement>;
  home: boolean;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onNavigate: () => void;
}) {
  const settings = useDocumentationGlobals();
  const navigate = useNavigate();
  const location = useLocation();
  const setPreferences = useDocumentationPreferences();
  const nextTheme = { light: "dark", dark: "system", system: "light" } as const;
  function updatePreferences(changes: Partial<DocumentationGlobals>) {
    if (changes.locale) {
      if (changes.locale === settings.locale) return;
      void navigate({
        to: localizedPath(location.pathname, changes.locale),
        search: {},
        hash: location.hash,
        replace: true,
        resetScroll: false,
      });
    } else {
      setPreferences(changes);
      if (location.searchStr)
        void navigate({ to: ".", search: {}, replace: true, resetScroll: false });
    }
  }

  return (
    <header ref={headerRef} {...stylex.props(styles.header)} data-docs="site-header">
      <div {...stylex.props(styles.headerInner)}>
        <Link
          {...stylex.props(styles.brand)}
          to={settings.locale === "ko" ? "/ko" : "/"}
          search={{}}
        >
          bolerish<span {...stylex.props(styles.brandSuffix)}>/ui</span>
        </Link>
        <nav {...stylex.props(styles.topNavigation)} aria-label="Sections">
          <Link
            {...documentLink({ section: "guide", slug: "getting-started" }, settings.locale)}
            search={{}}
            {...stylex.props(styles.topLink)}
          >
            Docs
          </Link>
        </nav>
        <div {...stylex.props(styles.headerActions)} data-docs="header-actions">
          <DocumentationSearch onNavigate={onNavigate} />
          <Select
            value={settings.locale}
            items={{ en: "English", ko: "한국어" }}
            onValueChange={(locale) => {
              if (locale === "en" || locale === "ko") updatePreferences({ locale });
            }}
          >
            <SelectTrigger
              {...stylex.props(styles.languageSelect)}
              data-docs="language-select"
              aria-label={settings.locale === "ko" ? "언어" : "Language"}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectPopup>
              <SelectList>
                <SelectItem value="en" lang="en">
                  English
                </SelectItem>
                <SelectItem value="ko" lang="ko">
                  한국어
                </SelectItem>
              </SelectList>
            </SelectPopup>
          </Select>
          <Preferences settings={settings} onChange={updatePreferences} />
          <Button
            variant="ghost"
            size="icon"
            xstyle={styles.headerControl}
            aria-label={`Theme: ${settings.colorMode}. Switch to ${nextTheme[settings.colorMode]}`}
            title={`Theme: ${settings.colorMode}`}
            onClick={() => updatePreferences({ colorMode: nextTheme[settings.colorMode] })}
          >
            <MoonIcon
              {...stylex.props(styles.icon, styles.darkIcon)}
              data-docs="theme-icon-dark"
              aria-hidden="true"
            />
            <SunIcon
              {...stylex.props(styles.icon, styles.lightIcon)}
              data-docs="theme-icon-light"
              aria-hidden="true"
            />
          </Button>
          <a
            {...stylex.props(styles.repositoryLink)}
            href="https://github.com/myjeong19/ui"
            aria-label="GitHub repository"
          >
            <GithubLogoIcon size={20} aria-hidden="true" />
          </a>
          {!home ? (
            <Button
              {...stylex.props(styles.menuButton)}
              variant="ghost"
              size="icon"
              aria-label="Toggle navigation"
              aria-expanded={menuOpen}
              aria-controls="docs-navigation"
              onClick={onToggleMenu}
            >
              <ListIcon {...stylex.props(styles.icon)} aria-hidden="true" />
            </Button>
          ) : null}
        </div>
      </div>
    </header>
  );
}

function DocumentationSearch({ onNavigate }: { onNavigate: () => void }) {
  const settings = useDocumentationGlobals();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState(settings.q);
  const [searchSection, setSearchSection] = useState("all");
  const [searchIndex, setSearchIndex] = useState<{
    locale: string;
    documents: SearchDocument[];
  } | null>(null);
  const [searchError, setSearchError] = useState(false);
  useEffect(() => {
    if (!searchOpen || searchIndex?.locale === settings.locale) return;
    const controller = new AbortController();
    void fetch(`/search.${settings.locale}.json`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Could not load search index");
        return response.json();
      })
      .then((documents: SearchDocument[]) => {
        if (!controller.signal.aborted) setSearchIndex({ locale: settings.locale, documents });
      })
      .catch(() => {
        if (!controller.signal.aborted) setSearchError(true);
      });
    return () => controller.abort();
  }, [searchOpen, settings.locale, searchIndex?.locale]);
  const ready = searchIndex?.locale === settings.locale;
  const matches = ready ? searchDocuments(searchIndex.documents, query) : [];
  const visible = matches.filter(
    (item) => searchSection === "all" || item.section === searchSection,
  );
  const searching = query.trim() !== "" || searchSection !== "all";
  const { newOnly } = parseSearchQuery(query);
  const ko = settings.locale === "ko";
  const allLabel = ko ? "#전체" : "#All";
  let resultMessage: string;
  if (searchError)
    resultMessage = ko
      ? "검색을 불러오지 못했습니다. 창을 닫고 다시 열어주세요."
      : "Could not load search. Close and reopen to retry.";
  else if (!ready) resultMessage = ko ? "검색 준비 중…" : "Preparing search…";
  else if (!searching)
    resultMessage = ko
      ? "검색어를 입력하거나 분류를 선택하세요."
      : "Search documentation or choose a category.";
  else resultMessage = `${visible.length}${ko ? "개 문서" : " documents"}`;

  return (
    <Dialog
      open={searchOpen}
      onOpenChange={(open) => {
        setSearchError(false);
        setSearchOpen(open);
      }}
    >
      <InputGroup xstyle={styles.search} data-docs="documentation-search">
        <DialogTrigger
          render={
            <Button
              {...stylex.props(styles.searchTrigger)}
              variant="ghost"
              aria-label={settings.locale === "ko" ? "문서 검색" : "Search documentation"}
            >
              <MagnifyingGlassIcon {...stylex.props(styles.icon)} aria-hidden="true" />
              <span {...stylex.props(styles.searchLabel)}>
                {settings.locale === "ko" ? "문서 검색…" : "Search documentation…"}
              </span>
            </Button>
          }
        />
      </InputGroup>
      <DialogContent
        xstyle={styles.searchDialog}
        closeLabel={settings.locale === "ko" ? "닫기" : "Close"}
      >
        <DialogTitle>{settings.locale === "ko" ? "문서 검색" : "Search documentation"}</DialogTitle>
        <Input
          aria-label={
            settings.locale === "ko" ? "문서 제목과 내용 검색" : "Search titles and content"
          }
          placeholder={
            settings.locale === "ko" ? "제목과 내용으로 문서 찾기…" : "Search titles and content…"
          }
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <div {...stylex.props(styles.searchLayout)}>
          <nav
            {...stylex.props(styles.searchSections)}
            aria-label={settings.locale === "ko" ? "검색 분류" : "Search sections"}
          >
            {["all", "guide", "foundations", "components", "api"].map((section) => (
              <Button
                key={section}
                {...stylex.props(styles.searchSectionButton)}
                size="sm"
                variant={searchSection === section ? "secondary" : "ghost"}
                aria-pressed={searchSection === section}
                onClick={() => setSearchSection(section)}
              >
                <span>{section === "all" ? allLabel : `#${sectionNames[section]}`}</span>
              </Button>
            ))}
            <Button
              {...stylex.props(styles.searchSectionButton)}
              size="sm"
              variant={newOnly ? "secondary" : "ghost"}
              aria-pressed={newOnly}
              onClick={() =>
                setQuery((current) => {
                  if (parseSearchQuery(current).newOnly)
                    return current
                      .split(/\s+/)
                      .filter((term) => term.toLowerCase() !== "#new")
                      .join(" ")
                      .trim();
                  return `${current.trim()} #New`.trim();
                })
              }
            >
              #New
            </Button>
          </nav>
          <div {...stylex.props(styles.searchMatches)}>
            <output {...stylex.props(styles.searchCount)} aria-live="polite">
              {resultMessage}
            </output>
            <nav
              {...stylex.props(styles.searchResults)}
              data-docs="search-results"
              aria-label="Search results"
            >
              {(searching ? visible : []).map((item) => (
                <Link
                  {...stylex.props(styles.searchResult)}
                  key={`${item.section}/${item.slug}`}
                  {...documentLink(item, settings.locale)}
                  search={{}}
                  onClick={() => {
                    setSearchOpen(false);
                    onNavigate();
                  }}
                >
                  <span {...stylex.props(styles.searchResultTitle)} data-docs="search-result-title">
                    {item.title}
                    {item.isNew ? <Badge variant="secondary">New</Badge> : null}
                  </span>
                  <span {...stylex.props(styles.searchResultDescription)}>{item.description}</span>
                </Link>
              ))}
              {ready && searching && visible.length === 0 ? (
                <p>
                  {settings.locale === "ko"
                    ? "일치하는 문서가 없습니다."
                    : "No matching documents."}
                </p>
              ) : null}
            </nav>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Preferences({
  settings,
  onChange,
}: {
  settings: DocumentationGlobals;
  onChange: (changes: Partial<DocumentationGlobals>) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            xstyle={styles.headerControl}
            aria-label={settings.locale === "ko" ? "설정" : "Settings"}
          >
            <SlidersHorizontalIcon {...stylex.props(styles.icon)} aria-hidden="true" />
          </Button>
        }
      />
      <PopoverContent
        xstyle={styles.preferencesPopover}
        data-docs="preferences-popover"
        align="end"
        side="bottom"
      >
        <div {...stylex.props(styles.preferences)}>
          <p {...stylex.props(styles.preferencesTitle)}>
            {settings.locale === "ko" ? "설정" : "Settings"}
          </p>
          {controls.map(([name, label, options]) => (
            <label
              key={name}
              {...stylex.props(
                styles.preferenceLabel,
                name === "locale" && styles.preferenceLanguage,
              )}
            >
              <span>{label}</span>
              <NativeSelect
                xstyle={styles.preferenceControl}
                aria-label={label}
                value={settings[name]}
                onChange={(event) => onChange({ [name]: event.target.value })}
              >
                {options.map(([value, title]) => (
                  <option key={value} value={value}>
                    {title}
                  </option>
                ))}
              </NativeSelect>
            </label>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function Sidebar({ open, onNavigate }: { open: boolean; onNavigate: () => void }) {
  const settings = useDocumentationGlobals();
  return (
    <aside
      {...stylex.props(styles.sidebar, open && styles.sidebarOpen)}
      data-docs="sidebar"
      id="docs-navigation"
    >
      <nav aria-label="Documentation">
        {catalog
          .filter((item) => item.section === "guide")
          .map((item) => (
            <Link
              key={item.slug}
              {...documentLink(item, settings.locale)}
              search={{}}
              activeProps={{ "aria-current": "page" }}
              {...stylex.props(styles.sidebarLink)}
              onClick={onNavigate}
            >
              {item.title}
            </Link>
          ))}
        <Accordion
          defaultValue={["foundations", "components", "api"]}
          multiple
          xstyle={styles.sections}
        >
          {["foundations", "components", "api"].map((section) => (
            <AccordionItem key={section} value={section} xstyle={styles.section}>
              <AccordionTrigger {...stylex.props(styles.sectionTrigger)}>
                {sectionNames[section]}
              </AccordionTrigger>
              <AccordionContent xstyle={styles.sectionContent}>
                {catalog
                  .filter((item) => item.section === section)
                  .map((item) => (
                    <Link
                      key={item.slug}
                      {...documentLink(item, settings.locale)}
                      search={{}}
                      activeProps={{ "aria-current": "page" }}
                      {...stylex.props(styles.sidebarLink)}
                      onClick={onNavigate}
                    >
                      {item.title}
                      {isNewComponent(item.section, item.slug) ? (
                        <Badge
                          variant="secondary"
                          xstyle={styles.newBadge}
                          data-docs="component-new-badge"
                        >
                          New
                        </Badge>
                      ) : null}
                    </Link>
                  ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </nav>
      <a {...stylex.props(styles.agentLink)} href="/llms.txt">
        LLM references ↗
      </a>
    </aside>
  );
}

function useHeaderHeight() {
  const [height, setHeight] = useState(65);
  const ref = useCallback((element: HTMLElement | null) => {
    if (!element) return;
    const observer = new ResizeObserver(() => setHeight(element.getBoundingClientRect().height));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return { ref, height };
}

const sectionNames: Record<string, string> = {
  guide: "Guides",
  foundations: "Foundations",
  components: "Components",
  api: "API",
};

const controls = [
  [
    "surface",
    "Surface",
    [
      ["solid", "Solid"],
      ["liquid", "Liquid"],
    ],
  ],
  [
    "locale",
    "Language",
    [
      ["ko", "한국어"],
      ["en", "English"],
    ],
  ],
  [
    "density",
    "Density",
    [
      ["default", "Default"],
      ["compact", "Compact"],
      ["spacious", "Spacious"],
    ],
  ],
  [
    "motionPreference",
    "Motion",
    [
      ["system", "System"],
      ["reduce", "Reduce motion"],
      ["no-preference", "Allow motion"],
    ],
  ],
] as const;
const styles = stylex.create({
  // This measured app geometry keeps navigation below a header that reflows with enlarged text.
  root: (height: number) => ({ "--docs-header-height": `${height}px` }),
  header: {
    minHeight: "65px",
    position: "sticky",
    top: "0",
    zIndex: "20",
    borderBottomWidth: sizeVars.stroke,
    borderBottomStyle: "solid",
    borderBottomColor: colorVars.strokeDefault,
    "--docs-muted": {
      default: null,
      "@supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) and\n  (background-color: color-mix(in srgb, white, transparent))":
        {
          default: null,
          [stylex.when.ancestor('[data-bolerish-surface="liquid"]', documentMarker)]:
            "color-mix(in srgb, var(--docs-foreground) 85%, var(--docs-background))",
        },
    },
    // The shell header follows the panel opacity/filter preferences without adding a panel wrapper.
    backgroundColor: {
      default: colorVars.bgSurface,
      [stylex.when.ancestor('[data-bolerish-surface="liquid"]', documentMarker)]: {
        default: colorVars.bgSurface,
        "@supports (backdrop-filter: blur(1px)) and (background-color: color-mix(in srgb, white, transparent))":
          {
            default: `color-mix(in srgb, ${colorVars.bgSurface} var(--bolerish-panel-opacity, 100%), transparent)`,
            "@media (prefers-reduced-transparency: reduce)": colorVars.bgSurface,
            "@media (forced-colors: active)": "Canvas",
          },
      },
    },
    backdropFilter: {
      default: null,
      "@supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) and\n  (background-color: color-mix(in srgb, white, transparent))":
        {
          default: null,
          [stylex.when.ancestor('[data-bolerish-surface="liquid"]', documentMarker)]:
            "var(--bolerish-floating-filter, none)",
        },
      "@media (prefers-reduced-transparency: reduce)": {
        default: null,
        [stylex.when.ancestor('[data-bolerish-surface="liquid"]', documentMarker)]: "none",
      },
      "@media (forced-colors: active)": {
        default: null,
        [stylex.when.ancestor('[data-bolerish-surface="liquid"]', documentMarker)]: "none",
      },
    },
  },
  headerInner: {
    maxWidth: "1440px",
    minHeight: "65px",
    flexWrap: "wrap",
    marginTop: "auto",
    marginRight: "auto",
    marginBottom: "auto",
    marginLeft: "auto",
    paddingInline: {
      default: spacingVars.space8,
      "@media (max-width: 760px)": spacingVars.space5,
      "@media (max-width: 420px)": spacingVars.space3,
    },
    display: "flex",
    alignItems: "center",
    gap: {
      default: `calc(${spacingVars.space0_5} * 18.0)`,
      "@media (max-width: 760px)": spacingVars.space4,
      "@media (max-width: 420px)": spacingVars.space2,
    },
  },
  brand: {
    color: colorVars.fgPrimary,
    fontFamily:
      'var(--bolerish-font-code, ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace)',
    fontWeight: typo.fontWeightMedium,
    letterSpacing: "0.035em",
    whiteSpace: "nowrap",
    flexShrink: "0",
    fontSize: typo.fontSizeSm,
    textDecoration: "none",
  },
  brandSuffix: {
    fontWeight: typo.fontWeightRegular,
    color: "var(--docs-muted)",
  },
  topNavigation: {
    display: {
      default: "flex",
      "@media (max-width: 1150px)": "none",
    },
    gap: spacingVars.space6,
    fontSize: typo.fontSizeSm,
    color: "var(--docs-muted)",
  },
  topLink: {
    textDecoration: "none",
    color: {
      default: "inherit",
      ":hover": colorVars.fgPrimary,
    },
    textUnderlineOffset: "3px",
  },
  headerActions: {
    display: "flex",
    flexWrap: "wrap",
    maxWidth: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: {
      default: spacingVars.space3,
      "@media (max-width: 760px)": `calc(${spacingVars.space0_5} * 3.0)`,
      "@media (max-width: 420px)": `calc(${spacingVars.space0_5} * 1.0)`,
    },
    marginLeft: "auto",
    minWidth: "0",
  },
  search: {
    width: {
      default: "230px",
      "@media (max-width: 760px)": sizeVars.controlSm,
      "@media (max-width: 420px)": sizeVars.controlSm,
    },
    flexShrink: "0",
  },
  // Button has a static align prop; this text-to-icon trigger changes alignment at the mobile breakpoint.
  searchTrigger: {
    width: "100%",
    justifyContent: {
      default: "flex-start",
      "@media (max-width: 760px)": "center",
    },
    paddingInline: {
      default: spacingVars.space3,
      "@media (max-width: 760px)": "0",
    },
    fontWeight: typo.fontWeightRegular,
    color: "var(--docs-muted)",
    border: "0",
  },
  languageSelect: {
    width: "110px",
    flexShrink: "0",
    display: {
      default: null,
      "@media (max-width: 760px)": "none",
    },
  },
  repositoryLink: {
    display: "inline-flex",
    alignItems: "center",
    color: "var(--docs-muted)",
    justifyContent: "center",
    width: sizeVars.controlSm,
    height: sizeVars.controlSm,
    flexShrink: "0",
  },
  preferences: {
    width: "100%",
    display: "grid",
    gap: spacingVars.space4,
  },
  preferencesTitle: {
    marginTop: "0",
    marginRight: "0",
    marginBottom: spacingVars.space1,
    marginLeft: "0",
    fontSize: typo.fontSizeSm,
    fontWeight: typo.fontWeightSemibold,
  },
  preferenceLabel: {
    display: "grid",
    gridTemplateColumns: "84px minmax(0, 1fr)",
    alignItems: "center",
    gap: spacingVars.space3,
    fontSize: `calc(${typo.fontSizeSm} * 13 / 14)`,
    color: "var(--docs-muted)",
  },
  layout: {
    display: {
      default: "grid",
      "@media (max-width: 760px)": "block",
    },
    gridTemplateColumns: "240px minmax(0, 1fr)",
    maxWidth: "1440px",
    marginTop: "auto",
    marginRight: "auto",
    marginBottom: "auto",
    marginLeft: "auto",
  },
  sidebar: {
    paddingTop: {
      default: `calc(${spacingVars.space0_5} * 14.0)`,
      "@media (max-width: 760px)": spacingVars.space6,
    },
    paddingRight: {
      default: spacingVars.space6,
      "@media (max-width: 760px)": spacingVars.space6,
    },
    paddingBottom: {
      default: spacingVars.space10,
      "@media (max-width: 760px)": spacingVars.space6,
    },
    paddingLeft: {
      default: spacingVars.space8,
      "@media (max-width: 760px)": spacingVars.space6,
    },
    height: {
      default: "calc(100vh - var(--docs-header-height, 65px))",
      "@media (max-width: 760px)": "auto",
    },
    position: {
      default: "sticky",
      "@media (max-width: 760px)": "fixed",
    },
    top: "var(--docs-header-height, 65px)",
    overflowY: "auto",
    overscrollBehavior: "contain",
    overflowAnchor: "none",
    scrollbarGutter: "stable",
    scrollbarWidth: "thin",
    scrollbarColor: {
      default: "transparent transparent",
      ":hover": "var(--docs-control) transparent",
    },
    display: {
      default: null,
      "@media (max-width: 760px)": "none",
    },
    maxHeight: {
      default: null,
      "@media (max-width: 760px)": "calc(100dvh - var(--docs-header-height, 65px))",
    },
    insetInline: {
      default: null,
      "@media (max-width: 760px)": "0",
    },
    zIndex: {
      default: null,
      "@media (max-width: 760px)": "15",
    },
    background: {
      default: null,
      "@media (max-width: 760px)": colorVars.bgSurface,
    },
    borderBottomWidth: {
      default: null,
      "@media (max-width: 760px)": sizeVars.stroke,
    },
    borderBottomStyle: {
      default: null,
      "@media (max-width: 760px)": "solid",
    },
    borderBottomColor: {
      default: null,
      "@media (max-width: 760px)": colorVars.strokeDefault,
    },
  },
  sidebarLink: {
    display: "flex",
    alignItems: "center",
    gap: spacingVars.space2,
    paddingTop: `calc(${spacingVars.space0_5} * 3.0)`,
    paddingRight: `calc(${spacingVars.space0_5} * 5.0)`,
    paddingBottom: `calc(${spacingVars.space0_5} * 3.0)`,
    paddingLeft: `calc(${spacingVars.space0_5} * 5.0)`,
    marginBlock: `calc(${spacingVars.space0_5} * 0.5)`,
    borderTopLeftRadius: "6px",
    borderTopRightRadius: "6px",
    borderBottomRightRadius: "6px",
    borderBottomLeftRadius: "6px",
    textDecoration: "none",
    fontSize: typo.fontSizeSm,
    lineHeight: typo.lineHeightNormal,
    color: {
      default: "var(--docs-muted)",
      ":hover": colorVars.fgPrimary,
      ':is([aria-current="page"])': colorVars.fgPrimary,
    },
    background: {
      default: null,
      ":hover": colorVars.bgSubtle,
      ':is([aria-current="page"])': colorVars.bgSubtle,
    },
    fontWeight: {
      default: null,
      ':is([aria-current="page"])': typo.fontWeightMedium,
    },
    textUnderlineOffset: "3px",
  },
  agentLink: {
    display: "block",
    marginTop: `calc(${spacingVars.space0_5} * 14.0)`,
    marginRight: `calc(${spacingVars.space0_5} * 5.0)`,
    marginBottom: "0",
    marginLeft: `calc(${spacingVars.space0_5} * 5.0)`,
    fontSize: typo.fontSizeXs,
    color: "var(--docs-muted)",
  },
  main: {
    minWidth: "0",
  },
  skipLink: {
    color: colorVars.fgPrimary,
    position: "fixed",
    top: {
      default: "-100px",
      ":focus": "12px",
    },
    left: "16px",
    background: colorVars.bgSurface,
    paddingTop: spacingVars.space3,
    paddingRight: spacingVars.space3,
    paddingBottom: spacingVars.space3,
    paddingLeft: spacingVars.space3,
    zIndex: "100",
  },
  menuButton: {
    display: {
      default: "none",
      "@media (max-width: 760px)": "flex",
    },
  },
  sidebarOpen: {
    display: {
      default: null,
      "@media (max-width: 760px)": "block",
    },
  },
  preferenceLanguage: {
    display: {
      default: "none",
      "@media (max-width: 760px)": "grid",
    },
  },
  searchDialog: {
    width: "min(760px, calc(100vw - 32px))",
    maxWidth: "min(760px, calc(100vw - 32px))",
    maxHeight: "calc(100dvh - 48px)",
  },
  searchCount: {
    fontSize: typo.fontSizeXs,
    color: "var(--docs-muted)",
    marginTop: "0",
    marginRight: spacingVars.space3,
    marginBottom: spacingVars.space2,
    marginLeft: spacingVars.space3,
    display: "block",
  },
  searchResults: {
    overflowY: "auto",
    maxHeight: "min(50dvh, 440px)",
    minHeight: "80px",
  },
  searchResult: {
    display: "grid",
    gap: spacingVars.space1,
    paddingTop: spacingVars.space3,
    paddingRight: spacingVars.space3,
    paddingBottom: spacingVars.space3,
    paddingLeft: spacingVars.space3,
    borderTopLeftRadius: "6px",
    borderTopRightRadius: "6px",
    borderBottomRightRadius: "6px",
    borderBottomLeftRadius: "6px",
    textDecoration: "none",
    background: {
      default: null,
      ":hover": colorVars.bgSubtle,
      ":focus-visible": colorVars.bgSubtle,
    },
  },
  searchLabel: {
    display: {
      default: null,
      "@media (max-width: 760px)": "none",
    },
  },
  preferenceControl: {
    minWidth: "0",
    width: "100%",
  },
  preferencesPopover: {
    width: "332px",
    maxWidth: "calc(100vw - 32px)",
  },
  // AccordionTrigger exposes placement-only xstyle; this compact documentation heading keeps its existing local appearance.
  sectionTrigger: {
    width: "100%",
    minHeight: sizeVars.controlSm,
    paddingTop: spacingVars.space2,
    paddingRight: `calc(${spacingVars.space0_5} * 5.0)`,
    paddingBottom: spacingVars.space2,
    paddingLeft: `calc(${spacingVars.space0_5} * 5.0)`,
    font: "inherit",
    fontSize: `calc(${typo.fontSizeSm} * 13 / 14)`,
    fontWeight: typo.fontWeightSemibold,
    color: "inherit",
    justifyContent: "space-between",
  },
  sections: {
    marginTop: spacingVars.space5,
  },
  section: {
    border: "0",
    marginTop: spacingVars.space3,
  },
  sectionContent: {
    paddingTop: "0",
    paddingRight: "0",
    paddingBottom: "0",
    paddingLeft: "0",
  },
  searchLayout: {
    display: "grid",
    gap: spacingVars.space4,
  },
  searchSections: {
    display: "flex",
    flexWrap: "wrap",
    gap: `calc(${spacingVars.space0_5} * 3.0)`,
  },
  searchSectionButton: {
    borderTopLeftRadius: radiusVars.full,
    borderTopRightRadius: radiusVars.full,
    borderBottomRightRadius: radiusVars.full,
    borderBottomLeftRadius: radiusVars.full,
  },
  searchMatches: {
    minWidth: "0",
  },
  searchResultTitle: {
    display: "flex",
    alignItems: "center",
    gap: spacingVars.space2,
    fontWeight: typo.fontWeightMedium,
  },
  newBadge: {
    marginInlineStart: "auto",
  },
  searchResultDescription: {
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: "2",
    overflow: "hidden",
    overflowWrap: "anywhere",
    color: "var(--docs-muted)",
    fontSize: `calc(${typo.fontSizeSm} * 13 / 14)`,
    lineHeight: typo.lineHeightNormal,
  },
  homeLayout: {
    display: "block",
  },
  darkIcon: {
    display: {
      default: "none",
      [stylex.when.ancestor('[data-bolerish-theme="dark"]', documentMarker)]: "block",
    },
  },
  lightIcon: {
    display: {
      default: null,
      [stylex.when.ancestor('[data-bolerish-theme="dark"]', documentMarker)]: "none",
    },
  },
  headerControl: {
    flexShrink: "0",
  },
  icon: {
    width: sizeVars.iconLg,
    height: sizeVars.iconLg,
    flexShrink: "0",
  },
});
