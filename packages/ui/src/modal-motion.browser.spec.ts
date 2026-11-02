import { expect, test } from "@playwright/test";

for (const phase of ["entering", "exiting"]) {
  test(`nested Liquid modal keeps outside dimming steady while ${phase}`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/?fixture=modal-nested&surface=liquid");
    await page.evaluate(() => {
      document.documentElement.dataset.bolerishMotion = "on";
      document.documentElement.style.background = "#b0c8e0";
      document.body.style.background = "#b0c8e0";
      document.body.style.minHeight = "900px";
    });
    await page.getByRole("button", { name: "Open parent", exact: true }).click();
    const parent = page.getByRole("dialog", { name: "Parent modal", exact: true });
    await expect(parent).toHaveCSS("opacity", "1");
    const baseline = (await page.screenshot()).toString("base64");
    await page.getByRole("button", { name: "Open child", exact: true }).click();
    const child = page.getByRole("dialog", { name: "Child modal", exact: true });
    await expect(child).toBeVisible();
    if (phase === "exiting") {
      await child.evaluate((node) =>
        Promise.all(node.getAnimations().map((animation) => animation.finished)),
      );
      await page.keyboard.press("Escape");
    }
    await page.waitForFunction(
      () => document.querySelector('[role="dialog"][data-nested]')?.getAnimations().length,
    );
    await child.evaluate((node, phase) => {
      for (const animation of node.getAnimations()) {
        animation.pause();
        animation.currentTime =
          phase === "entering" ? 0 : Number(animation.effect!.getTiming().duration) / 2;
      }
    }, phase);
    const during = (await page.screenshot()).toString("base64");
    const samples = await page.evaluate(
      async (shots) =>
        Promise.all(
          shots.map(async (data) => {
            const image = new Image();
            image.src = `data:image/png;base64,${data}`;
            await image.decode();
            const canvas = document.createElement("canvas");
            canvas.width = image.width;
            canvas.height = image.height;
            const context = canvas.getContext("2d")!;
            context.drawImage(image, 0, 0);
            return Array.from(context.getImageData(1000, 100, 1, 1).data).slice(0, 3);
          }),
        ),
      [baseline, during],
    );
    for (let channel = 0; channel < 3; channel++)
      expect(Math.abs(samples[0][channel] - samples[1][channel])).toBeLessThanOrEqual(2);
  });
}
