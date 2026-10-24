import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/?fixture=toast");
  await page.getByRole("button", { name: "Add first" }).click();
});
test("Escape in a plain editor does not dismiss a notification", async ({ page }) => {
  await page.getByRole("textbox", { name: "Editor", exact: true }).focus();
  await page.keyboard.press("Escape");
  await expect(page.getByText("First notification", { exact: true })).toBeVisible();
});
test("a prevented Escape remains owned by the editor", async ({ page }) => {
  await page.getByRole("button", { name: "Handled action", exact: true }).focus();
  await page.keyboard.press("Escape");
  await expect(page.getByText("First notification", { exact: true })).toBeVisible();
});
test("Escape closes only the newest notification", async ({ page }) => {
  await page.getByRole("button", { name: "Add second" }).click();
  await page.keyboard.press("Escape");
  await expect(page.getByText("Second notification", { exact: true })).toBeHidden();
  await expect(page.getByText("First notification", { exact: true })).toBeVisible();
});
for (const [name, role, popup] of [
  ["Open dialog", "button", "dialog"],
  ["Open popover", "button", "textbox"],
  ["Framework", "combobox", "listbox"],
  ["Actions", "button", "menu"],
] as const) {
  test(`${name} owns Escape without dismissing notifications`, async ({ page }) => {
    await page.getByRole(role, { name, exact: true }).click();
    const content =
      popup === "textbox"
        ? page.getByRole("textbox", { name: "Popover field" })
        : popup === "dialog"
          ? page.getByRole("dialog", { name: "Edit project" })
          : page.getByRole(popup);
    await expect(content).toBeVisible();
    if (popup === "listbox") await page.keyboard.press("ArrowDown");
    else if (popup === "menu") await page.getByRole("menuitem").first().focus();
    else if (popup === "dialog") await page.getByRole("textbox", { name: "Project name" }).focus();
    else await content.focus();
    await page.keyboard.press("Escape");
    await expect(content).toBeHidden();
    await expect(page.getByText("First notification", { exact: true })).toBeVisible();
  });
}
test("dismiss buttons accept a localized accessible name", async ({ page }) => {
  await page.getByRole("dialog", { name: "First notification" }).focus();
  await page.keyboard.press("Tab");
  await page.getByRole("button", { name: "알림 닫기" }).click();
  await expect(page.getByText("First notification", { exact: true })).toBeHidden();
});

for (const type of [
  "success",
  "info",
  "warning",
  "error",
  "loading",
  "custom",
  "constructor",
  "__proto__",
]) {
  test(`Toast type ${type} renders without inheriting object properties`, async ({ page }) => {
    await page.goto("/?fixture=toast&type=" + encodeURIComponent(type));
    await page.getByRole("button", { name: "Add first" }).click();
    const notification = page.getByRole("dialog", { name: "First notification" });
    await expect(notification).toBeVisible();
    const hasIcon = ["success", "info", "warning", "error"].includes(type);
    await expect(notification.locator("svg")).toHaveCount(hasIcon ? 2 : 1);
    await expect(notification.locator('span[aria-hidden="true"] > span')).toHaveCount(
      type === "loading" ? 1 : 0,
    );
  });
}
