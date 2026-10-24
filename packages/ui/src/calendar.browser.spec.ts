import { test, expect } from "@playwright/test";

test("Calendar fits a narrow container while preserving usable date buttons", async ({ page }) => {
  await page.goto("/?fixture=documentation&example=calendar");
  const example = page.getByTestId("documentation-example");
  await example.evaluate((node) => {
    node.style.width = "240px";
  });
  const days = example.getByRole("button").filter({ hasText: /^\d+$/ });
  await expect(days.first()).toBeVisible();
  const bounds = await example.evaluate((node) => {
    const buttons = Array.from(node.querySelectorAll("td button"));
    return {
      width: node.clientWidth,
      scroll: node.scrollWidth,
      days: buttons.map((button) => button.getBoundingClientRect().width),
    };
  });
  expect(bounds.scroll).toBeLessThanOrEqual(bounds.width);
  expect(bounds.days.length).toBeGreaterThanOrEqual(28);
  expect(Math.min(...bounds.days)).toBeGreaterThanOrEqual(24);
  await days.filter({ hasText: /^15$/ }).click();
  await expect(example.locator('[aria-selected="true"]')).toContainText("15");
});
