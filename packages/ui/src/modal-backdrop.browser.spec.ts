import { expect, test } from "@playwright/test";

for (const [fixture, trigger] of [
  ["dialog", "Open dialog"],
  ["documentation&example=alert-dialog", "Delete project"],
  ["drawer", "Open drawer"],
] as const) {
  test(`${fixture} dims and subtly blurs the outside page while its panel stays sharp`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`/?fixture=${fixture}`);
    await page.evaluate(() => {
      document.documentElement.style.background =
        "repeating-linear-gradient(90deg, black 0 4px, white 4px 8px)";
      document.body.style.background = "transparent";
      document.body.style.minHeight = "900px";
    });
    await page.getByRole("button", { name: trigger, exact: true }).click();
    const backdrop = page.locator("[data-bolerish-modal-backdrop]").last();
    await expect(backdrop).toHaveCSS("backdrop-filter", "blur(4px)");
    const popup = page.getByRole(fixture.startsWith("documentation") ? "alertdialog" : "dialog");
    await expect(popup).toHaveCSS("backdrop-filter", "none");
    await expect(popup).toHaveCSS("opacity", "1");
    const blurred = await page.screenshot();
    await backdrop.evaluate((node) => {
      (node as HTMLElement).style.backdropFilter = "none";
      (node as HTMLElement).style.setProperty("-webkit-backdrop-filter", "none");
    });
    const sharp = await page.screenshot();
    const ranges = await page.evaluate(
      async (images) => {
        const ranges = [];
        for (const encoded of images) {
          const image = new Image();
          image.src = encoded;
          await image.decode();
          const canvas = document.createElement("canvas");
          canvas.width = image.width;
          canvas.height = image.height;
          const ctx = canvas.getContext("2d")!;
          ctx.drawImage(image, 0, 0);
          const values = ctx.getImageData(32, 100, 128, 1).data;
          const red = Array.from(values).filter((_, index) => index % 4 === 0);
          ranges.push(
            red.slice(1).reduce((sum, value, index) => sum + Math.abs(value - red[index]), 0) /
              (red.length - 1),
          );
        }
        return ranges;
      },
      [blurred, sharp].map((buffer) => `data:image/png;base64,${buffer.toString("base64")}`),
    );
    expect(ranges[1]).toBeGreaterThan(5);
    expect(ranges[0]).toBeLessThan(ranges[1] / 4);
    await backdrop.evaluate((node) => {
      (node as HTMLElement).style.backdropFilter = "";
      (node as HTMLElement).style.removeProperty("-webkit-backdrop-filter");
    });
    const session = await page.context().newCDPSession(page);
    await session.send("Emulation.setEmulatedMedia", {
      features: [{ name: "prefers-reduced-transparency", value: "reduce" }],
    });
    await expect(backdrop).toHaveCSS("backdrop-filter", "none");
    await expect(popup).toHaveCSS("backdrop-filter", "none");
  });
}
