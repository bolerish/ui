import { expect, test } from "@playwright/test";
for (const variant of ["arrows", "inside", "vertical"]) {
  test(`Carousel ${variant} controls navigate on the intended axis`, async ({ page }) => {
    await page.goto(`/?fixture=carousel-controls&variant=${variant}`);
    const root = page.locator('[aria-roledescription="carousel"]');
    const next = page.getByRole("button", { name: "Next slide", exact: true });
    const previous = page.getByRole("button", { name: "Previous slide", exact: true });
    await expect(next).toBeEnabled();
    await expect(previous).toBeDisabled();
    const first = page.getByText("Slide 1", { exact: true });
    const before = (await first.boundingBox())!;
    const box = (await root.boundingBox())!;
    const control = (await next.boundingBox())!;
    if (variant === "inside") {
      expect(control.x).toBeGreaterThanOrEqual(box.x);
      expect(control.x + control.width).toBeLessThanOrEqual(box.x + box.width);
    }
    if (variant === "arrows") await expect(next).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    if (variant === "vertical") expect(control.y).toBeGreaterThanOrEqual(box.y + box.height);
    for (const button of [previous, next]) {
      await button.evaluate((element) => {
        element.style.width = "48px";
        element.style.height = "48px";
      });
      const bounds = (await button.boundingBox())!;
      const center =
        variant === "vertical" ? bounds.x + bounds.width / 2 : bounds.y + bounds.height / 2;
      const expected = variant === "vertical" ? box.x + box.width / 2 : box.y + box.height / 2;
      expect(Math.abs(center - expected)).toBeLessThan(1);
    }
    await next.click();
    await expect(previous).toBeEnabled();
    await expect
      .poll(async () => {
        const after = (await first.boundingBox())!;
        return variant === "vertical" ? before.y - after.y : before.x - after.x;
      })
      .toBeGreaterThan(50);
    await previous.click();
    await expect(previous).toBeDisabled();
  });
}
