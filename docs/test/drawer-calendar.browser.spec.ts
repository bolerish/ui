import { expect, test } from "@playwright/test";

for (const width of [1280, 360]) {
  test(`critical drawer directions keep content inset at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 740 });
    await page.goto("/docs/components/drawer");
    await page.waitForLoadState("networkidle");
    const table = page
      .getByRole("heading", { name: "swipeDirection", exact: true })
      .locator("xpath=following::table[1]");
    for (const direction of ["up", "down", "left", "right"]) {
      const row = table.getByRole("row").filter({
        has: page.getByRole("cell", { name: direction, exact: true }),
      });
      const trigger = row.getByRole("button", { name: "Open drawer", exact: true });
      await trigger.click();
      const popup = page.getByRole("dialog", { name: "Project details" });
      await expect(popup).toBeVisible();
      await expect(async () => {
        const bounds = await popup.evaluate((element) => {
          const panel = element.getBoundingClientRect();
          const title = element.querySelector("h2")!.getBoundingClientRect();
          const close = element.querySelector("button")!.getBoundingClientRect();
          return {
            start: title.left - panel.left,
            end: panel.right - title.right,
            top: title.top - panel.top,
            bottom: panel.bottom - close.bottom,
            inside: panel.left >= 0 && panel.right <= window.innerWidth,
          };
        });
        expect(bounds.start).toBeGreaterThanOrEqual(16);
        expect(bounds.end).toBeGreaterThanOrEqual(16);
        expect(bounds.top).toBeGreaterThanOrEqual(16);
        expect(bounds.bottom).toBeGreaterThanOrEqual(16);
        expect(bounds.inside).toBe(true);
      }).toPass();
      const backdrop = page.locator('[data-slot="drawer-overlay"]');
      await expect(backdrop).toHaveCSS("backdrop-filter", "blur(4px)");
      await expect(popup).toHaveCSS("backdrop-filter", "none");
      await page.keyboard.press("Escape");
      await expect(popup).toBeHidden();
      await expect(trigger).toBeFocused();
    }
  });
}

for (const colorMode of ["light", "dark"]) {
  test(`calendar range remains visible on hover and keyboard focus in ${colorMode}`, async ({
    page,
  }) => {
    await page.goto(`/docs/components/calendar?colorMode=${colorMode}`);
    await page.waitForLoadState("networkidle");
    const table = page
      .getByRole("heading", { name: "mode", exact: true })
      .locator("xpath=following::table[1]");
    const range = table.getByRole("row").filter({
      has: page.getByRole("cell", { name: "range", exact: true }),
    });
    const start = range.getByRole("button", { name: /^10, / });
    const end = range.getByRole("button", { name: /^15, / });
    const middle = range.getByRole("button", { name: /^12, / });
    const ordinary = range.getByRole("button", { name: /^18, / });
    await start.click();
    await end.click();
    await page.mouse.move(0, 0);
    const middleBackground = await middle.evaluate(
      (element) => getComputedStyle(element).backgroundColor,
    );
    expect(middleBackground).not.toBe(
      await ordinary.evaluate((element) => getComputedStyle(element).backgroundColor),
    );
    expect(middleBackground).not.toBe(
      await start.evaluate((element) => getComputedStyle(element).backgroundColor),
    );
    await middle.hover();
    await expect(middle).toHaveCSS("background-color", middleBackground);
    await start.focus();
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");
    await expect(middle).toBeFocused();
    await expect(middle).toHaveCSS("background-color", middleBackground);
    await expect(middle).toHaveCSS("outline-style", "solid");
    await expect(middle).not.toHaveCSS("outline-width", "0px");
    await expect(middle.locator("..")).toHaveAttribute("aria-selected", "true");
  });
}
