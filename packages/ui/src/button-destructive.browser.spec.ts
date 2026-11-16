import { expect, test } from "@playwright/test";

function pixel(node: Element, property: "color" | "backgroundColor") {
  const canvas = document.createElement("canvas").getContext("2d")!;
  canvas.fillStyle = getComputedStyle(node)[property];
  canvas.fillRect(0, 0, 1, 1);
  return Array.from(canvas.getImageData(0, 0, 1, 1).data);
}

for (const theme of ["light", "dark"]) {
  test(`${theme} destructive matches the bright-red reference and strengthens only its backing`, async ({
    page,
  }) => {
    await page.goto(`/?fixture=destructive&theme=${theme}`);
    const button = page.getByRole("button", { name: "Delete", exact: true });
    const foreground = await button.evaluate(pixel, "color" as const);
    expect(foreground).toEqual([229, 72, 77, 255]);
    const fill = await button.evaluate(pixel, "backgroundColor" as const);
    for (const [index, channel] of [229, 72, 77].entries())
      expect(Math.abs((fill[index] * fill[3]) / 255 - channel * 0.12)).toBeLessThanOrEqual(1.5);
    expect(fill[3] / 255).toBeCloseTo(0.12, 2);
    await expect(button).toHaveCSS("border-top-color", "rgba(0, 0, 0, 0)");
    await button.hover();
    await expect
      .poll(() => button.evaluate((node) => getComputedStyle(node, "::after").backgroundColor))
      .not.toBe("rgba(0, 0, 0, 0)");
    expect(await button.evaluate(pixel, "color" as const)).toEqual(foreground);
    const hover = await button.evaluate(
      (node) => getComputedStyle(node, "::after").backgroundColor,
    );
    await page.mouse.down();
    await expect
      .poll(() => button.evaluate((node) => getComputedStyle(node, "::after").backgroundColor))
      .not.toBe(hover);
    await page.mouse.up();
    await page.mouse.move(0, 100);
    await page.mouse.click(0, 100);
    await page.keyboard.press("Tab");
    await expect(button).toBeFocused();
    await expect(button).toHaveCSS("outline-style", "solid");
    await expect(page.getByRole("button", { name: "Unavailable" })).toBeDisabled();
  });
}
