import { expect, test } from "@playwright/test";

for (const locale of ["en", "ko"]) {
  test(`critical ${locale} preferences retain supported settings and ignore removed surface modes`, async ({
    page,
    context,
  }) => {
    await context.addCookies([
      {
        name: "bolerish-docs-settings",
        value: encodeURIComponent(
          JSON.stringify({ surface: "glass", colorMode: "dark", density: "compact" }),
        ),
        url: test.info().project.use.baseURL!,
      },
    ]);
    await page.goto(locale === "ko" ? "/ko?surface=solid" : "/?surface=solid");
    await expect(page.locator("html")).toHaveCSS("--bolerish-density", "0.875");
    await expect(page.locator("html")).toHaveAttribute("data-bolerish-theme", "dark");
    await expect(page.locator("html")).not.toHaveAttribute("data-bolerish-surface");
    const trigger = page.getByRole("button", {
      name: locale === "ko" ? "설정" : "Settings",
      exact: true,
    });
    await trigger.click();
    await expect(page.getByRole("combobox", { name: "Surface", exact: true })).toHaveCount(0);
    const density = page.getByRole("combobox", { name: "Density", exact: true });
    await expect(density).toHaveValue("compact");
    await density.selectOption("spacious");
    await expect
      .poll(async () => {
        const cookie = (await context.cookies()).find(
          (item) => item.name === "bolerish-docs-settings",
        )!;
        return JSON.parse(decodeURIComponent(cookie.value));
      })
      .toMatchObject({ density: "spacious", colorMode: "dark" });
    const cookie = (await context.cookies()).find(
      (item) => item.name === "bolerish-docs-settings",
    )!;
    expect(JSON.parse(decodeURIComponent(cookie.value))).not.toHaveProperty("surface");
    await density.focus();
    await page.keyboard.press("Escape");
    await expect(trigger).toBeFocused();
    await page.reload();
    await expect(page.locator("html")).toHaveCSS("--bolerish-density", "1.125");
    await trigger.click();
    await expect(density).toHaveValue("spacious");
  });
}

test("critical isolated previews receive supported settings without persisting parent preferences", async ({
  page,
  context,
}) => {
  await page.goto("/");
  const savedPreferences = async () =>
    (await context.cookies()).find((cookie) => cookie.name === "bolerish-docs-settings")?.value;
  await expect.poll(savedPreferences).toBeDefined();
  const before = await savedPreferences();
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        const frame = document.createElement("iframe");
        frame.id = "preferences-preview-test";
        frame.src = "/preview/card--Default";
        const ready = (event: MessageEvent) => {
          if (
            event.origin === location.origin &&
            event.source === frame.contentWindow &&
            event.data?.type === "bolerish-preview-ready"
          ) {
            window.removeEventListener("message", ready);
            resolve();
          }
        };
        window.addEventListener("message", ready);
        document.body.append(frame);
      }),
  );
  const preview = page.frameLocator("#preferences-preview-test");
  await expect(preview.locator("html")).toHaveAttribute("data-bolerish-theme", "light");
  await page.locator("#preferences-preview-test").evaluate((node) => {
    (node as HTMLIFrameElement).contentWindow!.postMessage(
      { type: "bolerish-preview-globals", globals: { colorMode: "dark", surface: "glass" } },
      location.origin,
    );
  });
  await expect(preview.locator("html")).toHaveAttribute("data-bolerish-theme", "dark");
  await expect(preview.locator("html")).not.toHaveAttribute("data-bolerish-surface");
  expect(await savedPreferences()).toBe(before);
});
