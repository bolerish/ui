import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { excludedAuditNodes, openedExamples } from "../../test/browser/example-coverage";

function backgroundAlpha(node: Element) {
  const context = document.createElement("canvas").getContext("2d")!;
  context.fillStyle = getComputedStyle(node).backgroundColor;
  context.fillRect(0, 0, 1, 1);
  return context.getImageData(0, 0, 1, 1).data[3] / 255;
}

for (const theme of ["light", "dark"]) {
  for (const [name, opening] of Object.entries(openedExamples)) {
    test(`Liquid ${theme} ${name} transmits its backing and retains opaque fallbacks`, async ({
      page,
    }) => {
      await page.goto(`/?fixture=documentation&example=${name}&theme=${theme}&surface=liquid`);
      if (opening.action === "fill")
        await page.getByRole("combobox", { name: opening.name }).fill("Re");
      else if (opening.action === "combobox")
        await page.getByRole("combobox", { name: opening.name }).click();
      else if (opening.action === "context")
        await page.getByText(opening.name, { exact: true }).click({ button: "right" });
      else if (opening.action === "menu")
        await page.getByRole("menuitem", { name: opening.name, exact: true }).click();
      else if (opening.action === "hover-link")
        await page.getByRole("link", { name: opening.name, exact: true }).hover();
      else if (opening.action === "hover")
        await page.getByRole("button", { name: opening.name, exact: true }).hover();
      else await page.getByRole("button", { name: opening.name, exact: true }).click();

      const content =
        name === "hover-card"
          ? page.getByText("A calm, consistent design system", { exact: false })
          : page.locator(opening.target).first();
      await expect(content).toBeVisible();
      await content.evaluate((node) => {
        for (let current: Element | null = node; current; current = current.parentElement) {
          if (getComputedStyle(current).backdropFilter !== "none") {
            current.setAttribute("data-tested-floating-surface", "");
            return;
          }
        }
        throw new Error("Opened content has no translucent surface");
      });
      const popup = page.locator("[data-tested-floating-surface]");
      expect(await popup.evaluate(backgroundAlpha)).toBeLessThanOrEqual(0.5);
      await expect(popup).toHaveCSS("opacity", "1");
      const filter = await popup.evaluate((node) => getComputedStyle(node).backdropFilter);
      const blur = filter.match(/blur\(([\d.]+)px\)/);
      expect(blur).not.toBeNull();
      expect(Number(blur![1])).toBeLessThanOrEqual(8);
      const audit = new AxeBuilder({ page }).withTags([
        "wcag2a",
        "wcag2aa",
        "wcag21a",
        "wcag21aa",
        "wcag22aa",
      ]);
      for (const node of excludedAuditNodes) audit.exclude(node.selector);
      const result = await audit.analyze();
      await test.info().attach("axe-open-liquid", {
        body: JSON.stringify({ violations: result.violations, incomplete: result.incomplete }),
        contentType: "application/json",
      });
      expect(result.violations).toEqual([]);
      await popup.screenshot({ path: test.info().outputPath(`${name}-${theme}.png`) });

      await page.locator("html").evaluate((node) => {
        node.dataset.bolerishSurface = "solid";
      });
      expect(await popup.evaluate(backgroundAlpha)).toBe(1);
      await expect(popup).toHaveCSS("backdrop-filter", "none");
      await page.locator("html").evaluate((node) => {
        node.dataset.bolerishSurface = "liquid";
      });
      const session = await page.context().newCDPSession(page);
      await session.send("Emulation.setEmulatedMedia", {
        features: [{ name: "prefers-reduced-transparency", value: "reduce" }],
      });
      expect(await popup.evaluate(backgroundAlpha)).toBe(1);
      await expect(popup).toHaveCSS("backdrop-filter", "none");
      await page.emulateMedia({ forcedColors: "active" });
      await expect(popup).toHaveCSS("box-shadow", "none");
    });
  }
}
