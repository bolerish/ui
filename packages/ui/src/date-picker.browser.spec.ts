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

for (const mode of ["controlled", "uncontrolled"]) {
  test(`DatePicker restores the saved month in ${mode} mode`, async ({ page }) => {
    await page.goto(`/?fixture=date-picker-value&mode=${mode}`);
    const trigger = page.getByRole("button", { name: "2020-1-15", exact: true });
    await expect(trigger).toBeVisible();
    await expect(trigger).toBeEnabled();
    await page.keyboard.press("Tab");
    await expect(trigger).toBeFocused();
    await page.keyboard.press("Enter");
    const grid = page.getByRole("grid", { name: "January 2020" });
    await expect(grid).toBeVisible();
    const selected = grid.getByRole("gridcell", { selected: true });
    await expect(selected).toHaveCount(1);
    const day = selected.getByRole("button", { name: /^15,/ });
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await expect(day).toBeFocused();
    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("button", { name: /^16,/ })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("dialog")).toBeHidden();
    const updatedTrigger = page.getByRole("button", { name: "2020-1-16", exact: true });
    await expect(updatedTrigger).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(grid).toBeVisible();
    await expect(
      grid.getByRole("gridcell", { selected: true }).getByRole("button", { name: /^16,/ }),
    ).toBeVisible();
  });
}
