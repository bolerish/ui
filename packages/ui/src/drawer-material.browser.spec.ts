import { expect, test, type Page } from "@playwright/test";

async function scene(
  page: Page,
  theme: string,
  direction: string,
  overlay: string,
  surface = "liquid",
) {
  await page.goto(
    `/?fixture=drawer&theme=${theme}&surface=${surface}&direction=${direction}&overlay=${overlay}`,
  );
  await page.evaluate(() => {
    document.documentElement.style.backgroundColor = "#b0c8e0";
    document.body.style.backgroundColor = "#b0c8e0";
    document.body.style.minHeight = "900px";
  });
  const trigger = page.getByRole("button", { name: "Open drawer", exact: true });
  await trigger.click();
  const popup = page.getByRole("dialog", { name: "Move project", exact: true });
  await expect(popup).toBeVisible();
  const box = (await popup.boundingBox())!;
  const inside = { x: Math.round(box.x + box.width / 2), y: Math.round(box.y + box.height * 0.75) };
  const outside = {
    x: direction === "left" ? 1100 : direction === "right" ? 100 : 640,
    y: direction === "up" ? 800 : direction === "down" ? 100 : 450,
  };
  const image = `data:image/png;base64,${(await page.screenshot()).toString("base64")}`;
  const pixels = await page.evaluate(
    async ({ image, inside, outside }) => {
      const bitmap = await createImageBitmap(await (await fetch(image)).blob());
      const canvas = document.createElement("canvas");
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const context = canvas.getContext("2d")!;
      context.drawImage(bitmap, 0, 0);
      const at = ({ x, y }: { x: number; y: number }) =>
        Array.from(context.getImageData(x, y, 1, 1).data).slice(0, 3);
      return { inside: at(inside), outside: at(outside) };
    },
    { image, inside, outside },
  );
  return { pixels, outside, popup, trigger };
}

for (const theme of ["light", "dark"]) {
  for (const direction of ["down", "up", "left", "right"]) {
    test(`Liquid ${theme} ${direction} Drawer keeps its glass undimmed and outside click closes`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      const transparent = await scene(page, theme, direction, "transparent");
      const visible = await scene(page, theme, direction, "visible");
      for (let channel = 0; channel < 3; channel++) {
        expect(
          Math.abs(visible.pixels.inside[channel] - transparent.pixels.inside[channel]),
        ).toBeLessThanOrEqual(2);
        expect(visible.pixels.outside[channel]).toBeLessThan(
          transparent.pixels.outside[channel] - 30,
        );
      }
      await page.mouse.click(visible.outside.x, visible.outside.y);
      await expect(visible.popup).toBeHidden();
      await expect(visible.trigger).toBeFocused();
    });
  }
}

for (const surface of ["solid", "liquid"]) {
  test(`${surface} preserves transparent and absent overlay appearance`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    const transparent = await scene(page, "light", "down", "transparent", surface);
    const absent = await scene(page, "light", "down", "none", surface);
    expect(absent.pixels).toEqual(transparent.pixels);
  });
}

test("reduced transparency restores an opaque Drawer and its ordinary backdrop", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  const session = await page.context().newCDPSession(page);
  await session.send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-transparency", value: "reduce" }],
  });
  const transparent = await scene(page, "light", "down", "transparent");
  const visible = await scene(page, "light", "down", "visible");
  expect(visible.pixels.inside).toEqual(transparent.pixels.inside);
  await expect(visible.popup).toHaveCSS("backdrop-filter", "none");
  for (let channel = 0; channel < 3; channel++)
    expect(visible.pixels.outside[channel]).toBeLessThan(transparent.pixels.outside[channel] - 30);
});
