import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

async function compareRefraction(page: Page) {
  const liquid = page.getByTestId("liquid");
  const background = liquid.locator("[inert]");
  await expect(liquid.locator("feImage")).toHaveCount(1);
  await page.evaluate(async () => {
    const image = new Image();
    image.src = document.querySelector("feImage")!.getAttribute("href")!;
    await image.decode();
  });
  const refracted = await liquid.screenshot();
  const foreground = await liquid.getByTestId("foreground-label").screenshot();
  const filter = await background.evaluate((node) => {
    const element = node as HTMLElement;
    const value = element.style.filter;
    element.style.filter = "none";
    return value;
  });
  const plain = await liquid.screenshot();
  const plainForeground = await liquid.getByTestId("foreground-label").screenshot();
  await background.evaluate((node, value) => {
    (node as HTMLElement).style.filter = value;
  }, filter);
  const differences = await page.evaluate(
    async ({ first, second }) => {
      async function pixels(base64: string) {
        const image = new Image();
        image.src = `data:image/png;base64,${base64}`;
        await image.decode();
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const context = canvas.getContext("2d")!;
        context.drawImage(image, 0, 0);
        return {
          width: canvas.width,
          data: context.getImageData(0, 0, canvas.width, canvas.height).data,
        };
      }
      const a = await pixels(first);
      const b = await pixels(second);
      const difference = (left: number, top: number, right: number, bottom: number) => {
        let total = 0;
        let count = 0;
        for (let y = top; y < bottom; y++)
          for (let x = left; x < right; x++) {
            const index = (y * a.width + x) * 4;
            for (let channel = 0; channel < 3; channel++) {
              total += Math.abs(a.data[index + channel] - b.data[index + channel]);
              count++;
            }
          }
        return total / count;
      };
      return { edge: difference(3, 30, 14, 130), center: difference(40, 35, 200, 125) };
    },
    { first: refracted.toString("base64"), second: plain.toString("base64") },
  );
  return { ...differences, foregroundUnchanged: foreground.equals(plainForeground) };
}

for (const theme of ["light", "dark"]) {
  test(`Liquid ${theme} bends background pixels, keeps foreground interactive and resizes`, async ({
    page,
  }) => {
    await page.goto(`/?fixture=liquid&theme=${theme}&surface=liquid`);
    const liquid = page.getByTestId("liquid");
    const pixels = await compareRefraction(page);
    expect(pixels.edge).toBeGreaterThan(3);
    expect(pixels.center).toBeLessThan(1);
    expect(pixels.foregroundUnchanged).toBe(true);
    const oldId = await liquid.locator("filter").getAttribute("id");
    await liquid.evaluate((node) => {
      node.style.width = "320px";
    });
    await expect(liquid.locator("filter")).not.toHaveAttribute("id", oldId!);
    const resized = await compareRefraction(page);
    expect(resized.edge).toBeGreaterThan(3);
    expect(resized.center).toBeLessThan(1);
    expect(resized.foregroundUnchanged).toBe(true);
    await test.info().attach("liquid-pixels", {
      body: JSON.stringify({ initial: pixels, resized }),
      contentType: "application/json",
    });
    await page.getByRole("button", { name: "Choose", exact: true }).focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("button", { name: "Selected", exact: true })).toBeVisible();
    const oldScene = await liquid.screenshot();
    await liquid.locator("rect").evaluateAll((nodes) => {
      for (const node of nodes) node.setAttribute("fill", "#ef4444");
    });
    expect(oldScene.equals(await liquid.screenshot())).toBe(false);
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await page.screenshot({ path: test.info().outputPath(`liquid-${theme}.png`) });
  });
}

test("Liquid follows Solid mode and bounds large lenses", async ({ page }) => {
  await page.goto("/?fixture=liquid&surface=solid");
  const liquid = page.getByTestId("liquid");
  await expect(liquid.locator("[inert]")).toBeHidden();
  await expect(liquid.locator("feImage")).toHaveCount(0);
  await page.evaluate(() => {
    document.documentElement.dataset.bolerishSurface = "liquid";
  });
  await expect(liquid.locator("feImage")).toHaveCount(1);
  await page.setViewportSize({ width: 1200, height: 800 });
  await liquid.evaluate((node) => {
    node.style.width = "1100px";
  });
  await expect(liquid.locator("feImage")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Choose", exact: true })).toBeVisible();
});

test("Liquid remains usable when canvas is unavailable", async ({ page }) => {
  await page.addInitScript(() => {
    HTMLCanvasElement.prototype.getContext = () => null;
  });
  await page.goto("/?fixture=liquid&surface=liquid");
  await expect(page.getByRole("button", { name: "Choose", exact: true })).toBeVisible();
  await expect(page.getByTestId("liquid").locator("feImage")).toHaveCount(0);
});

test("Liquid respects forced colors and reduced transparency", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "CDP is required to emulate reduced transparency.");
  await page.goto("/?fixture=liquid&surface=liquid");
  const background = page.getByTestId("liquid").locator("[inert]");
  await page.emulateMedia({ forcedColors: "active" });
  await expect(background).toBeHidden();
  await expect(page.getByRole("button", { name: "Choose", exact: true })).toBeVisible();
  await page.emulateMedia({ forcedColors: "none" });
  const session = await page.context().newCDPSession(page);
  await session.send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-transparency", value: "reduce" }],
  });
  await expect(background).toBeHidden();
  await expect(page.getByTestId("liquid").locator("feImage")).toHaveCount(0);
});
