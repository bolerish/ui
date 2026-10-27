import { expect, test } from "@playwright/test";

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
    await page.route("**/assets/*.js", (route) => route.abort());
    await page.goto("/docs/theming");
    const foreground = mode === "dark" ? "rgb(245, 246, 248)" : "rgb(8, 9, 10)";
    const secondary = mode === "dark" ? "rgb(138, 143, 152)" : "rgb(56, 59, 63)";
    const subtle = mode === "dark" ? "rgb(22, 23, 24)" : "rgb(245, 245, 245)";
    const assertTheme = async () => {
      await expect(page.locator("html")).toHaveAttribute("data-bolerish-theme", mode);
      await expect(page.locator(".document h1")).toHaveCSS("color", foreground);
      await expect(page.locator(".document p").first()).toHaveCSS("color", secondary);
      await expect(page.locator(".language-select")).toHaveCSS("color", foreground);
      await expect(page.locator(".document pre").first().locator("../..")).toHaveCSS(
        "background-color",
        subtle,
      );
    };
    // Static document colors must work before client chunks can hydrate it.
    await assertTheme();
    expect(stylesheetFailures).toEqual([]);
    await page.unroute("**/assets/*.js");
    await page.reload();
    await assertTheme();
    const navigation = page.getByRole("button", { name: "Toggle navigation" });
    if (await navigation.isVisible()) await navigation.click();
    await page.locator('.sidebar a[href="/docs/styling"]').click();
    await expect(page.locator(".document h1")).toHaveText("Styling");
    if (await navigation.isVisible()) await navigation.click();
    await page.locator('.sidebar a[href="/docs/theming"]').click();
    await expect(page.locator(".document h1")).toHaveText("Theming");
    await assertTheme();
    expect(stylesheetFailures).toEqual([]);
  });
}
