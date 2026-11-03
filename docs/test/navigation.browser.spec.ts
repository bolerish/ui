import { expect, test } from "@playwright/test";

test("language selection navigates to the matching document and retain appearance preferences", async ({
  page,
}) => {
  await page.context().addCookies([
    {
      name: "bolerish-docs-settings",
      value: encodeURIComponent(JSON.stringify({ colorMode: "dark" })),
      url: test.info().project.use.baseURL!,
    },
  ]);
  await page.goto("/docs/components/button");
  await expect(page.locator("html")).toHaveAttribute("data-bolerish-theme", "dark");
  await expect(async () => {
    await page.getByRole("combobox", { name: "Language", exact: true }).click();
    await expect(page.getByRole("option", { name: "한국어", exact: true })).toBeVisible({
      timeout: 500,
    });
  }).toPass({ timeout: 15000, intervals: [500] });
  await page.getByRole("option", { name: "한국어", exact: true }).click();
  await expect(page).toHaveURL(/\/docs\/components\/button\/ko$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "ko");
  await expect(page.locator("html")).toHaveAttribute("data-bolerish-theme", "dark");
  await page.getByRole("combobox", { name: "언어", exact: true }).click();
  await page.getByRole("option", { name: "English", exact: true }).click();
  await expect(page).toHaveURL(/\/docs\/components\/button$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

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
