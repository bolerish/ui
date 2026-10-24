import { test, expect } from "@playwright/test";

function backgroundPixel(node: Element) {
  const ctx = document.createElement("canvas").getContext("2d")!;
  ctx.fillStyle = getComputedStyle(node).backgroundColor;
  ctx.fillRect(0, 0, 1, 1);
  return Array.from(ctx.getImageData(0, 0, 1, 1).data);
}

for (const theme of ["light", "dark"]) {
  test(`Liquid ${theme} changes material, retains readable text and solid fallback`, async ({
    page,
  }) => {
    await page.goto(`/?fixture=surface&theme=${theme}&surface=solid`);
    const card = page.getByTestId("surface");
    const solidPixel = await card.evaluate(backgroundPixel);
    const solid = await card.evaluate((n) => {
      const s = getComputedStyle(n);
      return { color: s.backgroundColor, filter: s.backdropFilter, shadow: s.boxShadow };
    });
    await page.goto(`/?fixture=surface&theme=${theme}&surface=liquid`);
    const liquid = await card.evaluate((n) => {
      const s = getComputedStyle(n);
      return { color: s.backgroundColor, filter: s.backdropFilter, shadow: s.boxShadow };
    });
    expect(liquid.color).not.toBe(solid.color);
    expect(liquid.filter).toContain("blur");
    expect(liquid.shadow).toContain("inset");
    const contrast = await card.evaluate((n) => {
      const ctx = document.createElement("canvas").getContext("2d")!;
      function rgba(color: string) {
        ctx.clearRect(0, 0, 1, 1);
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, 1, 1);
        return Array.from(ctx.getImageData(0, 0, 1, 1).data).map((v) => v / 255);
      }
      function luminance(rgb: number[]) {
        return rgb
          .slice(0, 3)
          .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
          .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
      }
      const color = rgba(getComputedStyle(n).backgroundColor);
      const parent = rgba(getComputedStyle(n.parentElement!).backgroundColor);
      const background = color.slice(0, 3).map((v, i) => v * color[3] + parent[i] * (1 - color[3]));
      const foreground = rgba(
        getComputedStyle(n.querySelector('[data-testid="description"]')!).color,
      );
      // Check both ends of the white sheen over this colored backing.
      return [0, 0.04].map((alpha) => {
        const b = luminance(background.map((v) => v * (1 - alpha) + alpha));
        const f = luminance(foreground);
        return (Math.max(b, f) + 0.05) / (Math.min(b, f) + 0.05);
      });
    });
    expect(Math.min(...contrast)).toBeGreaterThanOrEqual(4.5);
    await page.screenshot({ path: test.info().outputPath(`liquid-${theme}.png`) });
    await page.emulateMedia({ forcedColors: "active" });
    await expect(card).toHaveCSS("backdrop-filter", "none");
    await expect(card).toHaveCSS("background-image", "none");
    await expect(card).toHaveCSS("box-shadow", "none");
    await page.emulateMedia({ forcedColors: "none" });
    const session = await page.context().newCDPSession(page);
    await session.send("Emulation.setEmulatedMedia", {
      features: [{ name: "prefers-reduced-transparency", value: "reduce" }],
    });
    await expect(card).toHaveCSS("backdrop-filter", "none");
    await expect(card).toHaveCSS("background-image", "none");
    expect(await card.evaluate(backgroundPixel)).toEqual(solidPixel);
  });
}
