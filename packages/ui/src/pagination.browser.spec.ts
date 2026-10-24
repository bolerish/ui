import { test, expect } from "@playwright/test";

test("Pagination wraps in a narrow container with every link reachable", async ({ page }) => {
  await page.goto("/?fixture=documentation&example=pagination");
  const example = page.getByTestId("documentation-example");
  await example.evaluate((node) => {
    node.style.width = "240px";
  });
  const links = example.getByRole("link");
  await expect(links).toHaveCount(5);
  const bounds = await example.evaluate((node) => ({
    width: node.clientWidth,
    scroll: node.scrollWidth,
    tops: Array.from(node.querySelectorAll("a"), (link) => link.getBoundingClientRect().top),
  }));
  expect(bounds.scroll).toBeLessThanOrEqual(bounds.width);
  expect(new Set(bounds.tops).size).toBeGreaterThan(1);
  for (const link of await links.all()) {
    await link.focus();
    await expect(link).toBeFocused();
    expect(
      await link.evaluate((node) => node.getBoundingClientRect().width),
    ).toBeGreaterThanOrEqual(24);
  }
});
