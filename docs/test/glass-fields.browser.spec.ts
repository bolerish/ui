import { expect, test } from "@playwright/test";

test("critical profile label and input keep the shared Field gap across densities", async ({
  page,
}) => {
  for (const density of ["default", "compact", "spacious"]) {
    await page.goto(`/docs/components/dialog?density=${density}`, {
      waitUntil: "domcontentloaded",
    });
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "Open profile", exact: true }).click();
    const input = page.getByRole("textbox", { name: "Display name", exact: true });
    await expect(input).toBeVisible();
    const label = page.getByRole("dialog").locator("label").filter({ hasText: "Display name" });
    const gap = await input.evaluate((node) => getComputedStyle(node.parentElement!).rowGap);
    const [top, bottom] = await Promise.all([input.boundingBox(), label.boundingBox()]);
    expect(top!.y - (bottom!.y + bottom!.height)).toBeCloseTo(parseFloat(gap), 0);
    expect(parseFloat(gap)).toBeGreaterThan(0);
    await label.click();
    await expect(input).toBeFocused();
  }
});
