import { expect, test } from "@playwright/test";

for (const mode of ["light", "dark"]) {
  test(`Snackbar feedback stays readable with distinct decorative icons in ${mode} mode`, async ({
    page,
  }) => {
    await page.goto(`/docs/components/snackbar?colorMode=${mode}`);
    await page.waitForLoadState("networkidle");
    const table = page
      .getByRole("heading", { name: "tone", exact: true })
      .locator("xpath=following::table[1]");
    const pills = table.locator("[data-bolerish-status-pill]");
    await expect(pills).toHaveCount(5);
    const icons: string[] = [];
    for (const pill of await pills.all()) {
      await expect(pill).toBeVisible();
      const icon = pill.locator("svg");
      await expect(icon).toHaveCount(1);
      await expect(icon).toHaveAttribute("aria-hidden", "true");
      icons.push(await icon.innerHTML());
      const colors = await pill.evaluate((element) => {
        const canvas = document.createElement("canvas");
        canvas.width = canvas.height = 1;
        const context = canvas.getContext("2d", { willReadFrequently: true })!;
        const rgba = (color: string) => {
          context.clearRect(0, 0, 1, 1);
          context.fillStyle = color;
          context.fillRect(0, 0, 1, 1);
          return [...context.getImageData(0, 0, 1, 1).data].map((value) => value / 255);
        };
        const composite = (front: number[], back: number[]) =>
          front
            .slice(0, 3)
            .map((value, index) => value * front[3] + back[index] * (1 - front[3]))
            .concat(1);
        const luminance = (color: number[]) => {
          const linear = color
            .slice(0, 3)
            .map((value) => (value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4));
          return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
        };
        const contrast = (first: number[], second: number[]) => {
          const a = luminance(first);
          const b = luminance(second);
          return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
        };
        const ancestors: Element[] = [];
        for (let parent = element.parentElement; parent; parent = parent.parentElement)
          ancestors.push(parent);
        let backdrop = [1, 1, 1, 1];
        for (const ancestor of ancestors.reverse()) {
          backdrop = composite(rgba(getComputedStyle(ancestor).backgroundColor), backdrop);
        }
        const style = getComputedStyle(element);
        const fill = rgba(style.backgroundColor);
        const background = composite(fill, backdrop);
        return {
          tone: element.textContent?.trim(),
          alpha: fill[3],
          textContrast: contrast(rgba(style.color), background),
          fillContrast: contrast(background, backdrop),
          borderContrast: contrast(composite(rgba(style.borderTopColor), backdrop), backdrop),
        };
      });
      expect(colors.textContrast, `${mode}/${colors.tone}: text`).toBeGreaterThanOrEqual(4.5);
      expect(colors.borderContrast, `${mode}/${colors.tone}: border`).toBeGreaterThan(
        colors.fillContrast,
      );
      if (colors.tone !== "neutral") expect(colors.alpha).toBeCloseTo(0.12, 2);
    }
    expect(new Set(icons).size).toBe(5);
  });
}
