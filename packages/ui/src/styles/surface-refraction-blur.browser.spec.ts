import { expect, test } from "@playwright/test";

for (const theme of ["light", "dark"]) {
  test(`Liquid ${theme} visibly blurs backing stripes in the rendered page`, async ({ page }) => {
    await page.setViewportSize({ width: 600, height: 600 });
    await page.goto(`/?fixture=surface&theme=${theme}&surface=liquid`);
    const card = page.getByTestId("surface");
    await card.evaluate((node) => {
      Object.assign((node as HTMLElement).style, { width: "320px", height: "260px" });
      (node.parentElement as HTMLElement).style.background =
        "repeating-linear-gradient(90deg,#111 0 4px,#eee 4px 8px)";
      for (const child of node.children) (child as HTMLElement).style.visibility = "hidden";
    });
    const box = (await card.boundingBox())!;
    // Some headless WebKit builds expose the API but cannot paint even native blur.
    // Measure that independent control before attributing a raster failure to Liquid.
    const materialFilter = await card.evaluate((node) => {
      const element = node as HTMLElement;
      const original = {
        filter: element.style.backdropFilter,
        prefix: element.style.getPropertyValue("-webkit-backdrop-filter"),
      };
      element.style.backdropFilter = "blur(4px)";
      element.style.setProperty("-webkit-backdrop-filter", "blur(4px)");
      return original;
    });
    const control = (await page.screenshot()).toString("base64");
    await card.evaluate((node) => {
      (node as HTMLElement).style.backdropFilter = "none";
      (node as HTMLElement).style.setProperty("-webkit-backdrop-filter", "none");
    });
    const unfilteredControl = (await page.screenshot()).toString("base64");
    const controlChanged = control !== unfilteredControl;
    test.skip(
      !controlChanged,
      "Renderer cannot paint standalone CSS backdrop blur; validate on native Safari.",
    );
    await card.evaluate((node, original) => {
      (node as HTMLElement).style.backdropFilter = original.filter;
      (node as HTMLElement).style.setProperty("-webkit-backdrop-filter", original.prefix);
    }, materialFilter);
    const blurred = (await page.screenshot()).toString("base64");
    await card.evaluate((node) => {
      (node as HTMLElement).style.backdropFilter = "none";
      (node as HTMLElement).style.setProperty("-webkit-backdrop-filter", "none");
    });
    const plain = (await page.screenshot()).toString("base64");
    const difference = await page.evaluate(
      async ({ blurred, plain, box }) => {
        const rows = await Promise.all(
          [blurred, plain].map(async (data) => {
            const image = new Image();
            image.src = `data:image/png;base64,${data}`;
            await image.decode();
            const canvas = document.createElement("canvas");
            canvas.width = image.width;
            canvas.height = image.height;
            const context = canvas.getContext("2d")!;
            context.drawImage(image, 0, 0);
            return context.getImageData(Math.round(box.x + 40), Math.round(box.y + 130), 240, 1)
              .data;
          }),
        );
        let sum = 0;
        for (let i = 0; i < rows[0].length; i += 4) sum += Math.abs(rows[0][i] - rows[1][i]);
        return sum / 240;
      },
      { blurred, plain, box },
    );
    expect(difference).toBeGreaterThan(15);
  });
}
