import { readFileSync } from "node:fs";

import { test, expect, type Page } from "@playwright/test";

import { openedExamples } from "../../packages/ui/test/browser/example-coverage";

const index: Array<{ section: string; slug: string }> = JSON.parse(
  readFileSync(new URL("../public/search.en.json", import.meta.url), "utf8"),
);
const routes = [
  "/",
  ...index.map(({ section, slug }) =>
    section === "guide" ? `/docs/${slug}` : `/docs/${section}/${slug}`,
  ),
];

function inspectLayout() {
  const issues: Array<{ kind: string; target: string; detail: unknown }> = [];
  const viewport = document.documentElement.clientWidth;
  if (document.documentElement.scrollWidth > viewport + 1)
    issues.push({
      kind: "page-overflow",
      target: "html",
      detail: { viewport, width: document.documentElement.scrollWidth },
    });
  for (const n of document.querySelectorAll<HTMLElement>(
    ".header-actions > button, .header-actions > a",
  )) {
    const r = n.getBoundingClientRect();
    if (!r.width || getComputedStyle(n).display === "none") continue;
    if (r.width < 24 || r.right > viewport + 1)
      issues.push({
        kind: "header-control",
        target: n.getAttribute("aria-label") ?? n.className,
        detail: { width: r.width, right: r.right, viewport },
      });
  }
  const icon = document.querySelector(".documentation-search svg");
  if (icon && icon.getBoundingClientRect().width < 16)
    issues.push({
      kind: "search-icon-clipped",
      target: "search",
      detail: icon.getBoundingClientRect().width,
    });
  const language = document.querySelector(".language-select");
  if (innerWidth <= 760 && language && language.getBoundingClientRect().width > 0)
    issues.push({
      kind: "mobile-language-not-collapsed",
      target: "language",
      detail: language.getBoundingClientRect().width,
    });
  const ctx = document.createElement("canvas").getContext("2d")!;
  for (const n of document.querySelectorAll<HTMLElement>(".document th")) {
    if (n.closest(".preview-canvas")) continue;
    const s = getComputedStyle(n);
    ctx.font = `${s.fontWeight} ${s.fontSize} ${s.fontFamily}`;
    const words = n.textContent?.match(/[a-zA-Z][a-zA-Z-]*/g) ?? [];
    const longest = Math.max(0, ...words.map((word) => ctx.measureText(word).width));
    const available =
      n.getBoundingClientRect().width - parseFloat(s.paddingLeft) - parseFloat(s.paddingRight);
    if (available + 1 < longest)
      issues.push({
        kind: "table-word-squeezed",
        target: n.textContent ?? "",
        detail: { available, longest },
      });
  }
  for (const n of document.querySelectorAll<HTMLElement>(".document pre")) {
    const content = n.parentElement!;
    const copy = content.parentElement?.querySelector("button");
    if (copy && content.getBoundingClientRect().right > copy.getBoundingClientRect().left + 1)
      issues.push({
        kind: "copy-over-code",
        target: n.textContent?.slice(0, 70) ?? "",
        detail: {
          codeRight: content.getBoundingClientRect().right,
          buttonLeft: copy.getBoundingClientRect().left,
        },
      });
  }
  for (const n of document.querySelectorAll<HTMLElement>(".preview-canvas, .gallery-preview")) {
    if (n.scrollWidth > n.clientWidth + 2)
      issues.push({
        kind: "example-overflow",
        target:
          n.closest("article")?.querySelector("h3")?.textContent ??
          n.querySelector("h3")?.textContent ??
          "preview",
        detail: { width: n.clientWidth, scroll: n.scrollWidth },
      });
  }
  return issues;
}

async function appearance(page: Page, colorMode: "light" | "dark") {
  await page.context().addCookies([
    {
      name: "bolerish-docs-settings",
      value: encodeURIComponent(JSON.stringify({ colorMode, motionPreference: "reduce" })),
      url: test.info().project.use.baseURL!,
    },
  ]);
}

for (const width of [320, 390, 768, 1024, 1440]) {
  for (const locale of ["en", "ko"] as const) {
    for (const theme of ["light", "dark"] as const) {
      test(`all pages ${width}/${locale}/${theme}`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await appearance(page, theme);
        const issues: Array<{ path: string; failures: ReturnType<typeof inspectLayout> }> = [];
        for (const route of routes) {
          const path = `${route === "/" ? "" : route}${locale === "ko" ? "/ko" : route === "/" ? "/" : ""}`;
          await page.goto(path);
          await expect(page.locator("h1").first()).toBeVisible();
          await expect(
            page.locator(route === "/" ? ".gallery-preview" : ".document").first(),
          ).toBeVisible();
          await expect(page.locator("html")).toHaveAttribute("data-bolerish-theme", theme);
          const failures = await page.evaluate(inspectLayout);
          if (failures.length) issues.push({ path, failures });
        }
        await test.info().attach("layout-audit", {
          body: JSON.stringify({ width, locale, theme, checked: routes.length, issues }, null, 2),
          contentType: "application/json",
        });
        expect(issues, JSON.stringify(issues, null, 2)).toEqual([]);
      });
    }
  }
}

for (const width of [320, 390, 768]) {
  test(`critical reading ${width}/en/light`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await appearance(page, "light");
    await page.goto("/docs/lint");
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("heading", { name: "Rules", exact: true })).toBeVisible();
    const issues = await page.evaluate(inspectLayout);
    expect(issues, JSON.stringify(issues, null, 2)).toEqual([]);
    await page.getByRole("tab", { name: "bun", exact: true }).click();
    await expect(page.getByRole("tabpanel", { name: "bun", exact: true })).toContainText(
      "bun add --dev @bolerish/lint",
    );
    const table = page.getByRole("region", { name: "Documentation table" }).first();
    await table.scrollIntoViewIfNeeded();
    await table.evaluate((node) => {
      node.scrollLeft = node.scrollWidth;
    });
    expect(await table.evaluate((node) => node.scrollLeft)).toBeGreaterThan(0);
    await table.evaluate((node) => {
      node.scrollLeft = 0;
    });
    await test.info().attach("lint-reading", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  });
}

for (const locale of ["en", "ko"] as const) {
  for (const theme of ["light", "dark"] as const) {
    test(`critical mobile controls ${locale}/${theme}`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await appearance(page, theme);
      await page.goto(`/docs/lint${locale === "ko" ? "/ko" : ""}`);
      await page.waitForLoadState("networkidle");
      const heading = page.locator("h1").first();
      await expect(heading).toBeVisible();
      const top = await heading.evaluate((node) => node.getBoundingClientRect().top);
      const menu = page.getByRole("button", { name: "Toggle navigation" });
      await menu.click();
      await expect(menu).toHaveAttribute("aria-expanded", "true");
      await expect(page.locator("#docs-navigation")).toBeVisible();
      expect(await heading.evaluate((node) => node.getBoundingClientRect().top)).toBe(top);
      await menu.click();

      await page
        .getByRole("button", {
          name: locale === "ko" ? "문서 검색" : "Search documentation",
          exact: true,
        })
        .click();
      const search = page.getByRole("dialog");
      await expect(search).toBeVisible();
      await search.getByRole("textbox").fill("button");
      await expect(search.locator(".search-results a").first()).toBeVisible();
      expect(
        await search.evaluate((node) => {
          const rect = node.getBoundingClientRect();
          return rect.left >= 0 && rect.right <= document.documentElement.clientWidth;
        }),
      ).toBe(true);
      await search
        .getByRole("button", { name: locale === "ko" ? "닫기" : "Close", exact: true })
        .click();

      await page
        .getByRole("button", { name: locale === "ko" ? "설정" : "Settings", exact: true })
        .click();
      await page.getByRole("combobox", { name: "Density" }).selectOption("spacious");
      const preferences = page.locator(".preferences-popover");
      expect(
        await preferences.evaluate((node) => {
          const rect = node.getBoundingClientRect();
          return rect.left >= 0 && rect.right <= document.documentElement.clientWidth;
        }),
      ).toBe(true);
      await page.keyboard.press("Escape");
      expect(await page.evaluate(inspectLayout)).toEqual([]);

      for (const name of ["calendar", "attachment", "carousel", "pagination"]) {
        await page.goto(`/docs/components/${name}${locale === "ko" ? "/ko" : ""}`);
        await expect(page.locator(".preview-canvas").first()).toBeVisible();
        expect(await page.evaluate(inspectLayout), name).toEqual([]);
      }
      await page.goto(locale === "ko" ? "/ko" : "/");
      await expect(page.locator(".gallery-preview").first()).toBeVisible();
      expect(await page.evaluate(inspectLayout)).toEqual([]);
      await test.info().attach("mobile-home", {
        body: await page.screenshot(),
        contentType: "image/png",
      });
    });
  }
}

for (const enlarged of [false, true]) {
  test(`critical ${enlarged ? "enlarged text" : "landscape"} controls`, async ({ page }) => {
    await page.setViewportSize(
      enlarged ? { width: 390, height: 844 } : { width: 844, height: 390 },
    );
    await appearance(page, "light");
    await page.goto("/docs/lint");
    await page.waitForLoadState("networkidle");
    if (enlarged)
      await page.evaluate(() => {
        document.documentElement.style.fontSize = "200%";
      });
    expect(await page.evaluate(inspectLayout)).toEqual([]);
    await page.getByRole("button", { name: "Settings", exact: true }).click();
    const preferences = page.locator(".preferences-popover");
    await expect(preferences).toBeVisible();
    expect(
      await preferences.evaluate((node) => {
        const rect = node.getBoundingClientRect();
        return (
          rect.top >= 0 &&
          rect.bottom <= innerHeight &&
          rect.left >= 0 &&
          rect.right <= document.documentElement.clientWidth
        );
      }),
    ).toBe(true);
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: "Search documentation", exact: true }).click();
    const search = page.getByRole("dialog");
    await expect(search).toBeVisible();
    expect(
      await search.evaluate((node) => {
        const rect = node.getBoundingClientRect();
        return (
          rect.top >= 0 &&
          rect.bottom <= innerHeight &&
          rect.left >= 0 &&
          rect.right <= document.documentElement.clientWidth
        );
      }),
    ).toBe(true);
  });
}

for (const viewport of [
  { width: 320, height: 740 },
  { width: 844, height: 390 },
]) {
  test(`critical mobile overlays ${viewport.width}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await appearance(page, "light");
    for (const name of [
      "dialog",
      "drawer",
      "popover",
      "select",
      "combobox",
      "dropdown-menu",
      "date-picker",
    ] as const) {
      await page.goto(`/docs/components/${name}`);
      await page.waitForLoadState("networkidle");
      const opening = openedExamples[name];
      const preview = page.locator(".preview-canvas").first();
      if (opening.action === "fill") {
        const input = preview.getByRole("combobox", { name: opening.name });
        await input.scrollIntoViewIfNeeded();
        await input.fill("Re");
      } else if (opening.action === "combobox")
        await preview.getByRole("combobox", { name: opening.name }).click();
      else await preview.getByRole("button", { name: opening.name, exact: true }).click();
      const popup = page.locator(opening.target).first();
      await expect(popup).toBeVisible();
      const rect = await popup.boundingBox();
      expect(rect!.x, name).toBeGreaterThanOrEqual(0);
      expect(rect!.x + rect!.width, name).toBeLessThanOrEqual(viewport.width + 1);
      expect(rect!.y, name).toBeGreaterThanOrEqual(0);
      expect(rect!.y + rect!.height, name).toBeLessThanOrEqual(viewport.height + 1);
    }
  });
}
