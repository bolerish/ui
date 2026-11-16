import { expect, test } from "@playwright/test";

test("critical JSON editing, bound fields, validation and save recovery", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/docs/api/json-render");
  const editor = page.getByRole("textbox", { name: "JSON specification", exact: true });
  const email = page.getByRole("textbox", { name: "Email", exact: true });
  const save = page.getByRole("button", { name: "Save email", exact: true });
  await save.click();
  await expect(email).toHaveAttribute("aria-invalid", "true");
  await expect(email).toHaveAccessibleDescription("Enter a valid email address.");
  await expect(page.getByText("Enter a valid email address.", { exact: true })).toBeVisible();
  await email.fill("ada@example.com");
  await expect(email).toHaveAttribute("aria-invalid", "false");
  await page.getByRole("switch", { name: "Demo notifications", exact: true }).click();
  await expect(page.getByText("Demo notifications enabled.", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Fail next save", exact: true }).click();
  await save.click();
  await expect(page.getByText("Saving demo email…", { exact: true })).toBeVisible();
  await expect(save).toBeDisabled();
  await expect(save).toHaveAttribute("aria-busy", "true");
  await expect(
    page.getByText("Demo save failed. Your email is preserved. Try again.", { exact: true }),
  ).toBeVisible();
  await expect(email).toHaveValue("ada@example.com");
  await save.click();
  await expect(page.getByText("Demo email saved: ada@example.com", { exact: true })).toBeVisible();
  const original = await editor.inputValue();
  await editor.fill("{");
  await page.getByRole("button", { name: "Apply JSON", exact: true }).click();
  await expect(
    page.getByText(
      "Could not apply this specification. Check JSON, supported props, bindings, actions and tree references. The previous preview is preserved.",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(email).toHaveValue("ada@example.com");
  await editor.fill(original.replace('"label": "Email"', '"label": "Work email"'));
  await page.getByRole("button", { name: "Apply JSON", exact: true }).click();
  const renamed = page.getByRole("textbox", { name: "Work email", exact: true });
  await expect(renamed).toHaveValue("");
  await expect(renamed).toHaveCSS("border-top-style", "solid");
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(renamed).toBeVisible();
  await renamed.focus();
  await expect(renamed).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  expect(errors).toEqual([]);
});
