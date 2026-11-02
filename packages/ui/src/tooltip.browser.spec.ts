import { expect, test } from "@playwright/test";
for (const [query, delay, upperBound] of [
  ["", 150, 450],
  ["&provider=500", 500, 850],
  ["&provider=500&trigger=20", 20, 350],
] as const) {
  test(`Tooltip honors its ${delay}ms opening delay (${query || "default"})`, async ({ page }) => {
    await page.goto(`/?fixture=tooltip-delay${query}`);
    const start = Date.now();
    await page.getByRole("button", { name: "Timing help" }).hover();
    await expect(page.getByRole("tooltip")).toBeVisible({ timeout: upperBound });
    const elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThanOrEqual(Math.max(0, delay - 60));
    expect(elapsed).toBeLessThan(upperBound + 100);
  });
}
