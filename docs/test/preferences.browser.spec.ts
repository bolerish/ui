import { expect, test } from "@playwright/test";

for (const locale of ["en", "ko"]) {
  test(`critical ${locale} liquid recovery preserves settings and returns focus`, async ({
    page,
    context,
  }) => {
    await page.goto(
      `${locale === "ko" ? "/ko" : "/"}?surface=liquid&density=compact&motionPreference=reduce&colorMode=dark`,
    );
    const trigger = page.getByRole("button", {
      name: locale === "ko" ? "설정" : "Settings",
      exact: true,
    });
    await page.waitForLoadState("networkidle");
    await trigger.click();
    await expect(page.getByRole("combobox", { name: "Surface", exact: true })).toHaveCount(0);
    const recover = page.getByRole("button", {
      name: locale === "ko" ? "불투명 표면 사용" : "Use solid surfaces",
    });
    for (const width of [320, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      const bounds = await recover.boundingBox();
      expect(bounds).not.toBeNull();
      expect(bounds!.x).toBeGreaterThanOrEqual(0);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
      expect(await recover.evaluate((node) => node.scrollWidth <= node.clientWidth)).toBe(true);
    }
    await expect(page.locator("html")).toHaveAttribute("data-bolerish-surface", "liquid");
    await recover.focus();
    await page.keyboard.press("Enter");
    await expect(trigger).toBeFocused();
    await expect(page.locator("html")).toHaveAttribute("data-bolerish-surface", "solid");
    await expect(recover).not.toBeVisible();
    await expect(page).not.toHaveURL(/surface=liquid/);
    const saved = (await context.cookies()).find(
      (cookie) => cookie.name === "bolerish-docs-settings",
    );
    expect(JSON.parse(decodeURIComponent(saved!.value))).toMatchObject({
      surface: "solid",
      density: "compact",
      motionPreference: "reduce",
      colorMode: "dark",
    });
    await page.reload();
    await page.waitForLoadState("networkidle");
    await trigger.click();
    await expect(recover).toHaveCount(0);
    await expect(page.locator("html")).toHaveAttribute("data-bolerish-surface", "solid");
    await expect(page.getByRole("combobox", { name: "Density", exact: true })).toHaveValue(
      "compact",
    );
    await expect(page.getByRole("combobox", { name: "Motion", exact: true })).toHaveValue("reduce");
  });
}

for (const locale of ["en", "ko"]) {
  test(`critical ${locale} solid hides recovery and liquid dismissal preserves surface`, async ({
    page,
  }) => {
    const path = locale === "ko" ? "/ko" : "/";
    const trigger = page.getByRole("button", {
      name: locale === "ko" ? "설정" : "Settings",
      exact: true,
    });
    const recover = page.getByRole("button", {
      name: locale === "ko" ? "불투명 표면 사용" : "Use solid surfaces",
    });
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    await trigger.click();
    await expect(recover).toHaveCount(0);
    await expect(page.locator("html")).toHaveAttribute("data-bolerish-surface", "solid");
    await expect(page.getByRole("combobox", { name: "Surface", exact: true })).toHaveCount(0);
    await page.keyboard.press("Escape");
    await page.goto(`${path}?surface=liquid`);
    await page.waitForLoadState("networkidle");
    await trigger.click();
    await expect(recover).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("data-bolerish-surface", "liquid");
    await page.keyboard.press("Escape");
    await page.waitForLoadState("networkidle");
    await trigger.click();
    await expect(recover).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("data-bolerish-surface", "liquid");
    await page.getByRole("combobox", { name: "Density", exact: true }).selectOption("spacious");
    await expect(recover).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("data-bolerish-surface", "liquid");
    await page.keyboard.press("Escape");
    await page.reload();
    await page.waitForLoadState("networkidle");
    await trigger.click();
    await expect(recover).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("data-bolerish-surface", "liquid");
    await expect(page.getByRole("combobox", { name: "Density", exact: true })).toHaveValue(
      "spacious",
    );
  });
}

test("critical saved liquid respects solid URL and recovery preserves all preferences", async ({
  page,
  context,
}) => {
  const saved = {
    surface: "liquid",
    density: "spacious",
    motionPreference: "reduce",
    colorMode: "dark",
    unit: "px",
    fontPreset: "serif-heading",
  };
  await context.addCookies([
    {
      name: "bolerish-docs-settings",
      value: encodeURIComponent(JSON.stringify(saved)),
      url: "http://127.0.0.1:3005",
    },
  ]);
  const trigger = page.getByRole("button", { name: "Settings", exact: true });
  const recover = page.getByRole("button", { name: "Use solid surfaces" });
  await page.goto("/?surface=solid");
  await page.waitForLoadState("networkidle");
  await trigger.click();
  await expect(recover).toHaveCount(0);
  await expect(page.locator("html")).toHaveAttribute("data-bolerish-surface", "solid");
  await context.addCookies([
    {
      name: "bolerish-docs-settings",
      value: encodeURIComponent(JSON.stringify(saved)),
      url: "http://127.0.0.1:3005",
    },
  ]);
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await trigger.click();
  await expect(recover).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("data-bolerish-surface", "liquid");
  await recover.focus();
  await page.keyboard.press("Space");
  await expect(trigger).toBeFocused();
  await expect(page.locator("html")).toHaveAttribute("data-bolerish-surface", "solid");
  await expect
    .poll(async () => {
      const cookie = (await context.cookies()).find(
        (item) => item.name === "bolerish-docs-settings",
      );
      return JSON.parse(decodeURIComponent(cookie!.value));
    })
    .toMatchObject({ ...saved, surface: "solid" });
  await page.getByRole("button", { name: "Get started", exact: true }).click();
  await page.waitForLoadState("networkidle");
  await trigger.click();
  await expect(recover).toHaveCount(0);
  await expect(page.locator("html")).toHaveAttribute("data-bolerish-surface", "solid");
  await page.goto("/?surface=liquid");
  await page.waitForLoadState("networkidle");
  await trigger.click();
  await expect(recover).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("data-bolerish-surface", "liquid");
});
