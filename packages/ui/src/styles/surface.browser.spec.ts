import { test, expect } from "@playwright/test";

function backgroundPixel(node: Element) {
  const ctx = document.createElement("canvas").getContext("2d")!;
  ctx.fillStyle = getComputedStyle(node).backgroundColor;
  ctx.fillRect(0, 0, 1, 1);
  return Array.from(ctx.getImageData(0, 0, 1, 1).data);
}

for (const theme of ["light", "dark"]) {
  test(`${theme} cards remain opaque and readable over content backgrounds`, async ({ page }) => {
    await page.goto(`/?fixture=surface&theme=${theme}`);
    const card = page.getByTestId("surface");
    expect((await card.evaluate(backgroundPixel))[3]).toBe(255);
    await expect(card).toHaveCSS("backdrop-filter", "none");
    expect(
      (await page.getByRole("textbox", { name: "Surface field" }).evaluate(backgroundPixel))[3],
    ).toBe(255);
    const description = page.getByTestId("description");
    const textColor = await description.evaluate((n) => getComputedStyle(n).color);
    const cardBox = (await card.boundingBox())!;
    const textBox = (await description.boundingBox())!;
    let background: Buffer;
    await card.locator(":scope > *").evaluateAll((nodes) => {
      for (const node of nodes) (node as HTMLElement).style.visibility = "hidden";
    });
    try {
      background = await card.screenshot();
    } finally {
      await card.locator(":scope > *").evaluateAll((nodes) => {
        for (const node of nodes) (node as HTMLElement).style.visibility = "";
      });
    }
    const contrast = await page.evaluate(
      async ({ image, textColor, cardBox, textBox }) => {
        const bitmap = new Image();
        bitmap.src = image;
        await bitmap.decode();
        const canvas = document.createElement("canvas");
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        const ctx = canvas.getContext("2d")!;
        ctx.fillStyle = textColor;
        ctx.fillRect(0, 0, 1, 1);
        const foreground = Array.from(ctx.getImageData(0, 0, 1, 1).data);
        function luminance(rgb: number[]) {
          return rgb
            .slice(0, 3)
            .map((v) => v / 255)
            .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
            .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
        }
        ctx.drawImage(bitmap, 0, 0);
        const pixels = ctx.getImageData(
          Math.round(textBox.x - cardBox.x),
          Math.round(textBox.y - cardBox.y),
          Math.floor(textBox.width),
          Math.floor(textBox.height),
        ).data;
        const f = luminance(foreground);
        let minimum = Infinity;
        for (let i = 0; i < pixels.length; i += 4) {
          const b = luminance(Array.from(pixels.slice(i, i + 3)));
          minimum = Math.min(minimum, (Math.max(b, f) + 0.05) / (Math.min(b, f) + 0.05));
        }
        return minimum;
      },
      {
        image: `data:image/png;base64,${background.toString("base64")}`,
        textColor,
        cardBox,
        textBox,
      },
    );
    expect(contrast).toBeGreaterThanOrEqual(4.5);

    await page.emulateMedia({ forcedColors: "active" });
    await expect(card).toHaveCSS("backdrop-filter", "none");
    await expect(card).toHaveCSS("box-shadow", "none");
  });

  test(`${theme} modal retains keyboard recovery and an opaque panel`, async ({ page }) => {
    await page.goto(`/?fixture=surface&theme=${theme}`);
    const trigger = page.getByRole("button", { name: "Open dialog", exact: true });
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "Edit project" });
    await expect(dialog).toBeVisible();
    expect((await dialog.evaluate(backgroundPixel))[3]).toBe(255);
    await expect(dialog).toHaveCSS("backdrop-filter", "none");
    await expect(page.getByRole("textbox", { name: "Project name" })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });
}
