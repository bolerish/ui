import { expect, test } from "@playwright/test";

for (const component of ["dialog", "alert-dialog"] as const) {
  for (const theme of ["light", "dark"]) {
    test(`Liquid ${theme} ${component} dims only outside its panel`, async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto(
        component === "dialog"
          ? `/?fixture=dialog&surface=liquid&theme=${theme}`
          : `/?fixture=documentation&example=alert-dialog&surface=liquid&theme=${theme}`,
      );
      await page.evaluate(() => {
        document.documentElement.style.backgroundColor = "#b0c8e0";
        document.body.style.backgroundColor = "#b0c8e0";
        document.body.style.minHeight = "900px";
      });
      const trigger = page.getByRole("button", {
        name: component === "dialog" ? "Open dialog" : "Delete project",
        exact: true,
      });
      await trigger.click();
      const popup = page.getByRole(component === "dialog" ? "dialog" : "alertdialog");
      await expect(popup).toBeVisible();
      await expect(popup).toHaveCSS("opacity", "1");
      await popup.evaluate((node) =>
        Object.assign((node as HTMLElement).style, { width: "400px", height: "300px" }),
      );
      const box = (await popup.boundingBox())!;
      const normal = (await page.screenshot()).toString("base64");
      await popup.evaluate((node) => {
        const backdrop = node.parentElement!.previousElementSibling as HTMLElement;
        backdrop.style.visibility = "hidden";
        (node as HTMLElement).style.boxShadow = "none";
      });
      const reference = (await page.screenshot()).toString("base64");
      const pixels = await page.evaluate(
        async ({ normal, reference, box }) => {
          return Promise.all(
            [normal, reference].map(async (data) => {
              const image = new Image();
              image.src = `data:image/png;base64,${data}`;
              await image.decode();
              const canvas = document.createElement("canvas");
              canvas.width = image.width;
              canvas.height = image.height;
              const context = canvas.getContext("2d")!;
              context.drawImage(image, 0, 0);
              const at = (x: number, y: number) =>
                Array.from(context.getImageData(Math.round(x), Math.round(y), 1, 1).data).slice(
                  0,
                  3,
                );
              return {
                inside: at(box.x + box.width / 2, box.y + box.height * 0.8),
                outside: at(1000, 100),
              };
            }),
          );
        },
        { normal, reference, box },
      );
      for (let channel = 0; channel < 3; channel++) {
        expect(Math.abs(pixels[0].inside[channel] - pixels[1].inside[channel])).toBeLessThanOrEqual(
          2,
        );
        expect(pixels[0].outside[channel]).toBeLessThan(pixels[1].outside[channel] - 30);
      }
      await popup.evaluate((node) => {
        (node.parentElement!.previousElementSibling as HTMLElement).style.visibility = "";
        (node as HTMLElement).style.boxShadow = "";
      });
      await page.mouse.click(1000, 100);
      if (component === "alert-dialog") {
        await expect(popup).toBeVisible();
        await popup.getByRole("button", { name: "Cancel", exact: true }).click();
      }
      await expect(popup).toBeHidden();
      await expect(trigger).toBeFocused();
    });
  }
}

for (const parent of ["dialog", "drawer"]) {
  test(`nested Dialog over ${parent} keeps only the frontmost scrim`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`/?fixture=modal-nested&surface=liquid&parent=${parent}`);
    await page.evaluate(() => {
      document.documentElement.style.backgroundColor = "#b0c8e0";
      document.body.style.backgroundColor = "#b0c8e0";
      document.body.style.minHeight = "900px";
    });
    await page.getByRole("button", { name: "Open parent", exact: true }).click();
    await page.getByRole("button", { name: "Open child", exact: true }).click();
    const child = page.getByRole("dialog", { name: "Child modal", exact: true });
    await expect(child).toBeVisible();
    await expect(child).toHaveCSS("opacity", "1");
    const box = (await child.boundingBox())!;
    const normal = (await page.screenshot()).toString("base64");
    await page.locator('[role="dialog"]').evaluateAll((nodes) => {
      for (const node of nodes) {
        (node as HTMLElement).style.boxShadow = "none";
        const backdrop = node.parentElement!.previousElementSibling as HTMLElement | null;
        if (backdrop) backdrop.style.visibility = "hidden";
      }
    });
    const reference = (await page.screenshot()).toString("base64");
    const samples = await page.evaluate(
      async ({ normal, reference, box }) =>
        Promise.all(
          [normal, reference].map(async (data) => {
            const image = new Image();
            image.src = `data:image/png;base64,${data}`;
            await image.decode();
            const canvas = document.createElement("canvas");
            canvas.width = image.width;
            canvas.height = image.height;
            const context = canvas.getContext("2d")!;
            context.drawImage(image, 0, 0);
            return Array.from(
              context.getImageData(Math.round(box.x + box.width / 2), Math.round(box.y + 35), 1, 1)
                .data,
            ).slice(0, 3);
          }),
        ),
      { normal, reference, box },
    );
    for (let channel = 0; channel < 3; channel++)
      expect(Math.abs(samples[0][channel] - samples[1][channel])).toBeLessThanOrEqual(2);
    await page.keyboard.press("Escape");
    await expect(child).toBeHidden();
    await expect(page.getByRole("button", { name: "Open child", exact: true })).toBeFocused();
  });
}

for (const preference of ["solid", "reduced-transparency", "forced-colors"]) {
  test(`${preference} retains the ordinary Dialog backdrop and opaque panel`, async ({ page }) => {
    if (preference === "reduced-transparency") {
      const session = await page.context().newCDPSession(page);
      await session.send("Emulation.setEmulatedMedia", {
        features: [{ name: "prefers-reduced-transparency", value: "reduce" }],
      });
    }
    if (preference === "forced-colors") await page.emulateMedia({ forcedColors: "active" });
    await page.goto(`/?fixture=dialog&surface=${preference === "solid" ? "solid" : "liquid"}`);
    await page.getByRole("button", { name: "Open dialog", exact: true }).click();
    const popup = page.getByRole("dialog");
    await expect(popup).toHaveCSS("backdrop-filter", "none");
    const alpha = await popup.evaluate((node) => {
      const color = getComputedStyle(node.parentElement!.previousElementSibling!).backgroundColor;
      const context = document.createElement("canvas").getContext("2d")!;
      context.fillStyle = color;
      context.fillRect(0, 0, 1, 1);
      return context.getImageData(0, 0, 1, 1).data[3];
    });
    expect(alpha).toBeGreaterThan(0);
  });
}

test("opening a menu in a Liquid modal keeps the modal scrim", async ({ page }) => {
  await page.goto("/?fixture=modal-nested&surface=liquid&parent=dialog");
  await page.getByRole("button", { name: "Open parent", exact: true }).click();
  const popup = page.getByRole("dialog", { name: "Parent modal", exact: true });
  const before = await popup.evaluate((node) => getComputedStyle(node).boxShadow);
  await page.getByRole("button", { name: "Open menu", exact: true }).click();
  await expect(page.getByRole("menu")).toBeVisible();
  await expect(popup).toHaveCSS("box-shadow", before);
});
