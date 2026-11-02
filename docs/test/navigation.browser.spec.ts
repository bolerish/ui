import { expect, test } from "@playwright/test";

test("document navigation stays with its content until the home gallery is ready", async ({
  page,
}) => {
  await page.goto("/docs/components/tabs");
  await expect(page.getByRole("heading", { name: "Tabs", exact: true })).toBeVisible();
  await expect(page.locator("#docs-navigation")).toBeVisible();
  await expect(async () => {
    await page.getByRole("button", { name: "Settings", exact: true }).click();
    await expect(page.getByRole("dialog")).toBeVisible({ timeout: 500 });
  }).toPass({ timeout: 15000, intervals: [500] });
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  let requested!: () => void;
  const pending = new Promise<void>((resolve) => {
    requested = resolve;
  });
  await page.route("**/assets/*.js", async (route) => {
    requested();
    await gate;
    await route.continue();
  });
  try {
    await page.locator("a.brand").click();
    await pending;
    await expect(page.locator("#docs-navigation")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Tabs", exact: true })).toBeVisible();
  } finally {
    release();
  }
  await expect(page.locator(".home-gallery")).toBeVisible();
  await expect(page.locator("#docs-navigation")).toHaveCount(0);
});
