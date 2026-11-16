import { test, expect } from "@playwright/test";

for (const mode of ["light", "dark"]) {
  test(`search and profile share dialog material and backdrop: ${mode}`, async ({ page }) => {
    await page.goto(`/docs/components/dialog?colorMode=${mode}`);
    const read = async () =>
      page.getByRole("dialog").evaluate((node) => {
        const style = (el: Element) => {
          const s = getComputedStyle(el);
          return {
            background: s.backgroundColor,
            filter: s.backdropFilter,
            opacity: s.opacity,
            position: s.position,
            zIndex: s.zIndex,
            shadow: s.boxShadow,
          };
        };
        const viewport = node.parentElement!;
        return {
          popup: style(node),
          backdrop: style(viewport.previousElementSibling!),
          ancestors: [
            node.parentElement?.parentElement?.tagName,
            node.parentElement?.parentElement?.parentElement?.tagName,
          ],
        };
      });
    await expect(async () => {
      await page.getByRole("button", { name: "Open profile", exact: true }).first().click();
      await expect(page.getByRole("dialog")).toBeVisible({ timeout: 500 });
    }).toPass({ timeout: 15000 });
    await expect(page.getByRole("dialog")).toHaveCSS("opacity", "1");
    const profile = await read();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();
    await page.getByRole("button", { name: "Search documentation", exact: true }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByRole("dialog")).toHaveCSS("opacity", "1");
    const search = await read();
    expect(search.popup).toEqual(profile.popup);
    expect(search.backdrop).toEqual(profile.backdrop);
    await page
      .getByRole("textbox", { name: "Search titles and content", exact: true })
      .fill("field");
    const results = page.getByRole("navigation", { name: "Search results", exact: true });
    const field = results.getByRole("link", { name: /^Field / });
    await expect(field).toBeVisible();
    const foreground = await page
      .getByRole("dialog")
      .evaluate((node) => getComputedStyle(node).color);
    await expect(field).toHaveCSS("color", foreground);
    await expect(field).toHaveCSS("text-decoration-line", "none");
    await expect(results).not.toContainText(/-{3,}/);
    await field.focus();
    await expect(field).toBeFocused();
    await expect(field).toHaveCSS("color", foreground);
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/docs\/components\/field/);
    await expect(page.getByRole("dialog")).toBeHidden();
  });
}
