import { expect, test } from "@playwright/test";

for (const colorMode of ["light", "dark"]) {
  test(`critical ${colorMode} Surface setting changes content panels without decorative gradients`, async ({
    page,
  }) => {
    await page.goto(`/?surface=solid&colorMode=${colorMode}`, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle");
    const panel = page.locator('[data-docs="gallery-item"]').first().locator(":scope > div");
    await expect(panel).toBeVisible();
    const solidCanvas = await page
      .locator("body")
      .evaluate((node) => getComputedStyle(node).backgroundColor);
    await expect(panel).toHaveCSS("backdrop-filter", "none");
    await page.getByRole("button", { name: "Settings", exact: true }).click();
    await page.getByRole("combobox", { name: "Surface", exact: true }).selectOption("glass");
    await expect(page.locator("html")).toHaveAttribute("data-bolerish-surface", "glass");
    await expect(panel).toHaveCSS("backdrop-filter", "blur(24px) saturate(1.6)");
    await expect(page.locator("body")).not.toHaveCSS("background-color", solidCanvas);
    await expect(page.locator("body")).toHaveCSS("background-image", "none");
    const material = await panel.evaluate((node) => getComputedStyle(node).boxShadow);
    expect(material).toContain("inset");
    await page.keyboard.press("Escape");
    const field = page.getByRole("textbox", { name: "Name", exact: true }).first();
    await expect(field).toHaveCSS("backdrop-filter", "none");
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.locator("html")).toHaveAttribute("data-bolerish-surface", "glass");
    await expect(panel).toHaveCSS("backdrop-filter", "blur(24px) saturate(1.6)");
  });
}

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
