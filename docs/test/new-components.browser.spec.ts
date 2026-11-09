import { expect, test } from "@playwright/test";

for (const locale of ["en", "ko"] as const) {
  test(`critical exact release badges and empty New search in ${locale}`, async ({ page }) => {
    await page.goto(`/docs/components/snackbar${locale === "ko" ? "/ko" : ""}`);
    await expect(page.locator("[data-docs=sidebar] [data-docs=component-new-badge]")).toHaveCount(
      0,
    );
    await expect(async () => {
      await page
        .getByRole("button", {
          name: locale === "ko" ? "문서 검색" : "Search documentation",
          exact: true,
        })
        .click();
      await expect(page.getByRole("dialog")).toBeVisible({ timeout: 500 });
    }).toPass({ timeout: 15000, intervals: [500] });
    const filter = page.getByRole("button", { name: "#New", exact: true });
    await filter.click();
    await expect(filter).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("output[aria-live=polite]")).toHaveText(
      locale === "ko" ? "0개 문서" : "0 documents",
    );
    await expect(page.locator("[data-docs=search-results] a")).toHaveCount(0);
    await filter.click();
    await expect(filter).toHaveAttribute("aria-pressed", "false");
    await page
      .getByRole("textbox", {
        name: locale === "ko" ? "문서 제목과 내용 검색" : "Search titles and content",
        exact: true,
      })
      .fill("Snackbar");
    await expect(page.locator("[data-docs=search-results] a").first()).toBeVisible();
  });
}

test("New search combines text and tags and renders the new-result badge", async ({ page }) => {
  await page.route("**/search.en.json", (route) =>
    route.fulfill({
      json: [
        {
          section: "components",
          slug: "snackbar",
          title: "Snackbar",
          text: "Compact notification feedback.",
          isNew: true,
        },
        {
          section: "components",
          slug: "button",
          title: "Button",
          text: "Action feedback.",
          isNew: false,
        },
      ],
    }),
  );
  await page.goto("/docs/components/button");
  await expect(async () => {
    await page.getByRole("button", { name: "Search documentation", exact: true }).click();
    await expect(page.getByRole("dialog")).toBeVisible({ timeout: 500 });
  }).toPass({ timeout: 15000, intervals: [500] });
  const input = page.getByRole("textbox", { name: "Search titles and content", exact: true });
  await input.fill("#NEW notification");
  await expect(page.locator("[data-docs=search-results] a")).toHaveCount(1);
  await expect(page.locator("[data-docs=search-result-title]")).toHaveText("SnackbarNew");
  await expect(page.getByRole("button", { name: "#New", exact: true })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.getByRole("button", { name: "#New", exact: true }).click();
  await expect(input).toHaveValue("notification");
  await input.fill("feedback");
  await expect(page.locator("[data-docs=search-results] a")).toHaveCount(2);
});
