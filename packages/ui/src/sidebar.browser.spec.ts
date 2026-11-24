import { test, expect } from "@playwright/test";
test("desktop offcanvas removes navigation from keyboard interaction", async ({ page }) => {
  await page.goto("/?fixture=sidebar");
  await expect(page.getByRole("navigation", { name: "Navigation" })).toBeVisible();
  await page.getByRole("button", { name: "Toggle sidebar" }).click();
  await expect(page.getByRole("button", { name: "Toggle sidebar" })).toHaveAttribute(
    "aria-expanded",
    "false",
  );
  await expect(page.getByRole("navigation", { name: "Navigation" })).toHaveCount(0);
});
test("mobile dialog closes with Escape", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/?fixture=sidebar");
  await page.getByRole("button", { name: "Toggle sidebar" }).click();
  await expect(page.getByRole("dialog", { name: "Navigation" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Models", exact: true })).toHaveCSS("height", "44px");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Navigation" })).toBeHidden();
});
test("mobile close restores trigger and resizing clears the drawer", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/?fixture=sidebar");
  const trigger = page.getByRole("button", { name: "Toggle sidebar" });
  await trigger.click();
  await page.getByRole("button", { name: "Close", exact: true }).click();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.setViewportSize({ width: 1200, height: 844 });
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(page.getByRole("navigation", { name: "Navigation" })).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole("dialog")).toBeHidden();
});
test("icon preserves names and none stays expanded on either side", async ({ page }) => {
  for (const side of ["left", "right"]) {
    for (const variant of ["sidebar", "floating", "inset"]) {
      await page.goto(`/?fixture=sidebar&collapse=icon&side=${side}&variant=${variant}`);
      await page.getByRole("button", { name: "Toggle sidebar" }).click();
      await expect(page.getByRole("link", { name: "Models", exact: true })).toBeVisible();

      await expect(page.getByRole("link", { name: "History" })).toBeHidden();
    }
    await page.goto(`/?fixture=sidebar&collapse=none&side=${side}`);
    await page.getByRole("button", { name: "Toggle sidebar" }).click();
    await expect(page.getByRole("link", { name: "History" })).toBeVisible();
  }
});
test("controlled mobile state closes and returns focus", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/?fixture=sidebar-controlled");
  const trigger = page.getByRole("button", { name: "Toggle sidebar" });
  await trigger.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
});

test("sidebar desktop geometry", async ({ page }) => {
  await page.goto("/?fixture=sidebar&collapse=icon");
  const nav = page.getByRole("navigation", { name: "Navigation" });
  await expect(nav).toHaveCSS("width", "256px");
  const row = page.getByRole("link", { name: "Models", exact: true });
  await expect(row).toHaveCSS("height", "32px");
  await expect(row.locator("svg")).toHaveCSS("width", "16px");
  await expect(page.getByRole("link", { name: "History", exact: true })).toHaveAttribute(
    "aria-current",
    "page",
  );
  const playground = page.getByRole("button", { name: "Playground" });
  await expect(playground).not.toHaveAttribute("aria-current");
  await playground.click();
  await expect(page.getByRole("link", { name: "History", exact: true })).toBeHidden();
  await playground.click();
  await page.screenshot({ path: "/tmp/sidebar-expanded.png" });
  await page.getByRole("button", { name: "Toggle sidebar" }).click();
  await expect(nav).toHaveCSS("width", "48px");
  await page.screenshot({ path: "/tmp/sidebar-collapsed.png" });
});

test("parent height owns navigation and collapsed icons share its center", async ({ page }) => {
  await page.goto("/?fixture=sidebar&collapse=icon");
  const nav = page.getByRole("navigation", { name: "Navigation" });
  for (const height of [400, 600]) {
    await nav.evaluate((element, value) => {
      const provider = element.parentElement!.parentElement!;
      const root = provider.parentElement!;
      root.style.position = "relative";
      root.style.inset = "auto";
      root.style.height = `${value}px`;
    }, height);
    await expect(nav).toHaveCSS("height", `${height}px`);
    const footer = nav.getByRole("button").last();
    expect(
      (await footer.boundingBox())!.y + (await footer.boundingBox())!.height,
    ).toBeLessThanOrEqual((await nav.boundingBox())!.y + height);
  }
  await page.getByRole("button", { name: "Toggle sidebar" }).click();
  await expect(nav).toHaveCSS("width", "48px");
  const row = page.getByRole("link", { name: "Models", exact: true });
  await expect(row).toHaveCSS("width", "32px");
  const icon = (await row.locator("svg").boundingBox())!;
  const bounds = (await nav.boundingBox())!;
  expect(Math.abs(icon.x + icon.width / 2 - bounds.x - 24)).toBeLessThan(1);
});

test("collapse animates width and reduced motion removes travel", async ({ page }) => {
  await page.goto("/?fixture=sidebar&collapse=icon&motion=system");
  const nav = page.getByRole("navigation", { name: "Navigation" });
  const rail = nav.locator("..");
  expect(
    await rail.evaluate((el) => parseFloat(getComputedStyle(el).transitionDuration)),
  ).toBeGreaterThan(0);
  await page.getByRole("button", { name: "Toggle sidebar" }).click();
  await expect(nav).toHaveCSS("width", "48px");
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(
    await rail.evaluate((el) => parseFloat(getComputedStyle(el).transitionDuration)),
  ).toBeLessThanOrEqual(0.00001);
});

test("content scrolls while header and footer remain inside parent", async ({ page }) => {
  for (const height of [400, 600]) {
    await page.goto(`/?fixture=sidebar&height=${height}`);
    const nav = page.getByRole("navigation", { name: "Navigation" });
    const content = nav.locator(":scope > div").nth(1);
    const footer = nav.locator(":scope > div").last();
    const before = await footer.boundingBox();
    await content.evaluate((el) => {
      const filler = document.createElement("div");
      filler.style.height = "1000px";
      el.append(filler);
      el.scrollTop = 500;
    });
    expect(await content.evaluate((el) => el.scrollTop)).toBe(500);
    expect(await footer.boundingBox()).toEqual(before);
    await expect(nav).toHaveCSS("height", `${height}px`);
  }
});

test("hidden scrollbar retains wheel and keyboard scrolling and avatar alignment", async ({
  page,
}) => {
  await page.goto("/?fixture=sidebar&collapse=icon&height=400");
  const nav = page.getByRole("navigation", { name: "Navigation" });
  const content = nav.locator(":scope > div").nth(1);
  await expect(content).toHaveCSS("scrollbar-width", "none");
  await content.evaluate((el) => {
    const filler = document.createElement("div");
    filler.style.height = "1000px";
    el.append(filler);
    el.tabIndex = 0;
  });
  await content.hover();
  await page.mouse.wheel(0, 200);
  await expect.poll(() => content.evaluate((el) => el.scrollTop)).toBeGreaterThan(0);
  await content.focus();
  const before = await content.evaluate((el) => el.scrollTop);
  await page.keyboard.press("PageDown");
  await expect.poll(() => content.evaluate((el) => el.scrollTop)).toBeGreaterThan(before);
  const avatar = nav.locator(":scope > div").last().getByRole("button");
  await expect(avatar).toHaveCSS("padding-left", "8px");
  await page.getByRole("button", { name: "Toggle sidebar" }).click();
  await expect(nav).toHaveCSS("width", "48px");
  await content.evaluate((el) => {
    el.scrollTop = 0;
  });
  const avatarBox = (await avatar.locator("span").first().boundingBox())!;
  const iconBox = (await nav
    .getByRole("link", { name: "Models", exact: true })
    .locator("svg")
    .boundingBox())!;
  expect(Math.abs(avatarBox.x + avatarBox.width / 2 - iconBox.x - iconBox.width / 2)).toBeLessThan(
    1,
  );
  await page.screenshot({ path: "/tmp/sidebar-avatar-padding.png" });
});

test("composed group label toggles its panel", async ({ page }) => {
  await page.goto("/?fixture=sidebar&collapse=icon");
  const trigger = page.getByRole("button", { name: "Projects", exact: true });
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(trigger.locator("svg")).toHaveCount(1);
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByRole("link", { name: "Design Engineering" })).toBeHidden();
  await trigger.click();
  await expect(page.getByRole("link", { name: "Design Engineering" })).toBeVisible();
  await page.getByRole("button", { name: "Toggle sidebar" }).click();
  await expect(trigger).toBeHidden();
});

test("group trigger toggles accessible compiled content by mouse and keyboard", async ({
  page,
}) => {
  await page.goto("/?fixture=sidebar-groups");
  const trigger = page.getByRole("button", { name: "Projects" });
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(trigger).toHaveAttribute("aria-controls", /.+/);
  await expect(trigger.locator("svg")).toHaveCSS("transform", "matrix(-1, 0, 0, -1, 0, 0)");
  await expect(page.getByText("Plain content")).toBeVisible();
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByRole("link", { name: "Project link" })).toBeHidden();
  await trigger.press("Enter");
  await expect(page.getByRole("link", { name: "Project link" })).toBeVisible();
  await trigger.press("Space");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByText("Plain content")).toBeVisible();
});

test("controlled group starts closed and follows change callbacks", async ({ page }) => {
  await page.goto("/?fixture=sidebar-group-controlled");
  const trigger = page.getByRole("button", { name: "Controlled", exact: true });
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByText("Controlled content", { exact: true })).toBeHidden();
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByText("Controlled content", { exact: true })).toBeVisible();
});

test("icon collapse hides project content and returns its focus to sidebar toggle", async ({
  page,
}) => {
  await page.goto("/?fixture=sidebar&collapse=icon");
  const link = page.getByRole("link", { name: "Design Engineering", exact: true });
  await link.focus();
  await page
    .getByRole("button", { name: "Toggle sidebar" })
    .evaluate((button: HTMLButtonElement) => button.click());
  await expect(link).toBeHidden();
  await expect(page.getByRole("button", { name: "Projects", exact: true })).toBeHidden();
  await expect(page.getByRole("button", { name: "Toggle sidebar" })).toBeFocused();
});
