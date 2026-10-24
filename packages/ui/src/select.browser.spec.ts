import { test, expect } from "@playwright/test";

test("Select scrolls every option within a height-limited popup", async ({ page }) => {
  await page.goto("/?fixture=documentation&example=select");
  await page.getByRole("combobox", { name: "Theme" }).click();
  const list = page.getByRole("listbox");
  await list.evaluate((node) => {
    node.parentElement!.style.maxHeight = "80px";
  });
  expect(await list.evaluate((node) => node.scrollHeight > node.clientHeight)).toBe(true);
  await list.evaluate((node) => {
    node.scrollTop = node.scrollHeight;
  });
  const last = page.getByRole("option").last();
  expect((await last.boundingBox())!.y + (await last.boundingBox())!.height).toBeLessThanOrEqual(
    (await list.boundingBox())!.y + (await list.boundingBox())!.height + 1,
  );
});

test("Select supports keyboard choice and restores trigger focus", async ({ page }) => {
  await page.goto("/?fixture=select");
  const trigger = page.getByRole("combobox", { name: "Framework" });
  await trigger.focus();
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("listbox")).toBeVisible();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("listbox")).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect(trigger).not.toContainText("Choose framework");
  await trigger.click();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
});
test("Select highlights remain visible in forced colors", async ({ page }) => {
  await page.emulateMedia({ forcedColors: "active" });
  await page.goto("/?fixture=select");
  await page.getByRole("combobox", { name: "Framework" }).click();
  await page.keyboard.press("ArrowDown");
  const item = page.locator('[role="option"][data-highlighted]');
  await expect(item).toBeVisible();
  expect(
    await item.evaluate((n) => {
      const s = getComputedStyle(n);
      return s.outlineStyle !== "none" && parseFloat(s.outlineWidth) > 0;
    }),
  ).toBe(true);
});
