import { expect, test } from "@playwright/test";

import { expectColor } from "../test/browser/color-assertions";

test("omitted attributes retain light tokens and legacy classes still select dark", async ({
  page,
}) => {
  await page.goto("/?fixture=surface");
  await page.locator("html").evaluate((html) => html.removeAttribute("data-bolerish-theme"));
  await expectColor(page.getByTestId("surface"), "color", [35, 37, 42, 255]);
  await page.goto("/?fixture=surface&theme=dark&legacyTheme");
  await expect(page.locator("html")).not.toHaveAttribute("data-bolerish-theme");
  await expect(page.locator("html")).toHaveCSS("color-scheme", "dark");
  await expectColor(page.getByTestId("surface"), "color", [245, 246, 248, 255]);
});

test("CSS-only color modes switch root and portaled surfaces without replacing classes", async ({
  page,
}) => {
  await page.goto("/?fixture=surface");
  await page.locator("html").evaluate((html) => {
    html.setAttribute("class", "consumer-root");
    html.setAttribute("data-bolerish-theme", "dark");
  });
  const root = page.locator("html");
  await expectColor(root, "background-color", [8, 9, 10, 255]);
  await expectColor(root, "color", [245, 246, 248, 255]);
  await expect(root).toHaveCSS("color-scheme", "dark");
  expect(
    await page.getByTestId("surface").evaluate((node) => {
      const context = document.createElement("canvas").getContext("2d")!;
      context.fillStyle = getComputedStyle(node).backgroundColor;
      context.fillRect(0, 0, 1, 1);
      return [...context.getImageData(0, 0, 1, 1).data];
    }),
  ).toEqual([15, 16, 17, 255]);
  await page.getByRole("button", { name: "Open dialog" }).click();
  const dialog = page.getByRole("dialog", { name: "Edit project" });
  await expectColor(dialog, "color", [245, 246, 248, 255]);
  const darkShadow = await dialog.evaluate((node) => getComputedStyle(node).boxShadow);
  await root.evaluate((html) => html.setAttribute("data-bolerish-theme", "light"));
  await expectColor(root, "background-color", [255, 255, 255, 255]);
  await expectColor(root, "color", [35, 37, 42, 255]);
  await expect(root).toHaveCSS("color-scheme", "light");
  await expectColor(dialog, "color", [35, 37, 42, 255]);
  expect(await dialog.evaluate((node) => getComputedStyle(node).boxShadow)).not.toBe(darkShadow);
  await expect(root).toHaveClass("consumer-root");
});

test("compiled StyleX themes override built-in attributes on the same root", async ({ page }) => {
  await page.goto("/?fixture=dialog&theme=dark&customTheme");
  const root = page.locator("html");
  const classes = await root.getAttribute("class");
  await expectColor(root, "background-color", [18, 52, 86, 255]);
  await expectColor(root, "color", [254, 220, 186, 255]);
  await page.getByRole("button", { name: "Open dialog" }).click();
  const dialog = page.getByRole("dialog", { name: "Edit project" });
  await expectColor(dialog, "color", [254, 220, 186, 255]);
  const shadow = await dialog.evaluate((node) => getComputedStyle(node).boxShadow);
  await root.evaluate((html) => html.setAttribute("data-bolerish-theme", "light"));
  await expectColor(root, "background-color", [18, 52, 86, 255]);
  await expect(root).toHaveCSS("color-scheme", "light");
  await expect(root).toHaveAttribute("class", classes!);
  await expect(dialog).toHaveCSS("box-shadow", shadow);
  await root.evaluate((html) => html.removeAttribute("class"));
  await expectColor(root, "background-color", [255, 255, 255, 255]);
  expect(await dialog.evaluate((node) => getComputedStyle(node).boxShadow)).not.toBe(shadow);
});

test("a scoped light surface resets inherited dark tokens", async ({ page }) => {
  await page.goto("/?fixture=surface&theme=dark");
  const card = page.getByTestId("surface");
  await card.evaluate((node) => node.setAttribute("data-bolerish-theme", "light"));
  await expectColor(card, "color", [35, 37, 42, 255]);
  await expect(card).toHaveCSS("color-scheme", "light");
  await expectColor(page.locator("html"), "color", [245, 246, 248, 255]);
});

for (const theme of ["default", "light", "dark"]) {
  for (const [example, role, name, layers] of [
    [
      "tabs",
      "tab",
      "Overview",
      [
        [1, 2, 6],
        [2, 4, 4],
      ],
    ],
    [
      "popover",
      "dialog",
      "Align left",
      [
        [2, 4, 8],
        [8, 20, 6],
      ],
    ],
    [
      "dialog",
      "dialog",
      "Edit project",
      [
        [4, 8, 10],
        [16, 40, 8],
      ],
    ],
  ] as const) {
    test(`${theme} ${example} preserves contact and ambient shadow layers`, async ({ page }) => {
      await page.goto(
        example === "dialog"
          ? `/?fixture=dialog&theme=${theme}`
          : `/?fixture=documentation&example=${example}&theme=${theme}`,
      );
      if (theme === "default")
        await page.locator("html").evaluate((node) => node.removeAttribute("data-bolerish-theme"));
      if (example !== "tabs")
        await page
          .getByRole("button", {
            name: example === "dialog" ? "Open dialog" : "Align left",
            exact: true,
          })
          .click();
      const target = page.getByRole(role, example === "popover" ? {} : { name, exact: true });
      await expect(target).toBeVisible();
      let expected: readonly (readonly number[])[] = layers;
      if (theme === "dark") {
        const darkLayers = {
          tabs: [
            [1, 2, 24],
            [2, 4, 16],
          ],
          popover: [
            [2, 6, 32],
            [8, 24, 28],
          ],
          dialog: [
            [4, 10, 40],
            [16, 40, 36],
          ],
        };
        expected = darkLayers[example];
      }
      await expect
        .poll(() =>
          target.evaluate((node, values) => {
            const probe = document.createElement("div");
            probe.style.boxShadow = values
              .map(([y, blur, alpha]) => `0 ${y}px ${blur}px lab(0 0 0 / ${alpha}%)`)
              .join(", ");
            document.body.append(probe);
            const normalized = getComputedStyle(probe).boxShadow;
            probe.remove();
            return getComputedStyle(node).boxShadow.includes(normalized);
          }, expected),
        )
        .toBe(true);
      if (example === "tabs") {
        await expect(target).toHaveAttribute("aria-selected", "true");
        expect(await target.evaluate((node) => getComputedStyle(node).boxShadow)).toContain(
          "inset",
        );
      }
    });
  }
}
