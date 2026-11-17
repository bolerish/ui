import { randomUUID } from "node:crypto";
import { rename, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { expect, test } from "@playwright/test";

const fixtureId = `zz-browser-${randomUUID()}`;
const fileName = `${fixtureId}.json`;
const otherName = `${fixtureId}-other.json`;
const fileId = `../drafts/${fileName}`;
const file = fileURLToPath(new URL(fileId, import.meta.url));
const unselected = fileURLToPath(new URL(`../drafts/${otherName}`, import.meta.url));
const temporary = `${file}.tmp`;
const simpleDraft = (text: string) => ({
  designSystem: "bolerish",
  state: { name: "초기값" },
  spec: {
    root: "card",
    elements: {
      card: { type: "Card", props: { title: text }, children: ["name"] },
      name: { type: "Input", props: { label: "이름", value: { $bindState: "/name" } } },
    },
  },
});

for (const path of [file, unselected, temporary])
  test.afterEach(async () => {
    await rm(path, { force: true });
  });

test("real local file add, edit, atomic replacement, errors, theme, viewport and deletion", async ({
  page,
}) => {
  await page.goto("/");
  await writeFile(file, JSON.stringify(simpleDraft("첫 시안")));
  const select = page.getByRole("combobox", { name: "시안", exact: true });
  await expect(select.locator("option", { hasText: fileName })).toHaveCount(1);
  await select.selectOption(fileId);
  const canvas = page.frameLocator('iframe[title="선택한 시안"]');
  await expect(canvas.getByRole("heading", { name: "첫 시안", exact: true })).toBeVisible();
  const name = canvas.getByRole("textbox", { name: "이름", exact: true });
  await name.fill("입력 유지");
  await page.getByRole("combobox", { name: "미리보기 너비" }).selectOption("390");
  await expect
    .poll(async () =>
      page
        .frames()
        .find((frame) => frame.url().includes("?canvas"))
        ?.evaluate(() => innerWidth),
    )
    .toBe(390);
  await expect(name).toHaveValue("입력 유지");
  const before = await canvas
    .getByRole("heading", { name: "첫 시안", exact: true })
    .evaluate((element) => getComputedStyle(element).color);
  await page.getByRole("combobox", { name: "미리보기 테마" }).selectOption("dark");
  await expect(canvas.locator("html")).toHaveAttribute("data-bolerish-theme", "dark");
  await expect
    .poll(() =>
      canvas
        .getByRole("heading", { name: "첫 시안", exact: true })
        .evaluate((element) => getComputedStyle(element).color),
    )
    .not.toBe(before);
  await expect(name).toHaveValue("입력 유지");
  await writeFile(unselected, JSON.stringify(simpleDraft("다른 파일")));
  await expect(select.locator("option", { hasText: otherName })).toHaveCount(1);
  await expect(name).toHaveValue("입력 유지");
  await writeFile(unselected, JSON.stringify(simpleDraft("다른 파일 수정")));
  await expect(name).toHaveValue("입력 유지");
  await writeFile(temporary, JSON.stringify(simpleDraft("자동 갱신")));
  await rename(temporary, file);
  await expect(canvas.getByRole("heading", { name: "자동 갱신", exact: true })).toBeVisible();
  await expect(name).toHaveValue("초기값");
  await writeFile(file, "{");
  await expect(page.getByRole("alert")).toContainText("시안을 표시하지 못했어요");
  await expect(canvas.getByRole("textbox")).toHaveCount(0);
  await writeFile(
    file,
    JSON.stringify({ ...simpleDraft("지원하지 않음"), designSystem: "missing" }),
  );
  await expect(page.getByRole("alert")).toContainText("등록되지 않은 디자인 시스템");
  await writeFile(
    file,
    JSON.stringify({
      designSystem: "bolerish",
      spec: { root: "x", elements: { x: { type: "Unknown", props: {} } } },
    }),
  );
  await expect(page.getByRole("alert")).toBeVisible();
  await writeFile(
    file,
    JSON.stringify({
      designSystem: "bolerish",
      spec: {
        root: "x",
        elements: { x: { type: "Paragraph", props: { text: "x", inventedProperty: true } } },
      },
    }),
  );
  await expect(page.getByRole("alert")).toContainText("inventedProperty");
  await writeFile(
    file,
    JSON.stringify({
      designSystem: "bolerish",
      spec: {
        root: "x",
        elements: {
          x: {
            type: "Button",
            props: { label: "잘못된 액션" },
            on: { press: { action: "notRegistered" } },
          },
        },
      },
    }),
  );
  await expect(page.getByRole("alert")).toContainText("notRegistered");
  await writeFile(file, JSON.stringify(simpleDraft("복구됨")));
  await expect(canvas.getByRole("heading", { name: "복구됨", exact: true })).toBeVisible();
  await expect(page.getByRole("alert")).toHaveCount(0);
  await page.evaluate(() => {
    window.addEventListener("message", (event) => {
      if (event.data?.message === "이전 결과")
        document.documentElement.dataset.staleReceived = "true";
    });
  });
  await page
    .frames()
    .find((frame) => frame.url().includes("?canvas"))
    ?.evaluate(() =>
      parent.postMessage(
        { type: "preview:status", revision: 0, status: "error", message: "이전 결과" },
        location.origin,
      ),
    );
  await expect(page.locator("html")).toHaveAttribute("data-stale-received", "true");
  await expect(page.getByRole("alert")).toHaveCount(0);
  await page.screenshot({ path: "/tmp/bolerish-preview-desktop.png", fullPage: true });
  await rm(file);
  await expect(select).not.toHaveValue(fileId);
  await expect(select.locator("option", { hasText: fileName })).toHaveCount(0);
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: "/tmp/bolerish-preview-mobile.png", fullPage: true });
  await select.focus();
  await expect(select).toBeFocused();
});

test("profile settings validation, pending state and save recovery use real DS components", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("combobox", { name: "시안", exact: true })
    .selectOption("../drafts/profile-settings.json");
  const canvas = page.frameLocator('iframe[title="선택한 시안"]');
  const email = canvas.getByRole("textbox", { name: "이메일", exact: true });
  const save = canvas.getByRole("button", { name: "이메일 저장", exact: true });
  await save.click();
  await expect(email).toHaveAttribute("aria-invalid", "true");
  await expect(email).toHaveAccessibleDescription("이메일 주소를 확인해주세요.");
  await email.fill("ada@example.com");
  await canvas.getByRole("switch", { name: "예제 알림", exact: true }).click();
  await expect(canvas.getByText("예제 알림을 켰어요.", { exact: true })).toBeVisible();
  await canvas.getByRole("button", { name: "다음 저장 실패시키기", exact: true }).click();
  await save.click();
  await expect(save).toBeDisabled();
  await expect(
    canvas.getByText("예제 저장에 실패했어요. 입력값은 그대로예요. 다시 저장해보세요.", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(email).toHaveValue("ada@example.com");
  await save.click();
  await expect(
    canvas.getByText("예제 저장을 마쳤어요: ada@example.com", { exact: true }),
  ).toBeVisible();
});

test("another catalog and registry render through the same canvas contract", async ({ page }) => {
  await writeFile(
    file,
    JSON.stringify({
      designSystem: "fixture",
      spec: {
        root: "fixture",
        elements: {
          fixture: { type: "FixtureText", props: { text: "다른 디자인 시스템" }, children: [] },
        },
      },
    }),
  );
  await page.goto("/");
  await page.getByRole("combobox", { name: "시안", exact: true }).selectOption(fileId);
  const canvas = page.frameLocator('iframe[title="선택한 시안"]');
  await expect(canvas.getByText("다른 디자인 시스템", { exact: true })).toBeVisible();
  await expect(canvas.locator("html")).toHaveAttribute("data-fixture-theme", "paper");
  await expect(canvas.locator("style, link[rel=stylesheet]")).toHaveCount(0);
  await expect(page.getByRole("combobox", { name: "미리보기 테마" })).toHaveValue("paper");
  await expect(page.getByRole("combobox", { name: "미리보기 테마" }).locator("option")).toHaveCount(
    1,
  );
});
