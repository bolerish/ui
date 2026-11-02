import { expect, test } from "@playwright/test";

for (const width of [390, 1280]) {
  test(`Toast supports all four corners at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const position of ["top-left", "top-right", "bottom-left", "bottom-right"]) {
      await page.goto("/?fixture=toast-positions");
      await page.getByRole("button", { name: position, exact: true }).click();
      const notification = page.getByRole("dialog", {
        name: `Notification at ${position}`,
        exact: true,
      });
      await expect(notification).toBeVisible();
      const box = (await notification.boundingBox())!;
      expect(
        Math.abs((position.startsWith("top") ? box.y : 900 - box.y - box.height) - 16),
      ).toBeLessThan(1);
      expect(
        Math.abs((position.endsWith("left") ? box.x : width - box.x - box.width) - 16),
      ).toBeLessThan(1);
    }
  });
}
