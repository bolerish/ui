import { existsSync, readdirSync } from "node:fs";

import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "@playwright/test";

import {
  defaultExamples,
  excludedExamples,
  excludedAuditNodes,
  openedExamples,
} from "../test/browser/example-coverage";

const directory = new URL(
  "../../../docs/src/app/(site)/docs/_content/components/",
  import.meta.url,
);
test("all documented Default examples have an explicit audit decision", async () => {
  const actual = readdirSync(directory)
    .filter((name) => existsSync(new URL(name + "/Default.tsx", directory)))
    .sort();
  expect([...defaultExamples, ...Object.keys(excludedExamples)].sort()).toEqual(actual);
  for (const reason of Object.values(excludedExamples)) expect(reason.trim()).not.toBe("");
  for (const node of excludedAuditNodes) expect(node.reason.trim()).not.toBe("");
  await test.info().attach("audit-coverage", {
    body: JSON.stringify(
      {
        defaultExamples,
        themes: ["light", "dark"],
        openedExamples,
        excludedExamples,
        excludedAuditNodes,
      },
      null,
      2,
    ),
    contentType: "application/json",
  });
});

for (const theme of ["light", "dark"]) {
  for (const name of defaultExamples) {
    test(`Default ${name} / ${theme}: WCAG axe`, async ({ page }) => {
      await page.goto(`/?fixture=documentation&example=${name}&theme=${theme}`);
      await expect(page.getByTestId("documentation-example")).toBeVisible();
      const audit = async (state: "resting" | "open") => {
        const builder = new AxeBuilder({ page }).withTags([
          "wcag2a",
          "wcag2aa",
          "wcag21a",
          "wcag21aa",
          "wcag22aa",
        ]);
        for (const node of excludedAuditNodes) builder.exclude(node.selector);
        const result = await builder.analyze();
        await test.info().attach(`axe-${state}`, {
          body: JSON.stringify(
            { violations: result.violations, incomplete: result.incomplete },
            null,
            2,
          ),
          contentType: "application/json",
        });
        return result;
      };
      let results = await audit("resting");
      expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
      if (!(name in openedExamples)) return;
      const opening = openedExamples[name as keyof typeof openedExamples];
      if (opening.action === "fill")
        await page.getByRole("combobox", { name: opening.name }).fill("Re");
      else if (opening.action === "combobox")
        await page.getByRole("combobox", { name: opening.name }).click();
      else if (opening.action === "context")
        await page.getByText(opening.name, { exact: true }).click({ button: "right" });
      else if (opening.action === "menu")
        await page.getByRole("menuitem", { name: opening.name, exact: true }).click();
      else if (opening.action === "hover-link")
        await page.getByRole("link", { name: opening.name, exact: true }).hover();
      else if (opening.action === "hover")
        await page.getByRole("button", { name: opening.name, exact: true }).hover();
      else await page.getByRole("button", { name: opening.name, exact: true }).click();
      await expect(page.locator(opening.target).first()).toBeVisible();
      if (name === "hover-card")
        await expect(
          page.getByText("A calm, consistent design system", { exact: false }),
        ).toBeVisible();
      results = await audit("open");
      expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
    });
  }
}
