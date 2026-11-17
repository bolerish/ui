import { readdirSync, existsSync, readFileSync } from "node:fs";

import { expect, test } from "@playwright/test";

import { getExampleSource } from "../src/docs/_ui/example-source";

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
  const cell = table.locator("tbody tr td").nth(1);
  expect(await frame.locator("html").evaluate(() => window.innerWidth)).toBeLessThanOrEqual(
    (await cell.boundingBox())!.width,
  );
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

test("prop tables keep aligned columns while expanding and reflow without horizontal scrolling", async ({
  page,
}) => {
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    for (const slug of ["drawer", "accordion", "calendar", "carousel", "toast"]) {
      await page.goto(`/docs/components/${slug}`);
      await page.waitForLoadState("networkidle");
      const tables = page.locator('[data-docs="props-table"]');
      expect(await tables.count()).toBeGreaterThan(0);
      for (const table of await tables.all()) {
        const cells = table.locator("tbody tr").first().locator(":scope > td");
        const value = (await cells.nth(0).boundingBox())!;
        const preview = (await cells.nth(1).boundingBox())!;
        if (width > 600) {
          expect(value.width).toBeCloseTo(160, 0);
          expect(preview.x).toBeCloseTo(value.x + value.width, 0);
        } else {
          expect(preview.x).toBeCloseTo(value.x, 0);
          expect(preview.y).toBeGreaterThanOrEqual(value.y + value.height - 1);
        }
        expect(await table.evaluate((node) => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
      }
      if (slug === "accordion") {
        const table = tables.last();
        const row = table.locator("tbody tr").first();
        const cell = row.locator(":scope > td").nth(1);
        const before = (await cell.boundingBox())!;
        const height = (await row.boundingBox())!.height;
        await row.getByRole("button", { name: "First item", exact: true }).click();
        await expect(row.getByText("First item details.", { exact: true })).toBeVisible();
        await expect.poll(async () => (await row.boundingBox())!.height).toBeGreaterThan(height);
        const after = (await cell.boundingBox())!;
        expect(after.x).toBeCloseTo(before.x, 0);
        expect(after.width).toBeCloseTo(before.width, 0);
        if (width === 1440 || width === 320)
          await test.info().attach(`accordion-props-${width}`, {
            body: await table.screenshot(),
            contentType: "image/png",
          });
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
    }
  }
});

test("all component prop tables fit a narrow viewport", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  const root = new URL("../src/docs/_content/components/", import.meta.url);
  const slugs = readdirSync(root).filter((slug) => existsSync(new URL(`${slug}/Props.tsx`, root)));
  for (const slug of slugs) {
    await page.goto(`/docs/components/${slug}`);
    const tables = page.locator('[data-docs="props-table"]');
    await expect(tables.first()).toBeVisible();
    const overflowing = await tables.evaluateAll((nodes) =>
      nodes
        .filter(
          (node) =>
            node.scrollWidth > node.clientWidth + 1 ||
            [...node.querySelectorAll("tbody > tr > td")].some(
              (cell) => cell.scrollWidth > cell.clientWidth + 1,
            ),
        )
        .map((node) => node.previousElementSibling?.textContent),
    );
    expect(overflowing, slug).toEqual([]);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      slug,
    ).toBe(true);
  }
});

for (const locale of ["en", "ko"] as const) {
  test(`Carousel cards source and all six prop examples work in ${locale}`, async ({
    page,
    context,
  }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto(`/docs/components/carousel${locale === "ko" ? "/ko" : ""}`);
    await page.waitForLoadState("networkidle");
    const example = page.locator('[data-preview-name="carousel--Cards"]');
    const expected = getExampleSource(
      readFileSync(
        new URL("../src/docs/_content/components/carousel/Cards.tsx", import.meta.url),
        "utf8",
      ),
    );
    await example.getByRole("button", { name: "Code", exact: true }).click();
    await expect(example.locator("pre")).toBeVisible();
    expect((await example.locator("pre > code > div").allTextContents()).join("\n")).toBe(expected);
    await page.bringToFront();
    await example.getByRole("button", { name: "Copy code", exact: true }).click();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(expected);

    const rows = page.locator('[data-docs="props-table"] tbody tr');
    await expect(rows.locator(":scope > td:first-child")).toHaveText([
      "outside",
      "inside",
      "horizontal",
      "vertical",
      "[1, 1]",
      "[70, 20]",
    ]);
    for (const row of await rows.all()) {
      await row.scrollIntoViewIfNeeded();
      const carousel = row.getByRole("region", { name: "Featured cards", exact: true });
      await expect(carousel).toBeVisible();
      const previous = carousel.getByRole("button", { name: "Previous slide", exact: true });
      const next = carousel.getByRole("button", { name: "Next slide", exact: true });
      await expect(previous).toBeDisabled();
      await expect(next).toBeEnabled();
      const first = carousel.getByText("First slide", { exact: true });
      const before = (await first.boundingBox())!;
      const vertical = (await row.locator(":scope > td:first-child").textContent()) === "vertical";
      await next.click();
      await expect(previous).toBeEnabled();
      await expect
        .poll(async () => {
          const after = (await first.boundingBox())!;
          return vertical ? before.y - after.y : before.x - after.x;
        })
        .toBeGreaterThan(50);
      await previous.click();
      await expect(previous).toBeDisabled();
    }
  });
}
