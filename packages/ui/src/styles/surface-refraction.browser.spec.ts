import { expect, test } from "@playwright/test";

for (const theme of ["light", "dark"]) {
  test(`global Liquid ${theme} refracts existing surfaces without a Liquid component`, async ({
    page,
    browserName,
  }) => {
    await page.goto(`/?fixture=surface&theme=${theme}&surface=liquid`);
    const card = page.getByTestId("surface");
    await card.evaluate((node) => {
      (node.parentElement as HTMLElement).style.background =
        "repeating-linear-gradient(90deg, #e11d48 0 16px, #38bdf8 16px 32px)";
      (node as HTMLElement).style.width = "320px";
    });
    await page.evaluate(() => document.fonts.ready);
    await expect(card).toHaveCSS("backdrop-filter", /url\(.+\).*blur\(12px\)/);
    const refracted = await card.screenshot();
    await page.locator("html").evaluate((node) => {
      node.style.setProperty("--bolerish-refraction", "opacity(1)");
    });
    const plain = await card.screenshot();
    await page.locator("html").evaluate((node) => {
      node.style.removeProperty("--bolerish-refraction");
    });
    const restored = await card.screenshot();
    expect(restored.equals(refracted)).toBe(true);
    const edgeDifference = await page.evaluate(
      async ({ first, second }) => {
        const images = await Promise.all(
          [first, second].map(async (data) => {
            const image = new Image();
            image.src = `data:image/png;base64,${data}`;
            await image.decode();
            const canvas = document.createElement("canvas");
            canvas.width = image.width;
            canvas.height = image.height;
            const context = canvas.getContext("2d")!;
            context.drawImage(image, 0, 0);
            return {
              width: image.width,
              height: image.height,
              pixels: context.getImageData(0, 0, image.width, image.height).data,
            };
          }),
        );
        let difference = 0;
        let samples = 0;
        for (let y = 30; y < images[0].height - 30; y++)
          for (let x = 3; x < 18; x++)
            for (let channel = 0; channel < 3; channel++) {
              const i = (y * images[0].width + x) * 4 + channel;
              difference += Math.abs(images[0].pixels[i] - images[1].pixels[i]);
              samples++;
            }
        return difference / samples;
      },
      { first: refracted.toString("base64"), second: plain.toString("base64") },
    );
    await test.info().attach("backdrop-edge-difference", {
      body: JSON.stringify({ browserName, theme, edgeDifference }),
      contentType: "application/json",
    });
    if (browserName === "chromium") expect(edgeDifference).toBeGreaterThan(2);
    else expect(edgeDifference).toBe(0);

    const trigger = page.getByRole("button", { name: "Open dialog", exact: true });
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "Edit project" });
    await expect(dialog).toHaveCSS("backdrop-filter", /url\(.+\).*blur\(8px\)/);
    await page.keyboard.press("Escape");
    await expect(trigger).toBeFocused();
    await page.locator("html").evaluate((node) => {
      node.dataset.bolerishSurface = "solid";
    });
    await expect(card).toHaveCSS("backdrop-filter", "none");
    await page.emulateMedia({ forcedColors: "active" });
    await expect(card).toHaveCSS("backdrop-filter", "none");
  });
}
