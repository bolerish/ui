import { expect, test } from "@playwright/test";

for (const locale of ["en", "ko"]) {
  test(`critical ${locale} surface selection migrates legacy URLs and persists both modes`, async ({
    page,
    context,
  }) => {
    await page.addInitScript(() => {
      const key = "surface-test-document-loads";
      sessionStorage.setItem(key, String(Number(sessionStorage.getItem(key) ?? "0") + 1));
    });
    await page.goto(
      `${locale === "ko" ? "/ko" : "/"}?surface=liquid&density=compact&motionPreference=reduce&unit=px&fontPreset=serif-heading&extra=keep#content`,
    );
    await page.waitForLoadState("networkidle");
    await expect(page.locator("html")).toHaveAttribute("data-bolerish-surface", "glass");
    await expect(page).toHaveURL(/surface=glass/);
    expect(new URL(page.url()).searchParams.get("extra")).toBe("keep");
    expect(new URL(page.url()).hash).toBe("#content");
    expect(await page.evaluate(() => sessionStorage.getItem("surface-test-document-loads"))).toBe(
      "1",
    );
    const trigger = page.getByRole("button", {
      name: locale === "ko" ? "설정" : "Settings",
      exact: true,
    });
    const select = page.getByRole("combobox", {
      name: locale === "ko" ? "표면" : "Surface",
      exact: true,
    });
    await trigger.click();
    await expect(select).toHaveValue("glass");
    for (const mode of ["solid", "glass"] as const) {
      await select.selectOption(mode);
      await expect(page.locator("html")).toHaveAttribute("data-bolerish-surface", mode);
      await expect(select).toBeVisible();
      await expect
        .poll(async () => {
          const cookie = (await context.cookies()).find(
            (item) => item.name === "bolerish-docs-settings",
          );
          return JSON.parse(decodeURIComponent(cookie!.value));
        })
        .toMatchObject({
          surface: mode,
          density: "compact",
          motionPreference: "reduce",
          unit: "px",
          fontPreset: "serif-heading",
        });
    }
    await select.focus();
    await page.keyboard.press("Escape");
    await expect(trigger).toBeFocused();
    await page.reload();
    await page.waitForLoadState("networkidle");
    await expect(page.locator("html")).toHaveAttribute("data-bolerish-surface", "glass");
    await trigger.click();
    await expect(select).toHaveValue("glass");
  });
}

test("critical saved liquid migrates while present invalid or solid URL keys override it", async ({
  page,
  context,
}) => {
  for (const [search, expected] of [
    ["", "glass"],
    ["?surface=", "solid"],
    ["?surface=invalid", "solid"],
    ["?surface=solid", "solid"],
  ]) {
    await context.addCookies([
      {
        name: "bolerish-docs-settings",
        value: encodeURIComponent(JSON.stringify({ surface: "liquid", colorMode: "dark" })),
        url: "http://127.0.0.1:3005",
      },
    ]);
    await page.goto(`/${search}`);
    await page.waitForLoadState("networkidle");
    await expect(page.locator("html")).toHaveAttribute("data-bolerish-surface", expected);
    await expect(page.locator("html")).toHaveAttribute("data-bolerish-theme", "dark");
  }
});

test("critical isolated previews migrate legacy messages without persisting parent preferences", async ({
  page,
  context,
}) => {
  await context.addCookies([
    {
      name: "bolerish-docs-settings",
      value: encodeURIComponent(JSON.stringify({ surface: "solid", colorMode: "light" })),
      url: "http://127.0.0.1:3005",
    },
  ]);
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  const before = (await context.cookies()).find(
    (cookie) => cookie.name === "bolerish-docs-settings",
  )!.value;
  await page.evaluate(() => {
    const frame = document.createElement("iframe");
    frame.id = "glass-preview-test";
    frame.src = "/preview/card--Default?surface=liquid";
    document.body.append(frame);
  });
  const preview = page.frameLocator("#glass-preview-test");
  await expect(preview.locator("html")).toHaveAttribute("data-bolerish-surface", "glass");
  await expect
    .poll(() =>
      page
        .locator("#glass-preview-test")
        .evaluate((node) => (node as HTMLIFrameElement).contentWindow!.location.search),
    )
    .toContain("surface=glass");
  await page.locator("#glass-preview-test").evaluate((node) => {
    (node as HTMLIFrameElement).contentWindow!.postMessage(
      { type: "bolerish-preview-globals", globals: { surface: "liquid", colorMode: "dark" } },
      location.origin,
    );
  });
  await expect(preview.locator("html")).toHaveAttribute("data-bolerish-theme", "dark");
  await expect(preview.locator("html")).toHaveAttribute("data-bolerish-surface", "glass");
  await preview.locator("html").evaluate(
    () =>
      new Promise<void>((resolve) => {
        window.addEventListener("message", () => resolve(), { once: true });
        window.postMessage(
          { type: "bolerish-preview-globals", globals: { surface: "solid" } },
          location.origin,
        );
      }),
  );
  await expect(preview.locator("html")).toHaveAttribute("data-bolerish-surface", "glass");
  expect(
    (await context.cookies()).find((cookie) => cookie.name === "bolerish-docs-settings")!.value,
  ).toBe(before);
});
