import { expect, test } from "@playwright/test";

import { expectColor } from "../../packages/ui/test/browser/color-assertions";

test("unknown paths render a standalone not-found document with a working recovery link", async ({
  page,
}) => {
  for (const path of ["/missing-page", "/docs/missing-guide", "/not-found"]) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "Page not found", exact: true })).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex");
    await expect(page.locator('script[src], script[type="module"]')).toHaveCount(0);
    await page.getByRole("link", { name: "Go to documentation", exact: true }).click();
    await expect(page).toHaveURL(/\/docs\/getting-started$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Introduction");
  }
});

for (const locale of ["en", "ko"] as const) {
  test(`table of contents uses accessible themed links ${locale}`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`/docs/foundations/elevation${locale === "ko" ? "/ko" : ""}?colorMode=dark`);
    await page.waitForLoadState("networkidle");
    const contents = page.getByRole("navigation", {
      name: locale === "ko" ? "이 페이지에서" : "On this page",
      exact: true,
    });
    const headingId = locale === "ko" ? "토큰-목록" : "token-reference";
    const link = contents.locator(`a[href="#${headingId}"]`);
    await expect(link).toBeVisible();
    await expectColor(link, "color", [228, 228, 231, 255]);
    await expect(link).toHaveCSS("text-decoration-line", "none");
    await link.hover();
    await expect(link).toHaveCSS("opacity", "0.72");
    await page.keyboard.press("Tab");
    await link.focus();
    await expect(link).toHaveCSS("outline-style", "solid");
    await link.click();
    await expect.poll(() => decodeURIComponent(new URL(page.url()).hash.slice(1))).toBe(headingId);
    await expect
      .poll(() =>
        page.locator(`#${headingId}`).evaluate((heading) => {
          const header = document.querySelector("header")!.getBoundingClientRect();
          const rect = heading.getBoundingClientRect();
          return rect.top >= header.bottom && rect.top < innerHeight;
        }),
      )
      .toBe(true);
  });
}

for (const width of [320, 1440]) {
  test(`critical language menu preserves document and appearance preferences at ${width}px`, async ({
    page,
    context,
  }) => {
    const preferences = {
      colorMode: "dark",
      density: "spacious",
      unit: "px",
      motionPreference: "reduce",
      fontPreset: "serif-heading",
    };
    await page.setViewportSize({ width, height: 900 });
    await context.addCookies([
      {
        name: "bolerish-docs-settings",
        value: encodeURIComponent(JSON.stringify(preferences)),
        url: test.info().project.use.baseURL!,
      },
    ]);
    await page.goto("/docs/components/button");
    await page.waitForLoadState("networkidle");
    for (const [current, next, label, choice] of [
      ["en", "ko", "Choose language", "한국어"],
      ["ko", "en", "언어 선택", "English"],
    ] as const) {
      const trigger = page.getByRole("button", { name: label, exact: true });
      await expect(trigger).toBeVisible();
      await expect(trigger).toHaveAttribute("aria-haspopup", "menu");
      await trigger.focus();
      await page.keyboard.press("ArrowDown");
      const menu = page.getByRole("menu");
      await expect(menu).toBeVisible();
      await expect(
        menu.getByRole("menuitemradio", {
          name: current === "en" ? "English" : "한국어",
          exact: true,
        }),
      ).toHaveAttribute("aria-checked", "true");
      await page.keyboard.press("Escape");
      await expect(menu).toBeHidden();
      await expect(trigger).toBeFocused();
      await trigger.click();
      const option = menu.getByRole("menuitemradio", { name: choice, exact: true });
      await option.focus();
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(
        new RegExp(`/docs/components/button${next === "ko" ? "/ko" : ""}$`),
      );
      await expect(page.locator("html")).toHaveAttribute("lang", next);
      await expect(page.locator("html")).toHaveAttribute("data-bolerish-theme", "dark");
      await expect(page.getByRole("menu")).toHaveCount(0);
      await expect
        .poll(async () => {
          const cookie = (await context.cookies()).find(
            (item) => item.name === "bolerish-docs-settings",
          )!;
          return JSON.parse(decodeURIComponent(cookie.value));
        })
        .toMatchObject(preferences);
    }
    await page.reload();
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "Settings", exact: true }).click();
    await expect(page.getByRole("combobox", { name: "Language", exact: true })).toHaveCount(0);
    await expect(page.getByRole("combobox", { name: "Density", exact: true })).toHaveValue(
      "spacious",
    );
    await expect(page.getByRole("combobox", { name: "Motion", exact: true })).toHaveValue("reduce");
  });
}

test("sidebar groups list documents alphabetically", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/docs/components/button");
  await page.waitForLoadState("networkidle");
  const sidebar = page.locator("#docs-navigation");
  for (const section of ["foundations", "components"]) {
    const labels = await sidebar.locator(`a[href^="/docs/${section}/"]`).allTextContents();
    expect(labels.length).toBeGreaterThan(1);
    expect(labels).toEqual([...labels].sort((a, b) => a.localeCompare(b, "en")));
  }
  await expect(sidebar.locator('a[href^="/docs/api/"]')).toHaveText(["Gradient"]);
});

test("document navigation stays with its content until the home gallery is ready", async ({
  page,
}) => {
  await page.goto("/docs/components/tabs");
  await expect(page.getByRole("heading", { name: "Tabs", exact: true })).toBeVisible();
  await expect(page.locator("#docs-navigation")).toBeVisible();
  await expect(async () => {
    await page.getByRole("button", { name: "Settings", exact: true }).click();
    await expect(page.getByRole("dialog")).toBeVisible({ timeout: 500 });
  }).toPass({ timeout: 15000, intervals: [500] });
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  let requested!: () => void;
  const pending = new Promise<void>((resolve) => {
    requested = resolve;
  });
  await page.route("**/assets/*.js", async (route) => {
    requested();
    await gate;
    await route.continue();
  });
  try {
    await page.getByRole("link", { name: "bolerish/ui", exact: true }).click();
    await pending;
    await expect(page.locator("#docs-navigation")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Tabs", exact: true })).toBeVisible();
  } finally {
    release();
  }
  await expect(page.locator("[data-docs=home-gallery]")).toBeVisible();
  await expect(page.locator("#docs-navigation")).toHaveCount(0);
});

test("mobile navigation stays closed when returning from home", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/docs/components/tabs");
  await page.waitForLoadState("networkidle");
  await page.getByRole("button", { name: "Toggle navigation" }).click();
  await expect(page.locator("#docs-navigation")).toBeVisible();
  await page.getByRole("link", { name: "bolerish/ui", exact: true }).click();
  await expect(page.locator("[data-docs=home-gallery]")).toBeVisible();
  await page.goBack();
  await expect(page.getByRole("heading", { name: "Tabs", exact: true })).toBeVisible();
  await expect(page.locator("#docs-navigation")).toBeHidden();
  await page.getByRole("button", { name: "Toggle navigation" }).click();
  await expect(page.locator("#docs-navigation")).toBeVisible();
});
