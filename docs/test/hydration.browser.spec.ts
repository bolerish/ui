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
          const gallery = document.querySelector("[data-docs=home-gallery]");
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
        await expect(page.locator("[data-docs=gallery-item]").first()).toBeVisible();
      } finally {
        release();
      }
      await page.waitForLoadState("networkidle");
      await expect(page.locator("[data-docs=gallery-item]").first()).toBeVisible();
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
          const current = document.querySelector("[data-docs=home-gallery]");
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
        await page.locator("[data-docs=home-gallery]").evaluate((node) => {
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
  await expect(page.locator("[data-docs=document] h1")).toBeVisible();
  expect(examples).toEqual([]);
  await page.getByRole("link", { name: "bolerish/ui", exact: true }).click();
  await expect(page.locator("[data-docs=gallery-item]").first()).toBeVisible();
  expect(examples.length).toBeGreaterThan(0);
});

for (const path of [
  "/docs/components/toggle",
  "/docs/foundations/overview",
  "/docs/installation/ko",
]) {
  for (const colorMode of ["dark", "system", "light"]) {
    test(`SSG document DOM survives hydration ${path}/${colorMode}`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: "dark" });
      await page.context().addCookies([
        {
          name: "bolerish-docs-settings",
          value: encodeURIComponent(JSON.stringify({ colorMode })),
          url: test.info().project.use.baseURL!,
        },
      ]);
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.addInitScript(() => {
        const state = window as Window & {
          firstDocument?: Element;
          missingDocumentFrames?: number;
          documentFrames?: number;
        };
        state.missingDocumentFrames = 0;
        state.documentFrames = 0;
        function sample() {
          const article = document.querySelector("article[data-docs=document]");
          if (article && !state.firstDocument) state.firstDocument = article;
          if (state.firstDocument) {
            state.documentFrames!++;
            if (!article) state.missingDocumentFrames!++;
          }
          requestAnimationFrame(sample);
        }
        requestAnimationFrame(sample);
      });
      await page.goto(path, { waitUntil: "networkidle" });
      await expect(page.locator("article[data-docs=document] h1")).toBeVisible();
      const result = await page.evaluate(() => {
        const state = window as Window & {
          firstDocument?: Element;
          missingDocumentFrames?: number;
          documentFrames?: number;
        };
        return {
          same:
            Boolean(state.firstDocument) &&
            state.firstDocument === document.querySelector("article[data-docs=document]"),
          missing: state.missingDocumentFrames,
          frames: state.documentFrames ?? 0,
        };
      });
      expect(result.same).toBe(true);
      expect(result.missing).toBe(0);
      expect(result.frames).toBeGreaterThan(0);
      expect(errors).toEqual([]);
    });
  }
}

test("preview tabs remember each example through reload without showing the other panel", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const state = window as Window & { wrongPreviewFrames?: number };
    state.wrongPreviewFrames = 0;
    function sample() {
      const root = document.querySelector('[data-preview-name="toggle--Default"]');
      const preview = root?.querySelector('[data-preview-panel="preview"]');
      if (
        preview &&
        JSON.parse(localStorage.getItem("bolerish-preview-tabs") ?? "{}")["toggle--Default"] ===
          "code" &&
        getComputedStyle(preview).display !== "none"
      )
        state.wrongPreviewFrames!++;
      requestAnimationFrame(sample);
    }
    requestAnimationFrame(sample);
  });
  await page.goto("/docs/components/toggle", { waitUntil: "networkidle" });
  const first = page.locator('[data-preview-name="toggle--Default"]');
  const second = page.locator('[data-preview-name="toggle--Variants"]');
  await expect(first.getByRole("group", { name: "Example view" })).toHaveCSS("padding-top", "2px");
  await expect(first.getByRole("button", { name: "Preview", exact: true })).toHaveAttribute(
    "tabindex",
    "0",
  );
  await first.getByRole("button", { name: "Code", exact: true }).click();
  await expect(first.getByRole("button", { name: "Code", exact: true })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.reload({ waitUntil: "networkidle" });
  await expect(first.getByRole("button", { name: "Code", exact: true })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(first.locator('[data-preview-panel="code"]')).toBeVisible();
  await expect(first.locator('[data-preview-panel="preview"]')).toBeHidden();
  await expect(second.getByRole("button", { name: "Preview", exact: true })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  expect(
    await page.evaluate(
      () => (window as Window & { wrongPreviewFrames?: number }).wrongPreviewFrames,
    ),
  ).toBe(0);
  await expect(first.getByRole("button", { name: "Code", exact: true })).toHaveCSS(
    "box-shadow",
    "none",
  );
  await first.getByRole("button", { name: "Code", exact: true }).click();
  await expect(first.getByRole("button", { name: "Code", exact: true })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await first.getByRole("button", { name: "Code", exact: true }).focus();
  await page.keyboard.press("ArrowLeft");
  await expect(first.getByRole("button", { name: "Preview", exact: true })).toBeFocused();
  await page.keyboard.press("Space");
  await page.reload({ waitUntil: "networkidle" });
  await expect(first.getByRole("button", { name: "Preview", exact: true })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
});
