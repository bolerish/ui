import { test, expect } from "@playwright/test";

for (const path of ["/", "/ko"]) {
  for (const saved of [false, true]) {
    test(`critical initial gallery survives hydration ${path}/${saved ? "saved" : "default"}`, async ({
      page,
    }) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      if (saved)
        await page.context().addCookies([
          {
            name: "bolerish-docs-settings",
            value: encodeURIComponent(JSON.stringify({ colorMode: "dark", surface: "liquid" })),
            url: test.info().project.use.baseURL!,
          },
        ]);
      await page.addInitScript(() => {
        const state = window as Window & { initialGallery?: Element; initialField?: Element };
        const observer = new MutationObserver(() => {
          const gallery = document.querySelector(".home-gallery");
          const field = gallery?.querySelector('input:not([type="hidden"])');
          if (gallery && field && !gallery.closest("[hidden]")) {
            state.initialGallery = gallery;
            state.initialField = field;
            observer.disconnect();
          }
        });
        observer.observe(document, { childList: true, subtree: true });
      });
      let release!: () => void;
      const blocked = new Promise<void>((resolve) => {
        release = resolve;
      });
      const request = page.waitForRequest("**/assets/AccountCreationForm-*.js", { timeout: 10000 });
      await page.route("**/assets/AccountCreationForm-*.js", async (route) => {
        await blocked;
        await route.continue();
      });
      try {
        await page.goto(path, { waitUntil: "domcontentloaded" });
        await request;
        await page.evaluate(
          () =>
            new Promise<void>((resolve) => {
              requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
            }),
        );
        await expect(page.locator(".gallery-item").first()).toBeVisible();
      } finally {
        release();
      }
      await page.waitForLoadState("networkidle");
      await expect(page.locator(".gallery-item").first()).toBeVisible();
      await expect(page.locator("html")).toHaveAttribute(
        "data-bolerish-theme",
        saved ? "dark" : "light",
      );
      await expect(page.locator("html")).toHaveAttribute(
        "data-bolerish-surface",
        saved ? "liquid" : "solid",
      );
      await test.info().attach("hydration-errors", {
        body: JSON.stringify(errors),
        contentType: "application/json",
      });
      expect(
        await page.evaluate(() => {
          const state = window as Window & { initialGallery?: Element; initialField?: Element };
          const current = document.querySelector(".home-gallery");
          return (
            state.initialGallery?.isConnected &&
            state.initialGallery === current &&
            state.initialField === current?.querySelector('input:not([type="hidden"])')
          );
        }),
      ).toBe(true);
      expect(errors).toEqual([]);
      await page.getByRole("button", { name: "Theme:", exact: false }).click();
      expect(
        await page.locator(".home-gallery").evaluate((node) => {
          const state = window as Window & { initialGallery?: Element; initialField?: Element };
          return (
            node === state.initialGallery &&
            node.querySelector('input:not([type="hidden"])') === state.initialField
          );
        }),
      ).toBe(true);
    });
  }
}

test("critical home chunk failure retains the retry interface", async ({ page }) => {
  await page.route("**/assets/AccountCreationForm-*.js", (route) => route.abort());
  await page.goto("/");
  await expect(page.getByText("Could not load this page", { exact: true })).toBeVisible({
    timeout: 7000,
  });
  await expect(page.getByRole("button", { name: "Try again", exact: true })).toBeVisible();
});

test("critical document entry loads home examples only after navigation", async ({ page }) => {
  const examples: string[] = [];
  page.on("request", (request) => {
    if (/\/AccountCreationForm-[^/]+\.js/.test(request.url())) examples.push(request.url());
  });
  await page.goto("/docs/getting-started");
  await page.waitForLoadState("networkidle");
  await expect(page.locator(".document h1")).toBeVisible();
  expect(examples).toEqual([]);
  await page.locator(".brand").click();
  await expect(page.locator(".gallery-item").first()).toBeVisible();
  expect(examples.length).toBeGreaterThan(0);
});
