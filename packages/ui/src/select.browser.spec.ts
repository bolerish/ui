import { test, expect } from "@playwright/test";

test("Select supports keyboard choice and restores trigger focus", async ({ page }) => {
  await page.goto("/?fixture=select");
  const trigger = page.getByRole("combobox", { name: "Framework" });
  await trigger.focus();
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("listbox")).toBeVisible();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("listbox")).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect(trigger).not.toContainText("Choose framework");
  await trigger.click();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
});
test("Select highlights remain visible in forced colors", async ({ page }) => {
  await page.emulateMedia({ forcedColors: "active" });
  await page.goto("/?fixture=select");
  await page.getByRole("combobox", { name: "Framework" }).click();
  await page.keyboard.press("ArrowDown");
  const item = page.locator('[role="option"][data-highlighted]');
  await expect(item).toBeVisible();
  expect(
    await item.evaluate((n) => {
      const s = getComputedStyle(n);
      return s.outlineStyle !== "none" && parseFloat(s.outlineWidth) > 0;
    }),
  ).toBe(true);
});
