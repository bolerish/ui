import { expect, test } from "@playwright/test";

for (const [query, delay] of [
  ["", 150],
  ["&trigger=500", 500],
] as const) {
  test(`HoverCard honors its ${delay}ms hover delay`, async ({ page }) => {
    await page.goto(`/?fixture=hover-card-delay${query}`);
    await page.evaluate(() => {
      document.documentElement.dataset.bolerishMotion = "on";
    });
    const start = Date.now();
    await page.getByText("Preview destination", { exact: true }).hover();
    const popup = page.getByText("Destination details", { exact: true });
    await expect(popup).toBeVisible({ timeout: delay + 500 });
    expect(Date.now() - start).toBeGreaterThanOrEqual(delay - 60);
    expect(Date.now() - start).toBeLessThan(delay + 600);
    await expect(popup).toHaveCSS("transition-duration", "0.12s");
  });
}
