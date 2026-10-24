import { test, expect } from "@playwright/test";

test("Drawer exposes a named dialog and restores trigger focus", async ({ page }) => {
  await page.goto("/?fixture=drawer");
  const trigger = page.getByRole("button", { name: "Open drawer" });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Move project" });
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute("aria-describedby", /.+/);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});
