import { expect, test } from "@playwright/test";

test("visibility fades both ways, hides from accessibility, and respects reduced motion", async ({
  page,
}) => {
  await page.goto("/?fixture=documentation&example=snackbar");
  const pill = page.locator("[data-bolerish-status-pill]").first();
  await expect(pill).toHaveCount(1);
  await expect(pill).toBeHidden();
  await page.getByRole("button", { name: "Show status" }).click();
  await expect(pill).toBeVisible();
  await expect(pill).toHaveText("Operational");
  await page.getByRole("button", { name: /^(Show|Hide) status$/ }).click();
  await expect(pill).toHaveAttribute("aria-hidden", "true");
  await expect(pill).toBeHidden();
  await expect(pill).toHaveCSS("opacity", "0");
  await page.getByRole("button", { name: /^(Show|Hide) status$/ }).click();
  await expect(pill).toBeVisible();
  await expect(pill).toHaveCSS("opacity", "1");
  expect(await pill.evaluate((node) => getComputedStyle(node, "::before").animationName)).toBe(
    "bolerish-status-echo",
  );
  await page.getByRole("button", { name: /^(Show|Hide) status$/ }).click();
  expect(await pill.evaluate((node) => getComputedStyle(node, "::before").animationName)).toBe(
    "bolerish-status-exit-echo",
  );
  await page.getByRole("button", { name: /^(Show|Hide) status$/ }).click();
  const echo = await pill.evaluate((node) => getComputedStyle(node, "::before").boxShadow);
  expect(echo).not.toBe("none");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(pill).toHaveCSS("animation-name", "none");
  expect(await pill.evaluate((node) => getComputedStyle(node, "::before").display)).toBe("none");
  await page.getByRole("button", { name: /^(Show|Hide) status$/ }).click();
  await expect(pill).toBeHidden();
});

test("runtime motion off hides immediately", async ({ page }) => {
  await page.goto("/?fixture=documentation&example=snackbar");
  await page.getByRole("button", { name: "Show status" }).click();
  await page.locator("html").evaluate((node) => node.setAttribute("data-bolerish-motion", "off"));
  await page.getByRole("button", { name: /^(Show|Hide) status$/ }).click();
  const result = await page
    .locator("[data-bolerish-status-pill]")
    .first()
    .evaluate((node) => ({
      visibility: getComputedStyle(node).visibility,
      delay: getComputedStyle(node).transitionDelay,
    }));
  expect(result).toEqual({ visibility: "hidden", delay: "0s" });
});

for (const width of [1280, 390]) {
  test(`positioned pills use predictable viewport gaps at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/?fixture=status-position");
    await page.getByRole("button", { name: "Show status", exact: true }).click();
    const pill = page.locator("[data-bolerish-status-position] [data-bolerish-status-pill]");
    await expect(pill).toBeVisible();
    for (const position of [
      "top-left",
      "top-center",
      "top-right",
      "bottom-left",
      "bottom-center",
      "bottom-right",
    ]) {
      await page.getByRole("combobox", { name: "Status position" }).selectOption(position);
      const rect = (await pill.boundingBox())!;
      const gap = width <= 600 ? 16 : 24;
      if (position.startsWith("top")) expect(Math.abs(rect.y - gap)).toBeLessThan(1);
      else expect(Math.abs(900 - rect.y - rect.height - gap)).toBeLessThan(1);
      if (width <= 600 || position.endsWith("center"))
        expect(Math.abs(rect.x + rect.width / 2 - width / 2)).toBeLessThan(1);
      else if (position.endsWith("left")) expect(Math.abs(rect.x - gap)).toBeLessThan(1);
      else expect(Math.abs(width - rect.x - rect.width - gap)).toBeLessThan(1);
    }
    expect(await pill.evaluate((node) => node.parentElement?.parentElement === document.body)).toBe(
      true,
    );
    await page.getByRole("button", { name: "Hide status", exact: true }).click();
    await expect(pill).toBeHidden();
  });
}

test("one trigger displays only the selected status", async ({ page }) => {
  await page.goto("/?fixture=status-position");
  const pill = page.locator("[data-bolerish-status-pill]");
  await expect(pill).toHaveCount(1);
  await expect(pill).toBeHidden();
  await page.getByRole("combobox", { name: "Status", exact: true }).selectOption("Offline");
  await page.getByRole("button", { name: "Show status", exact: true }).click();
  await expect(pill).toHaveText("Offline");
  await expect(pill).toBeVisible();
  await page.getByRole("combobox", { name: "Status", exact: true }).selectOption("Syncing");
  await expect(pill).toHaveText("Syncing");
  await expect(pill).toHaveCount(1);
});

test("Snackbar auto-dismisses after its configured duration and can stay open", async ({
  page,
}) => {
  await page.goto("/?fixture=status-position");
  const time = new Date("2026-11-02T12:00:00Z");
  await page.clock.install({ time });
  await page.clock.pauseAt(new Date(time.getTime() + 1000));
  const pill = page.locator("[data-bolerish-status-pill]");
  await page.getByRole("button", { name: "Show status", exact: true }).click();
  await page.clock.runFor(2990);
  await expect(pill).not.toHaveAttribute("aria-hidden", "true");
  await page.clock.runFor(20);
  await expect(pill).toHaveAttribute("aria-hidden", "true");
  await expect(page.getByRole("button", { name: "Show status", exact: true })).toBeVisible();
  await page.getByRole("combobox", { name: "Duration", exact: true }).selectOption("0");
  await page.getByRole("button", { name: "Show status", exact: true }).click();
  await page.clock.runFor(10000);
  await expect(pill).not.toHaveAttribute("aria-hidden", "true");
});

test("Snackbar supports uncontrolled dismissal and StatusPill retains inline persistence", async ({
  page,
}) => {
  await page.goto("/?fixture=snackbar-uncontrolled");
  const pill = page.locator("[data-bolerish-status-pill]");
  await expect(pill).toHaveAttribute("aria-hidden", "true");
  await page.goto("/?fixture=status-legacy");
  await expect(page.locator("[data-bolerish-status-position]")).toHaveCount(0);
  await expect(pill).toBeVisible();
  await page.clock.install();
  await page.clock.fastForward(10000);
  await expect(pill).not.toHaveAttribute("aria-hidden", "true");
});

test("Snackbar default duration closes an uncontrolled notification after 3000ms", async ({
  page,
}) => {
  await page.clock.install();
  await page.clock.pauseAt(new Date());
  await page.goto("/?fixture=snackbar-default");
  const pill = page.locator("[data-bolerish-status-pill]");
  await expect(pill).not.toHaveAttribute("aria-hidden", "true");
  await page.clock.runFor(2990);
  await expect(pill).not.toHaveAttribute("aria-hidden", "true");
  await page.clock.runFor(20);
  await expect(pill).toHaveAttribute("aria-hidden", "true");
});

test("Snackbar documentation preview contains only its trigger", async ({ page }) => {
  await page.goto("/?fixture=documentation&example=snackbar");
  await expect(page.getByRole("combobox")).toHaveCount(0);
  await expect(page.getByRole("button")).toHaveCount(1);
  await page.getByRole("button", { name: "Show status", exact: true }).click();
  await expect(page.locator("[data-bolerish-status-pill]")).toHaveText("Operational");
});
