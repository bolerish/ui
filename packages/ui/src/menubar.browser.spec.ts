import { test, expect } from "@playwright/test";

test("Default Menubar: keyboard opens, navigates and returns past portal guards", async ({
  page,
}) => {
  await page.goto("/?fixture=documentation&example=menubar&keyboard=1");
  const trigger = page.getByRole("menuitem", { name: "File", exact: true });
  await page.getByTestId("before-example").focus();
  await page.keyboard.press("Tab");
  await expect(trigger).toBeFocused();
  await page.keyboard.press("Enter");
  const menu = page.getByRole("menu");
  await expect(menu).toBeVisible();
  await expect(menu.getByRole("menuitem").first()).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(menu.getByRole("menuitem").nth(1)).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(trigger).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByTestId("after-example")).toBeFocused();
});
