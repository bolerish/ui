import { expect, test } from "@playwright/test";

for (const theme of ["light", "dark"]) {
  test(`${theme} composition separates headings and retains field boundaries`, async ({
    page,
    browserName,
  }) => {
    await page.goto(`/?fixture=visual-system&theme=${theme}`);
    await expect(page.getByRole("heading", { name: "Project settings" })).toHaveCSS(
      "font-size",
      "32px",
    );
    await expect(page.getByRole("heading", { name: "Notifications" })).toHaveCSS(
      "font-size",
      "20px",
    );
    const cardHeader = page
      .getByRole("heading", { name: "Create account", exact: true })
      .locator("..");
    const inset = await cardHeader.evaluate((header) => {
      const card = header.parentElement!;
      const bounds = card.getBoundingClientRect();
      const content = header.getBoundingClientRect();
      const border = getComputedStyle(card);
      return {
        top: content.top - bounds.top - parseFloat(border.borderTopWidth),
        left:
          content.left -
          bounds.left +
          parseFloat(getComputedStyle(header).paddingLeft) -
          parseFloat(border.borderLeftWidth),
      };
    });
    expect(inset.top).toBeCloseTo(24, 1);
    expect(inset.left).toBeCloseTo(24, 1);
    await expect(cardHeader).toHaveCSS("padding-left", "24px");
    const name = page.getByRole("textbox", { name: "Name", exact: true });
    await expect(name).toHaveCSS("border-radius", "12px");
    const resting = await name.evaluate((node) => getComputedStyle(node).borderTopColor);
    await name.hover();
    await expect(name).toHaveCSS("border-top-color", resting);
    await name.focus();
    await expect(name).toHaveCSS("outline-style", "solid");
    await expect(name).toHaveCSS("outline-width", "2px");
    await name.fill("민영 Jeong");
    await expect(name).toHaveValue("민영 Jeong");
    await page.screenshot({
      path: test.info().outputPath(`${theme}-composition.png`),
      fullPage: true,
    });
    await page.goto(`/?fixture=dialog&theme=${theme}`);
    await page.getByRole("button", { name: "Open dialog", exact: true }).click();
    await expect(page.getByRole("dialog", { name: "Edit project" })).toHaveCSS(
      "padding-top",
      "24px",
    );
    await page.goto(`/?fixture=visual-system&theme=${theme}`);
    await expect(name).toHaveCSS("border-top-color", resting);
    // WebKit does not emulate the system palette; verify it on native devices.
    if (browserName !== "chromium") return;
    await page.emulateMedia({ forcedColors: "active" });
    await expect(name).toHaveCSS("border-top-width", "1px");
    const systemBorder = await page.evaluate(() => {
      const probe = document.createElement("div");
      probe.style.border = "1px solid ButtonBorder";
      document.body.append(probe);
      const color = getComputedStyle(probe).borderTopColor;
      probe.remove();
      return color;
    });
    await expect(name).toHaveCSS("border-top-color", systemBorder);
  });
}
