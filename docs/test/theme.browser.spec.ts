import { expect, test } from "@playwright/test";

for (const locale of ["en", "ko"] as const) {
  test(`elevation reference values follow manual and system themes ${locale}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto(`/docs/foundations/elevation${locale === "ko" ? "/ko" : ""}?colorMode=light`);
    await page.waitForLoadState("networkidle");
    const shadows = page.locator("[data-docs=document] article").filter({
      has: page.locator("strong", { hasText: /^shadowVars\./ }),
    });
    await expect(shadows).toHaveCount(3);
    const values = () => shadows.locator("code:last-child").allTextContents();
    const assertValues = async () => {
      // Parse the displayed CSS through the browser, then compare it with the actual sample.
      await expect
        .poll(() =>
          shadows.evaluateAll((cards) =>
            cards.map((card) => {
              const probe = document.createElement("div");
              probe.style.boxShadow = card.querySelector("code:last-child")!.textContent!;
              card.append(probe);
              const matches =
                getComputedStyle(probe).boxShadow ===
                getComputedStyle(card.firstElementChild!).boxShadow;
              probe.remove();
              return matches;
            }),
          ),
        )
        .toEqual([true, true, true]);
    };
    await assertValues();
    const light = await values();
    await page.getByRole("button", { name: "Theme: light. Switch to dark", exact: true }).click();
    await expect(page.locator("html")).toHaveAttribute("data-bolerish-theme", "dark");
    await assertValues();
    const dark = await values();
    expect(dark).not.toEqual(light);
    await page.getByRole("button", { name: "Theme: dark. Switch to system", exact: true }).click();
    await expect(page.locator("html")).toHaveAttribute("data-bolerish-theme", "light");
    await assertValues();
    expect(await values()).toEqual(light);
    await page.emulateMedia({ colorScheme: "dark" });
    await expect(page.locator("html")).toHaveAttribute("data-bolerish-theme", "dark");
    await assertValues();
    expect(await values()).toEqual(dark);
  });
}

for (const mode of ["light", "dark"] as const) {
  test(`critical compiled documentation tokens follow ${mode} mode`, async ({ page }) => {
    await page.context().addCookies([
      {
        name: "bolerish-docs-settings",
        value: encodeURIComponent(JSON.stringify({ colorMode: mode })),
        url: test.info().project.use.baseURL!,
      },
    ]);
    const stylesheetFailures: string[] = [];
    page.on("response", (response) => {
      if (response.url().endsWith(".css") && response.status() >= 400)
        stylesheetFailures.push(response.url());
    });
    let release!: () => void;
    const blocked = new Promise<void>((resolve) => {
      release = resolve;
    });
    await page.route("**/assets/*.js", async (route) => {
      await blocked;
      await route.continue();
    });
    const foreground = mode === "dark" ? "rgb(245, 246, 248)" : "rgb(8, 9, 10)";
    const secondary = mode === "dark" ? "rgb(138, 143, 152)" : "rgb(56, 59, 63)";
    const subtle = mode === "dark" ? "rgb(22, 23, 24)" : "rgb(245, 245, 245)";
    const assertTheme = async () => {
      await expect(page.locator("html")).toHaveAttribute("data-bolerish-theme", mode);
      await expect(page.locator("body")).toHaveCSS(
        "background-color",
        mode === "light" ? "rgb(255, 255, 255)" : "rgb(15, 16, 17)",
      );
      const surface = mode === "light" ? "rgb(255, 255, 255)" : "rgb(15, 16, 17)";
      await expect(page.locator("[data-docs=site-header]")).toHaveCSS("background-color", surface);
      await expect
        .poll(() => page.locator("[data-docs=documentation-search]").evaluate(readBackground))
        .toEqual(mode === "light" ? [255, 255, 255, 255] : [15, 16, 17, 255]);
      await expect(page.locator("html")).toHaveCSS("color", foreground);
      await expect(page.locator("[data-docs=document] h1")).toHaveCSS("color", foreground);
      await expect(page.locator("[data-docs=document] p").first()).toHaveCSS("color", secondary);
      await expect(page.locator("[data-docs=language-select]")).toHaveCSS("color", foreground);
      await expect(page.locator("[data-docs=document] pre").first().locator("../..")).toHaveCSS(
        "background-color",
        subtle,
      );
    };
    // Static document colors must work before client chunks can hydrate it.
    try {
      await page.goto("/docs/theming", { waitUntil: "commit" });
      await assertTheme();
      expect(stylesheetFailures).toEqual([]);
    } finally {
      release();
    }
    await page.waitForLoadState("networkidle");
    await assertTheme();
    const navigation = page.getByRole("button", { name: "Toggle navigation" });
    if (await navigation.isVisible()) {
      await navigation.click();
      await expect(navigation).toHaveAttribute("aria-expanded", "true");
    }
    await page.locator('[data-docs=sidebar] a[href="/docs/styling"]').click();
    await expect(page.locator("[data-docs=document] h1")).toHaveText("Styling");
    if (await navigation.isVisible()) {
      await navigation.click();
      await expect(navigation).toHaveAttribute("aria-expanded", "true");
    }
    await page.locator('[data-docs=sidebar] a[href="/docs/theming"]').click();
    await expect(page.locator("[data-docs=document] h1")).toHaveText("Theming");
    await assertTheme();
    expect(stylesheetFailures).toEqual([]);
    await page.goto(`/docs/components/input?colorMode=${mode}`);
    await expect
      .poll(() => page.locator("[data-docs=preview-canvas] input").first().evaluate(readBackground))
      .toEqual(mode === "light" ? [255, 255, 255, 255] : [15, 16, 17, 255]);
  });
}

test("documentation shell follows custom semantic token values", async ({ page }) => {
  await page.goto("/docs/theming");
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => {
    const root = document.documentElement;
    for (const [alias, value] of [
      ["--docs-foreground", "rgb(20, 40, 60)"],
      ["--docs-background", "rgb(230, 235, 240)"],
    ]) {
      const reference = root.style.getPropertyValue(alias).match(/^var\((--[^)]+)\)$/)?.[1];
      if (!reference) throw new Error(`${alias} must reference a semantic token`);
      root.style.setProperty(reference, value);
    }
  });
  await expect(page.locator("[data-docs=document] h1")).toHaveCSS("color", "rgb(20, 40, 60)");
  await expect(page.locator("body")).toHaveCSS("background-color", "rgb(230, 235, 240)");
  await expect(page.locator("[data-docs=site-header]")).toHaveCSS(
    "background-color",
    "rgb(230, 235, 240)",
  );
});

// Normalize CSS color notation through the browser for RGB and color-mix surfaces.
function readBackground(element: Element) {
  const context = document.createElement("canvas").getContext("2d")!;
  context.fillStyle = getComputedStyle(element).backgroundColor;
  context.fillRect(0, 0, 1, 1);
  return [...context.getImageData(0, 0, 1, 1).data];
}
