import { test, expect } from "@playwright/test";

test("Dialog names its modal, contains focus and returns it after Escape", async ({ page }) => {
  await page.goto("/?fixture=dialog");
  const trigger = page.getByRole("button", { name: "Open dialog" });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Edit project" });
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute("aria-describedby", /.+/);
  await expect(page.getByRole("textbox", { name: "Project name" })).toBeFocused();
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press("Tab");
    await expect.poll(() => dialog.evaluate((n) => n.contains(document.activeElement))).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});
