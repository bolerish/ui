import { expect, test } from "@playwright/test";

test("visibility fades both ways, hides from accessibility, and respects reduced motion", async ({
  page,
}) => {
  await page.goto("/?fixture=documentation&example=status-pill");
  const pill = page.locator("[data-bolerish-status-pill]").first();
  await expect(pill).toBeVisible();
  await expect(pill).toHaveText("Operational");
  await page.getByRole("button", { name: "Toggle status" }).click();
  await expect(pill).toHaveAttribute("aria-hidden", "true");
  await expect(pill).toBeHidden();
  await expect(pill).toHaveCSS("opacity", "0");
  await page.getByRole("button", { name: "Toggle status" }).click();
  await expect(pill).toBeVisible();
  await expect(pill).toHaveCSS("opacity", "1");
  expect(await pill.evaluate((node) => getComputedStyle(node, "::before").animationName)).toBe(
    "bolerish-status-echo",
  );
  await page.getByRole("button", { name: "Toggle status" }).click();
  expect(await pill.evaluate((node) => getComputedStyle(node, "::before").animationName)).toBe(
    "bolerish-status-exit-echo",
  );
  await page.getByRole("button", { name: "Toggle status" }).click();
  const echo = await pill.evaluate((node) => getComputedStyle(node, "::before").boxShadow);
  expect(echo).not.toBe("none");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(pill).toHaveCSS("animation-name", "none");
  expect(await pill.evaluate((node) => getComputedStyle(node, "::before").display)).toBe("none");
  await page.getByRole("button", { name: "Toggle status" }).click();
  await expect(pill).toBeHidden();
});

test("runtime motion off hides immediately", async ({ page }) => {
  await page.goto("/?fixture=documentation&example=status-pill");
  await page.locator("html").evaluate((node) => node.setAttribute("data-bolerish-motion", "off"));
  await page.getByRole("button", { name: "Toggle status" }).click();
  const result = await page
    .locator("[data-bolerish-status-pill]")
    .first()
    .evaluate((node) => ({
      visibility: getComputedStyle(node).visibility,
      delay: getComputedStyle(node).transitionDelay,
    }));
  expect(result).toEqual({ visibility: "hidden", delay: "0s" });
});
