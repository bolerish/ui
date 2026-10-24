import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "@playwright/test";

for (const theme of ["light", "dark"]) {
  test(`Input ${theme}: none and underline retain field sizing and keyboard focus`, async ({
    page,
  }) => {
    await page.goto(`/?fixture=input-variants&theme=${theme}`);
    const outline = page.getByRole("textbox", { name: "outline", exact: true });
    const none = page.getByRole("textbox", { name: "none", exact: true });
    const underline = page.getByRole("textbox", { name: "underline", exact: true });
    const original = await outline.evaluate((n) => {
      const s = getComputedStyle(n);
      return { height: s.height, fontSize: s.fontSize, lineHeight: s.lineHeight };
    });
    for (const input of [none, underline]) {
      const sizing = await input.evaluate((n) => {
        const s = getComputedStyle(n);
        return { height: s.height, fontSize: s.fontSize, lineHeight: s.lineHeight };
      });
      expect(sizing).toEqual(original);
      await expect(input).not.toHaveAttribute("variant");
    }
    await expect(none).toHaveCSS("border-top-width", "0px");
    await expect(none).toHaveCSS("border-bottom-width", "0px");
    await none.focus();
    await expect(none).toHaveCSS("outline-style", "solid");
    await expect(none).toHaveCSS("outline-width", "2px");
    await none.fill("New name");
    await expect(none).toHaveValue("New name");
    for (const side of ["top", "left", "right"])
      await expect(underline).toHaveCSS(`border-${side}-width`, "0px");
    await expect(underline).toHaveCSS("border-bottom-width", "1px");
    const before = await underline.boundingBox();
    await underline.focus();
    await expect(underline).toHaveCSS("outline-style", "none");
    await expect(underline).not.toHaveCSS("box-shadow", "none");
    expect(await underline.boundingBox()).toEqual(before);
    const focusedColor = await underline.evaluate((n) => getComputedStyle(n).borderBottomColor);
    const invalid = page.getByRole("textbox", { name: "Invalid underline", exact: true });
    await invalid.focus();
    await expect(invalid).not.toHaveCSS("border-bottom-color", focusedColor);
    const errorColor = await invalid.evaluate((n) => getComputedStyle(n).borderBottomColor);
    await expect(invalid).toHaveCSS("box-shadow", `${errorColor} 0px 1px 0px 0px`);
    await page.getByRole("textbox", { name: "outline", exact: true }).focus();
    await expect(page.getByRole("textbox", { name: "Invalid none", exact: true })).toHaveCSS(
      "outline-style",
      "solid",
    );
    for (const variant of ["none", "underline"])
      await expect(
        page.getByRole("textbox", { name: `Disabled ${variant}`, exact: true }),
      ).toBeDisabled();
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}

test("Input native invalid state keeps borderless errors and bottom-only focused errors", async ({
  page,
}) => {
  await page.goto("/?fixture=input-variants");
  for (const variant of ["none", "underline"]) {
    const input = page.getByRole("textbox", { name: `Required ${variant}`, exact: true });
    await input.fill("x");
    await input.fill("");
    await input.blur();
    expect(await input.evaluate((n) => (n as HTMLInputElement).validity.valid)).toBe(false);
    expect(await input.evaluate((n) => n.matches(":user-invalid"))).toBe(true);
    await input.focus();
    if (variant === "none") await expect(input).toHaveCSS("outline-style", "solid");
    else {
      await expect(input).toHaveCSS("outline-style", "none");
      const color = await input.evaluate((n) => getComputedStyle(n).borderBottomColor);
      await expect(input).toHaveCSS("box-shadow", `${color} 0px 1px 0px 0px`);
    }
  }
});

test("Input underline keeps focus visible in forced colors without a full outline", async ({
  page,
}) => {
  await page.emulateMedia({ forcedColors: "active" });
  await page.goto("/?fixture=input-variants");
  const input = page.getByRole("textbox", { name: "underline", exact: true });
  await input.focus();
  await expect(input).toHaveCSS("border-bottom-width", "2px");
  await expect(input).toHaveCSS("box-shadow", "none");
  await expect(input).toHaveCSS("outline-style", "none");
  for (const side of ["top", "left", "right"])
    await expect(input).toHaveCSS(`border-${side}-width`, "0px");
});
