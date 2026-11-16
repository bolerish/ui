import { readdirSync, existsSync } from "node:fs";

import { expect, test } from "@playwright/test";

test("component code shows and copies usage without preview scaffolding", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/docs/components/input");
  await page.waitForLoadState("networkidle");
  const example = page.locator('[data-preview-name="input--Default"]');
  await example.getByRole("button", { name: "Code", exact: true }).click();
  const code = example.locator("pre");
  await expect(code).toBeVisible();
  await expect(code).toContainText(
    '<Input aria-label="Email" placeholder="name@example.com" type="email" />',
  );
  await expect(code).not.toContainText("import ");
  await expect(code).not.toContainText("stylex.create");
  await expect(code).not.toContainText("export default");
  await page.bringToFront();
  await example.getByRole("button", { name: "Copy code", exact: true }).click();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(
    copied === '<Input aria-label="Email" placeholder="name@example.com" type="email" />',
  ).toBe(true);
  expect(copied).not.toContain("@example-");
});

test("props examples remain usable in tables at wide and narrow widths", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("bolerish-preview-tabs", JSON.stringify({ "button--Variants": "code" }));
  });
  for (const width of [1280, 360]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/docs/components/button");
    await expect(page.getByRole("heading", { name: "Preview", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Props", exact: true })).toBeVisible();
    await page.waitForLoadState("networkidle");
    await expect(page.locator("h3[id]")).toHaveText([
      "align",
      "disabled",
      "shape",
      "size",
      "variant",
    ]);
    const alignment = page
      .getByRole("heading", { name: "align", exact: true })
      .locator("xpath=following::table[1]");
    await expect(alignment.getByRole("button", { name: "Continue", exact: true })).toHaveCount(4);
    await expect(alignment.locator("svg")).toHaveCount(4);
    const table = page
      .getByRole("heading", { name: "variant", exact: true })
      .locator("xpath=following::table[1]");
    await expect(table.getByRole("columnheader")).toHaveText(["Value", "Preview"]);
    await expect(table.locator("tbody tr td:first-child")).toHaveText([
      "primary",
      "secondary",
      "outline",
      "ghost",
      "destructive",
    ]);
    for (const row of await table.locator("tbody tr").all()) {
      await expect(row.getByRole("button", { name: "Save", exact: true })).toBeVisible();
      await expect(row.getByRole("button")).toHaveCount(1);
    }
    await expect(table.getByRole("group", { name: "Example view" })).toHaveCount(0);
    await expect(table.getByRole("button", { name: "Code", exact: true })).toHaveCount(0);
    await expect(table.locator("pre")).toHaveCount(0);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
  }
});

test("every prop value renders a component in the generated documents", async ({ page }) => {
  await page.goto("/docs/components/button");
  const root = new URL("../src/docs/_content/components/", import.meta.url);
  const slugs = readdirSync(root).filter((slug) => existsSync(new URL(`${slug}/Props.tsx`, root)));
  const failures = await page.evaluate(async (slugs) => {
    const failures: string[] = [];
    for (const slug of slugs) {
      const response = await fetch(`/docs/components/${slug}`);
      if (!response.ok) {
        failures.push(`${slug}: ${response.status}`);
        continue;
      }
      const document = new DOMParser().parseFromString(await response.text(), "text/html");
      const headings = [...document.querySelectorAll("h3[id]")].map(
        (node) => node.textContent ?? "",
      );
      if (!headings.length || headings.join("|") !== [...headings].sort().join("|"))
        failures.push(`${slug}: prop ordering`);
      for (const table of document.querySelectorAll(
        'section[aria-label="Documentation table"] > table',
      )) {
        const headers = [...table.querySelectorAll(":scope > thead > tr > th")].map(
          (node) => node.textContent,
        );
        if (headers.join("|") !== "Value|Preview") failures.push(`${slug}: table headers`);
        for (const row of table.querySelectorAll(":scope > tbody > tr")) {
          const cells = row.querySelectorAll(":scope > td");
          if (cells.length !== 2 || !cells[1].children.length)
            failures.push(`${slug}: empty preview for ${cells[0]?.textContent}`);
        }
      }
    }
    return failures;
  }, slugs);
  expect(failures).toEqual([]);
});

test("each Snackbar position can be shown from its own value row", async ({ page }) => {
  await page.goto("/docs/components/snackbar");
  await page.waitForLoadState("networkidle");
  const table = page
    .getByRole("heading", { name: "position", exact: true })
    .locator("xpath=following::table[1]");
  await expect(table.locator("tbody tr td:first-child")).toHaveText([
    "top-left",
    "top-center",
    "top-right",
    "bottom-left",
    "bottom-center",
    "bottom-right",
  ]);
  await table.getByRole("button", { name: "Show top-left", exact: true }).click();
  const message = page.locator('[data-bolerish-status-position="top-left"] [data-visible="true"]');
  await expect(message).toBeVisible();
});

test("Toast position samples use separate viewports without code tabs", async ({ page }) => {
  await page.addInitScript(() =>
    localStorage.setItem(
      "bolerish-preview-tabs",
      JSON.stringify({ "toast--PositionTopLeft": "code" }),
    ),
  );
  await page.goto("/docs/components/toast");
  await page.waitForLoadState("networkidle");
  const table = page
    .getByRole("heading", { name: "position", exact: true })
    .locator("xpath=following::table[1]");
  await expect(table.locator("iframe")).toHaveCount(6);
  await expect(table.getByRole("button", { name: "Code", exact: true })).toHaveCount(0);
  const frame = table.frameLocator('iframe[title="toast--PositionTopLeft"]');
  expect(await frame.locator("html").evaluate(() => window.innerWidth)).toBe(720);
  await frame.getByRole("button", { name: "Show top-left", exact: true }).click();
  await expect(frame.getByText("Saved.", { exact: true })).toBeVisible();
});

test("AspectRatio rows show the requested proportions after images load", async ({ page }) => {
  await page.goto("/docs/components/aspect-ratio");
  await page.waitForLoadState("networkidle");
  const table = page
    .getByRole("heading", { name: "ratio", exact: true })
    .locator("xpath=following::table[1]");
  const previews = table.locator("tbody tr figure > div");
  await expect(previews).toHaveCount(3);
  for (const [index, ratio] of [1, 4 / 3, 16 / 9].entries()) {
    const preview = previews.nth(index);
    await preview.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        preview
          .locator("img")
          .evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0),
      )
      .toBe(true);
    const bounds = await preview.boundingBox();
    expect(bounds!.width / bounds!.height).toBeCloseTo(ratio, 1);
  }
});

test("dropdown trigger renders one button and opens the menu", async ({ page }) => {
  await page.goto("/docs/components/dropdown-menu");
  await page.waitForLoadState("networkidle");
  const example = page.locator('[data-preview-name="dropdown-menu--Default"]');
  const trigger = example.getByRole("button", { name: "Project actions", exact: true });
  await expect(trigger).toHaveCount(1);
  await expect(trigger.locator("button")).toHaveCount(0);
  await trigger.click();
  await expect(page.getByRole("menuitem", { name: "Rename" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
});

test("Props attributes appear as nested TOC links and navigate to their headings", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/docs/components/button");
  await page.waitForLoadState("networkidle");
  const toc = page.getByRole("navigation", { name: "On this page", exact: true });
  const props = toc.getByRole("link", { name: "Props", exact: true }).locator("..");
  await expect(props.locator("ul").getByRole("link")).toHaveText([
    "align",
    "disabled",
    "shape",
    "size",
    "variant",
  ]);
  const heading = page.getByRole("heading", { name: "variant", exact: true });
  const id = await heading.getAttribute("id");
  await props.getByRole("link", { name: "variant", exact: true }).click();
  expect(new URL(page.url()).hash).toBe(`#${id}`);
  await expect(heading).toBeInViewport();
});
