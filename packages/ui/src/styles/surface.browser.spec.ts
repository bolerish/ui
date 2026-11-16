import { test, expect } from "@playwright/test";

function backgroundPixel(node: Element) {
  const ctx = document.createElement("canvas").getContext("2d")!;
  ctx.fillStyle = getComputedStyle(node).backgroundColor;
  ctx.fillRect(0, 0, 1, 1);
  return Array.from(ctx.getImageData(0, 0, 1, 1).data);
}

function borderPixel(node: Element) {
  const ctx = document.createElement("canvas").getContext("2d")!;
  ctx.fillStyle = getComputedStyle(node).borderTopColor;
  ctx.fillRect(0, 0, 1, 1);
  return Array.from(ctx.getImageData(0, 0, 1, 1).data);
}

for (const theme of ["light", "dark"]) {
  test(`Glass ${theme} changes material, retains readable text and solid fallback`, async ({
    page,
  }) => {
    await page.goto(`/?fixture=surface&translucent&theme=${theme}&surface=solid`);
    const card = page.getByTestId("surface");
    const solidPixel = await card.evaluate(backgroundPixel);
    const solidBorder = await card.evaluate(borderPixel);
    const borderWidth = await card.evaluate((n) => getComputedStyle(n).borderTopWidth);
    const solid = await card.evaluate((n) => {
      const s = getComputedStyle(n);
      return { color: s.backgroundColor, filter: s.backdropFilter, shadow: s.boxShadow };
    });
    await page.goto(`/?fixture=surface&translucent&theme=${theme}&surface=glass`);
    const glass = await card.evaluate((n) => {
      const s = getComputedStyle(n);
      return { color: s.backgroundColor, filter: s.backdropFilter, shadow: s.boxShadow };
    });
    expect(await card.evaluate(borderPixel)).toEqual(solidBorder);
    await expect(card).toHaveCSS("border-top-width", borderWidth);
    expect(glass.color).not.toBe(solid.color);
    expect(glass.filter).toContain("blur");
    expect(glass.shadow).toContain("inset");
    await expect(card).toHaveCSS("background-image", "none");
    expect((await card.evaluate(backgroundPixel))[3] / 255).toBeCloseTo(0.72, 2);
    expect(
      (await page.getByRole("textbox", { name: "Surface field" }).evaluate(backgroundPixel))[3] /
        255,
    ).toBe(1);
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
    await page.screenshot({ path: test.info().outputPath(`glass-${theme}.png`) });
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
    expect(await card.evaluate(borderPixel)).toEqual(solidBorder);
  });

  test(`Glass ${theme} modal shares the quieter material and retains keyboard recovery`, async ({
    page,
  }) => {
    await page.goto(`/?fixture=surface&translucent&theme=${theme}&surface=solid`);
    const trigger = page.getByRole("button", { name: "Open dialog", exact: true });
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "Edit project" });
    const solidShadow = await dialog.evaluate((n) => getComputedStyle(n).boxShadow);
    await page.keyboard.press("Escape");
    await page.goto(`/?fixture=surface&translucent&theme=${theme}&surface=glass`);
    await trigger.click();
    await expect(dialog).toBeVisible();
    expect((await dialog.evaluate(backgroundPixel))[3] / 255).toBeCloseTo(0.8, 2);
    const shadow = await dialog.evaluate((n) => getComputedStyle(n).boxShadow);
    expect(shadow).toContain("inset");
    expect(shadow).not.toEqual(solidShadow);
    await page.locator("html").evaluate((n) => {
      n.dataset.bolerishSurface = "solid";
    });
    await expect(dialog).toHaveCSS("box-shadow", solidShadow);
    await expect(page.getByRole("textbox", { name: "Project name" })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });
}

for (const theme of ["light", "dark"]) {
  test(`Glass ${theme} applies glass to default cards, keeps fields opaque and omitted attributes solid`, async ({
    page,
  }) => {
    await page.goto(`/?fixture=surface&theme=${theme}&surface=glass`);
    const card = page.getByTestId("surface");
    expect((await card.evaluate(backgroundPixel))[3] / 255).toBeCloseTo(0.72, 2);
    await expect(card).toHaveCSS("backdrop-filter", "blur(24px) saturate(1.6)");
    expect(
      (await page.getByRole("textbox", { name: "Surface field" }).evaluate(backgroundPixel))[3],
    ).toBe(255);
    await page.goto(`/?fixture=surface&translucent&theme=${theme}`);
    await page.locator("html").evaluate((node) => node.removeAttribute("data-bolerish-surface"));
    expect((await card.evaluate(backgroundPixel))[3]).toBe(255);
    await expect(card).toHaveCSS("backdrop-filter", "none");
  });
}

for (const theme of ["light", "dark"]) {
  test(`Glass ${theme} visibly separates from Solid over detailed backing`, async ({ page }) => {
    await page.goto(`/?fixture=surface&translucent&pattern&theme=${theme}&surface=solid`);
    const card = page.getByTestId("surface");
    await card.locator(":scope > *").evaluateAll((nodes) => {
      for (const node of nodes) (node as HTMLElement).style.visibility = "hidden";
    });
    const solid = await card.screenshot();
    await page.locator("html").evaluate((node) => {
      node.dataset.bolerishSurface = "glass";
    });
    await expect(card).toHaveCSS("backdrop-filter", "blur(24px) saturate(1.6)");
    await page.evaluate(
      () =>
        new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        ),
    );
    const glass = await card.screenshot();
    await test.info().attach("solid", { body: solid, contentType: "image/png" });
    await test.info().attach("glass", { body: glass, contentType: "image/png" });
    const difference = await page.evaluate(
      async ([solid, glass]) => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d")!;
        const pixels: Uint8ClampedArray[] = [];
        for (const encoded of [solid, glass]) {
          const image = new Image();
          image.src = encoded;
          await image.decode();
          canvas.width = image.width;
          canvas.height = image.height;
          context.drawImage(image, 0, 0);
          pixels.push(context.getImageData(16, 16, image.width - 32, image.height - 32).data);
        }
        let difference = 0;
        for (let index = 0; index < pixels[0].length; index += 4) {
          for (let channel = 0; channel < 3; channel++) {
            difference += Math.abs(pixels[0][index + channel] - pixels[1][index + channel]);
          }
        }
        return difference / ((pixels[0].length / 4) * 3);
      },
      [solid, glass].map((buffer) => `data:image/png;base64,${buffer.toString("base64")}`),
    );
    expect(difference).toBeGreaterThanOrEqual(20);
  });
}
