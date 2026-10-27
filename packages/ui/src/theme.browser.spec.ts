import { expect, test } from "@playwright/test";

test("omitted attributes retain light tokens and legacy classes still select dark", async ({
  page,
}) => {
  await page.goto("/?fixture=surface");
  await page.locator("html").evaluate((html) => html.removeAttribute("data-bolerish-theme"));
  await expect(page.getByTestId("surface")).toHaveCSS("color", "rgb(8, 9, 10)");
  await page.goto("/?fixture=surface&theme=dark&legacyTheme");
  await expect(page.locator("html")).not.toHaveAttribute("data-bolerish-theme");
  await expect(page.locator("html")).toHaveCSS("color-scheme", "dark");
  await expect(page.getByTestId("surface")).toHaveCSS("color", "rgb(245, 246, 248)");
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
  await expect(root).toHaveCSS("background-color", "rgb(8, 9, 10)");
  await expect(root).toHaveCSS("color", "rgb(245, 246, 248)");
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
  await expect(dialog).toHaveCSS("color", "rgb(245, 246, 248)");
  const darkShadow = await dialog.evaluate((node) => getComputedStyle(node).boxShadow);
  await root.evaluate((html) => html.setAttribute("data-bolerish-theme", "light"));
  await expect(root).toHaveCSS("background-color", "rgb(238, 238, 238)");
  await expect(root).toHaveCSS("color", "rgb(8, 9, 10)");
  await expect(root).toHaveCSS("color-scheme", "light");
  await expect(dialog).toHaveCSS("color", "rgb(8, 9, 10)");
  expect(await dialog.evaluate((node) => getComputedStyle(node).boxShadow)).not.toBe(darkShadow);
  await expect(root).toHaveClass("consumer-root");
});

test("compiled StyleX themes override built-in attributes on the same root", async ({ page }) => {
  await page.goto("/?fixture=dialog&theme=dark&customTheme");
  const root = page.locator("html");
  const classes = await root.getAttribute("class");
  await expect(root).toHaveCSS("background-color", "rgb(18, 52, 86)");
  await expect(root).toHaveCSS("color", "rgb(254, 220, 186)");
  await page.getByRole("button", { name: "Open dialog" }).click();
  const dialog = page.getByRole("dialog", { name: "Edit project" });
  await expect(dialog).toHaveCSS("color", "rgb(254, 220, 186)");
  const shadow = await dialog.evaluate((node) => getComputedStyle(node).boxShadow);
  await root.evaluate((html) => html.setAttribute("data-bolerish-theme", "light"));
  await expect(root).toHaveCSS("background-color", "rgb(18, 52, 86)");
  await expect(root).toHaveCSS("color-scheme", "light");
  await expect(root).toHaveAttribute("class", classes!);
  await expect(dialog).toHaveCSS("box-shadow", shadow);
  await root.evaluate((html) => html.removeAttribute("class"));
  await expect(root).toHaveCSS("background-color", "rgb(238, 238, 238)");
  expect(await dialog.evaluate((node) => getComputedStyle(node).boxShadow)).not.toBe(shadow);
});

test("a scoped light surface resets inherited dark tokens", async ({ page }) => {
  await page.goto("/?fixture=surface&theme=dark");
  const card = page.getByTestId("surface");
  await card.evaluate((node) => node.setAttribute("data-bolerish-theme", "light"));
  await expect(card).toHaveCSS("color", "rgb(8, 9, 10)");
  await expect(card).toHaveCSS("color-scheme", "light");
  await expect(page.locator("html")).toHaveCSS("color", "rgb(245, 246, 248)");
});
