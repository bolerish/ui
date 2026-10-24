import { test, expect } from "@playwright/test";

test("Combobox filters and selects with keyboard without losing its name", async ({ page }) => {
  await page.goto("/?fixture=combobox");
  const input = page.getByRole("combobox", { name: "Framework" });
  await input.fill("Vue");
  await expect(page.getByRole("option", { name: "Vue" })).toBeVisible();
  await expect(page.getByRole("option", { name: "React", exact: true })).toHaveCount(0);
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(input).toHaveValue("Vue");
  await expect(input).toBeFocused();
});
test("Combobox forced-colors highlight has a visible keyboard edge", async ({ page }) => {
  await page.emulateMedia({ forcedColors: "active" });
  await page.goto("/?fixture=combobox");
  await page.getByRole("combobox", { name: "Framework" }).fill("R");
  await page.keyboard.press("ArrowDown");
  const item = page.locator('[role="option"][data-highlighted]');
  await expect(item).toBeVisible();
  expect(await item.evaluate((n) => getComputedStyle(n).outlineStyle)).not.toBe("none");
});

test("default trigger can be localized and null removes addons", async ({ page }) => {
  await page.goto("/?fixture=combobox");
  await expect(page.getByRole("button", { name: "옵션 열기" })).toBeVisible();
  await page.goto("/?fixture=combobox&noAddons=1");
  await expect(page.getByRole("button")).toHaveCount(0);
  await expect(page.locator("svg")).toHaveCount(0);
  await expect(page.getByRole("combobox", { name: "Framework" })).toBeVisible();
});
