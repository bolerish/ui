import { expect, test } from "@playwright/test";

test("sidebar is present in initial HTML and renders inline", async ({ page, request }) => {
  const response = await request.get("/docs/components/sidebar");
  expect(await response.text()).toContain('aria-label="Navigation"');
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/docs/components/sidebar");
    const preview = page.locator('[data-preview-name="sidebar--Default"]').first();
    await expect(preview.locator("iframe")).toHaveCount(0);
    await expect(preview.locator('[data-docs="preview-canvas"]')).toHaveCSS("height", "400px");
    await page.waitForLoadState("networkidle");
    await preview.getByRole("button", { name: "Toggle sidebar" }).click();
    if (width < 768) await expect(page.getByRole("dialog", { name: "Navigation" })).toBeVisible();
    else
      await expect(preview.getByRole("navigation", { name: "Navigation" })).toHaveCSS(
        "width",
        "48px",
      );
    await page.screenshot({ path: `/tmp/sidebar-inline-${width}.png` });
  }
});

test("home never mounts the Sidebar demo", async ({ page }) => {
  for (const path of ["/", "/ko"]) {
    await page.goto(path);
    await expect(
      page
        .getByRole("heading", { name: "Components & blocks" })
        .or(page.getByRole("heading", { name: "컴포넌트와 블록" })),
    ).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Navigation" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Toggle sidebar" })).toHaveCount(0);
    await expect(page.locator("iframe[src*=sidebar]")).toHaveCount(0);
  }
});

test("ordinary previews share the fixed canvas height", async ({ page }) => {
  await page.goto("/docs/components/button");
  const canvas = page.locator('[data-docs="preview-canvas"]').first();
  await expect(canvas).toHaveCSS("height", "400px");
  await expect(canvas).toHaveCSS("resize", "none");
});

test("SSR preview survives hydration without a preview document request", async ({ browser }) => {
  const staticContext = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await staticContext.newPage();
  await staticPage.goto("/docs/components/sidebar");
  await expect(
    staticPage
      .locator('[data-preview-name="sidebar--Default"]')
      .getByRole("navigation", { name: "Navigation" }),
  ).toBeVisible();
  await staticContext.close();
  const context = await browser.newContext();
  const page = await context.newPage();
  const previewRequests: string[] = [];
  page.on("request", (request) => {
    if (new URL(request.url()).pathname.startsWith("/preview/"))
      previewRequests.push(request.url());
  });
  await page.addInitScript(() => {
    const state = { seen: false, disappeared: false };
    Object.assign(window, { sidebarPresence: state });
    new MutationObserver(() => {
      const nav = document.querySelector('[data-preview-name="sidebar--Default"] nav');
      if (nav) state.seen = true;
      else if (state.seen) state.disappeared = true;
    }).observe(document, { childList: true, subtree: true });
  });
  await page.goto("/docs/components/sidebar");
  await page.waitForLoadState("networkidle");
  expect(
    await page.evaluate(() => (window as unknown as { sidebarPresence: unknown }).sidebarPresence),
  ).toEqual({ seen: true, disappeared: false });
  expect(previewRequests).toEqual([]);
  await context.close();
});

test("Button and Select retain their SSR preview nodes during hydration", async ({ browser }) => {
  for (const component of ["button", "select"]) {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.addInitScript(() => {
      const state = { first: null as Element | null, replaced: false };
      Object.assign(window, { previewIdentity: state });
      new MutationObserver(() => {
        const canvas = document.querySelector('[data-docs="preview-canvas"]');
        if (!state.first && canvas) state.first = canvas;
        if (state.first && !state.first.isConnected) state.replaced = true;
      }).observe(document, { childList: true, subtree: true });
    });
    const requests: string[] = [];
    page.on("request", (req) => {
      if (new URL(req.url()).pathname.startsWith("/preview/")) requests.push(req.url());
    });
    await page.goto(`/docs/components/${component}`);
    await page.waitForLoadState("networkidle");
    expect(
      await page.evaluate(() => {
        const state = (
          window as unknown as { previewIdentity: { first: Element | null; replaced: boolean } }
        ).previewIdentity;
        return { present: !!state.first, replaced: state.replaced };
      }),
    ).toEqual({ present: true, replaced: false });
    const staticContext = await browser.newContext({ javaScriptEnabled: false });
    const staticPage = await staticContext.newPage();
    await staticPage.goto(`/docs/components/${component}`);
    await expect(staticPage.locator('[data-docs="preview-canvas"]').first()).toBeVisible();
    console.log(
      `${component}: SSR canvas present; hydration retained; preview requests=${requests.length}`,
    );
    await staticContext.close();
    await context.close();
  }
});

test("example code has a numbered gutter and comfortable spacing", async ({ page }) => {
  await page.goto("/docs/components/sidebar");
  const preview = page.locator('[data-preview-name="sidebar--Default"]').first();
  await preview.locator('[data-preview-trigger="code"]').click();
  const block = preview.locator('[data-docs="codeblock"]');
  const numbers = block.locator("[data-code-line-number]");
  await expect(numbers.nth(0)).toHaveText("1");
  await expect(numbers.nth(1)).toHaveText("2");
  await expect(numbers.nth(0)).toHaveAttribute("aria-hidden", "true");
  await expect(numbers.nth(0)).toHaveCSS("user-select", "none");
});

test("mobile sidebar stays inside preview", async ({ page }) => {
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/docs/components/sidebar");
    const preview = page.locator('[data-preview-name="sidebar--Default"]').first();
    await preview.locator('[data-docs="preview-canvas"]').scrollIntoViewIfNeeded();
    await preview.getByRole("button", { name: "Toggle sidebar" }).click();
    const popup = page.getByRole("dialog", { name: "Navigation" });
    await expect(popup).toBeVisible();
    await page.screenshot({ path: `/tmp/sidebar-scoped-${width}.png` });
    const canvas = await preview.locator('[data-docs="preview-canvas"]').boundingBox();
    for (const element of [popup, page.locator("[data-bolerish-modal-backdrop]").first()]) {
      const rect = await element.boundingBox();
      expect(rect!.y).toBeGreaterThanOrEqual(canvas!.y);
      expect(rect!.y + rect!.height).toBeLessThanOrEqual(canvas!.y + canvas!.height);
      expect(rect!.x).toBeGreaterThanOrEqual(canvas!.x);
      expect(rect!.x + rect!.width).toBeLessThanOrEqual(canvas!.x + canvas!.width);
    }
    await page.keyboard.press("Escape");
    await expect(popup).toBeHidden();
    await expect(preview.getByRole("button", { name: "Toggle sidebar" })).toBeFocused();
  }
});
