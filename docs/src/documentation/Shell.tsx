import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@bolerish/ui/accordion";
import { Button } from "@bolerish/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@bolerish/ui/dialog";
import { Input } from "@bolerish/ui/input";
import { NativeSelect } from "@bolerish/ui/native-select";
import { Popover, PopoverTrigger, PopoverContent } from "@bolerish/ui/popover";
import {
  Select,
  SelectPopup,
  SelectList,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@bolerish/ui/select";
import {
  SlidersHorizontalIcon,
  ListIcon,
  GithubLogoIcon,
  MagnifyingGlassIcon,
  SunIcon,
  MoonIcon,
  DesktopIcon,
} from "@phosphor-icons/react";
import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

import { catalog } from "./catalog";
import { documentLink, localizedPath } from "./paths";
import { searchDocuments, type SearchDocument } from "./search";
import type { DocumentationGlobals } from "./settings";
import { useDocumentationGlobals, useDocumentationPreferences } from "./useDocumentationGlobals";

const sectionNames: Record<string, string> = {
  guide: "Guides",
  foundations: "Foundations",
  patterns: "Patterns",
  components: "Components",
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
export function Shell({ children }: { children: ReactNode }) {
  const settings = useDocumentationGlobals();
  const navigate = useNavigate();
  const location = useLocation();
  const home = location.pathname === "/" || location.pathname === "/ko";
  const setPreferences = useDocumentationPreferences();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState(settings.q);
  const [searchSection, setSearchSection] = useState("all");
  const nextTheme = { light: "dark", dark: "system", system: "light" } as const;
  function update(changes: Partial<DocumentationGlobals>) {
    if (changes.locale) {
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
  return (
    <>
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      <header className="site-header">
        <div className="header-inner">
          <Link className="brand" to={settings.locale === "ko" ? "/ko" : "/"} search={{}}>
            bolerish<span>/ui</span>
          </Link>
          <nav className="top-navigation" aria-label="Sections">
            <Link
              {...documentLink({ section: "guide", slug: "getting-started" }, settings.locale)}
              search={{}}
            >
              Docs
            </Link>
          </nav>
          <div className="header-actions">
            <Dialog
              open={searchOpen}
              onOpenChange={(open) => {
                setSearchError(false);
                setSearchOpen(open);
              }}
            >
              <DialogTrigger
                render={
                  <Button
                    className="documentation-search"
                    variant="secondary"
                    aria-label={settings.locale === "ko" ? "문서 검색" : "Search documentation"}
                  >
                    <MagnifyingGlassIcon aria-hidden="true" />
                    <span>{settings.locale === "ko" ? "문서 검색…" : "Search documentation…"}</span>
                  </Button>
                }
              />
              <DialogContent
                className="search-dialog"
                closeLabel={settings.locale === "ko" ? "닫기" : "Close"}
              >
                <DialogTitle>
                  {settings.locale === "ko" ? "문서 검색" : "Search documentation"}
                </DialogTitle>
                <Input
                  aria-label={
                    settings.locale === "ko" ? "문서 제목과 내용 검색" : "Search titles and content"
                  }
                  placeholder={
                    settings.locale === "ko"
                      ? "제목과 내용으로 문서 찾기…"
                      : "Search titles and content…"
                  }
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
                <div className="search-layout">
                  <nav
                    className="search-sections"
                    aria-label={settings.locale === "ko" ? "검색 분류" : "Search sections"}
                  >
                    {["all", "guide", "foundations", "patterns", "components"].map((section) => (
                      <Button
                        key={section}
                        size="sm"
                        variant={searchSection === section ? "secondary" : "ghost"}
                        aria-pressed={searchSection === section}
                        onClick={() => setSearchSection(section)}
                      >
                        <span>
                          {section === "all"
                            ? settings.locale === "ko"
                              ? "#전체"
                              : "#All"
                            : `#${sectionNames[section]}`}
                        </span>
                      </Button>
                    ))}
                  </nav>
                  <div className="search-matches">
                    <output className="search-count" aria-live="polite">
                      {searchError
                        ? settings.locale === "ko"
                          ? "검색을 불러오지 못했습니다. 창을 닫고 다시 열어주세요."
                          : "Could not load search. Close and reopen to retry."
                        : !ready
                          ? settings.locale === "ko"
                            ? "검색 준비 중…"
                            : "Preparing search…"
                          : !searching
                            ? settings.locale === "ko"
                              ? "검색어를 입력하거나 분류를 선택하세요."
                              : "Search documentation or choose a category."
                            : `${visible.length}${settings.locale === "ko" ? "개 문서" : " documents"}`}
                    </output>
                    <nav className="search-results" aria-label="Search results">
                      {(searching ? visible : []).map((item) => (
                        <Link
                          key={`${item.section}/${item.slug}`}
                          {...documentLink(item, settings.locale)}
                          search={{}}
                          onClick={() => {
                            setSearchOpen(false);
                            setMenuOpen(false);
                          }}
                        >
                          <span className="search-result-title">{item.title}</span>
                          <span className="search-result-description">{item.description}</span>
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
            <Select
              value={settings.locale}
              items={{ en: "English", ko: "한국어" }}
              onValueChange={(value) => {
                if (value === "en" || value === "ko") update({ locale: value });
              }}
            >
              <SelectTrigger className="language-select" aria-label="Language">
                <SelectValue />
              </SelectTrigger>
              <SelectPopup>
                <SelectList>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ko">한국어</SelectItem>
                </SelectList>
              </SelectPopup>
            </Select>
            <Popover>
              <PopoverTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={settings.locale === "ko" ? "설정" : "Settings"}
                  >
                    <SlidersHorizontalIcon aria-hidden="true" />
                  </Button>
                }
              />
              <PopoverContent className="preferences-popover" align="end" side="bottom">
                <div className="preferences">
                  <p className="preferences-title">
                    {settings.locale === "ko" ? "설정" : "Settings"}
                  </p>
                  {controls.map(([name, label, options]) => (
                    <label
                      key={name}
                      className={name === "locale" ? "preference-language" : undefined}
                    >
                      <span>{label}</span>
                      <NativeSelect
                        aria-label={label}
                        value={settings[name]}
                        onChange={(event) => update({ [name]: event.target.value })}
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
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Theme: ${settings.colorMode}. Switch to ${nextTheme[settings.colorMode]}`}
              title={`Theme: ${settings.colorMode}`}
              onClick={() => update({ colorMode: nextTheme[settings.colorMode] })}
            >
              {settings.colorMode === "dark" ? (
                <MoonIcon aria-hidden="true" />
              ) : settings.colorMode === "light" ? (
                <SunIcon aria-hidden="true" />
              ) : (
                <DesktopIcon aria-hidden="true" />
              )}
            </Button>
            <a
              className="repository-link"
              href="https://github.com/myjeong19/ui"
              aria-label="GitHub repository"
            >
              <GithubLogoIcon size={20} aria-hidden="true" />
            </a>
            {!home ? (
              <Button
                className="menu-button"
                variant="ghost"
                size="icon"
                aria-label="Toggle navigation"
                aria-expanded={menuOpen}
                aria-controls="docs-navigation"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <ListIcon aria-hidden="true" />
              </Button>
            ) : null}
          </div>
        </div>
      </header>
      <div className={home ? "site-layout home-layout" : "site-layout"}>
        {!home ? (
          <aside className={menuOpen ? "sidebar open" : "sidebar"} id="docs-navigation">
            <nav aria-label="Documentation">
              {catalog
                .filter((item) => item.section === "guide")
                .map((item) => (
                  <Link
                    key={item.slug}
                    {...documentLink(item, settings.locale)}
                    search={{}}
                    activeProps={{ "aria-current": "page", className: "active" }}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.title}
                  </Link>
                ))}
              <Accordion
                defaultValue={["foundations", "patterns", "components"]}
                multiple
                className="sidebar-sections"
              >
                {["foundations", "patterns", "components"].map((section) => (
                  <AccordionItem key={section} value={section} className="sidebar-section">
                    <AccordionTrigger className="sidebar-section-trigger">
                      {sectionNames[section]}
                    </AccordionTrigger>
                    <AccordionContent className="sidebar-section-content">
                      {catalog
                        .filter((item) => item.section === section)
                        .map((item) => (
                          <Link
                            key={item.slug}
                            {...documentLink(item, settings.locale)}
                            search={{}}
                            activeProps={{ "aria-current": "page", className: "active" }}
                            onClick={() => setMenuOpen(false)}
                          >
                            {item.title}
                          </Link>
                        ))}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </nav>
            <a className="agent-link" href="/llms.txt">
              LLM references ↗
            </a>
          </aside>
        ) : null}
        <main id="content" tabIndex={-1}>
          {children}
        </main>
      </div>
    </>
  );
}
