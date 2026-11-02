import { expect, test } from "@playwright/test";

for (const width of [208, 320]) {
  test(`DatePicker icon and popup fit a ${width}px trigger`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/?fixture=documentation&example=date-picker");
    await page.evaluate(() => {
      document.documentElement.dataset.bolerishMotion = "on";
    });
    const trigger = page.locator('button[aria-haspopup="dialog"]');
    await trigger.evaluate((node, width) => {
      (node.parentElement as HTMLElement).style.width = `${width}px`;
    }, width);
    await expect(trigger.locator("svg")).toHaveCount(1);
    await trigger.click();
    const popup = page.getByRole("dialog");
    await expect(popup).toBeVisible();
    await expect(popup).toHaveCSS("transition-duration", "0.12s");
    await expect(popup).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)");
    expect(
      Math.abs((await popup.boundingBox())!.width - (await trigger.boundingBox())!.width),
    ).toBeLessThan(1);
    const overflow = await popup.evaluate((node) => node.scrollWidth > node.clientWidth);
    expect(overflow).toBe(false);
    await popup.getByRole("button", { name: /^15,/ }).click();
    await expect(popup).toBeHidden();
    await expect(trigger).toContainText("15");
    await expect(trigger).toBeFocused();
  });
}
