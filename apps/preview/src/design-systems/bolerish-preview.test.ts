import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

import { createStateStore } from "@json-render/core";

import { createBolerishHandlers, parseBolerishPreview } from "./bolerish-preview.ts";

const profile = JSON.parse(
  await readFile(new URL("../../drafts/profile-settings.json", import.meta.url), "utf8"),
);
const overview = JSON.parse(
  await readFile(new URL("../../drafts/overview.json", import.meta.url), "utf8"),
);

function createProfile() {
  const store = createStateStore(structuredClone(profile.state));
  return { store, handlers: createBolerishHandlers(store, "profile-settings") };
}

test("saved drafts pass the existing public catalog parser", () => {
  for (const draft of [profile, overview])
    assert.deepEqual(parseBolerishPreview(draft.spec, draft.state, draft.example), draft.spec);
  assert.deepEqual(createBolerishHandlers(createStateStore({})), {});
});

test("rejects unknown examples, actions and invalid initial binding or example state", () => {
  assert.throws(
    () => parseBolerishPreview(overview.spec, overview.state, "unknown"),
    /지원하지 않는 예제/,
  );
  assert.throws(
    () => createBolerishHandlers(createStateStore({}), "unknown"),
    /지원하지 않는 예제/,
  );
  assert.throws(() => parseBolerishPreview(profile.spec, profile.state), /등록되지 않은 액션/);
  const unknownAction = structuredClone(profile);
  unknownAction.spec.elements.save.on.press.action = "deleteAll";
  assert.throws(
    () => parseBolerishPreview(unknownAction.spec, unknownAction.state, unknownAction.example),
    /등록되지 않은 액션/,
  );
  const wrongState = { ...profile.state, email: false };
  assert.throws(() => parseBolerishPreview(profile.spec, wrongState, profile.example));
  assert.throws(() => createBolerishHandlers(createStateStore(wrongState), profile.example));
  assert.throws(() => parseBolerishPreview(overview.spec, { project: false }));
});

test("validates current values and keeps immediate notification preference local", async () => {
  const { store, handlers } = createProfile();
  await handlers.save?.({});
  assert.equal(store.get("/error"), "이메일 주소를 확인해주세요.");
  assert.equal(store.get("/pending"), false);
  store.set("/email", "ada@example.com");
  handlers.validate?.({});
  assert.equal(store.get("/error"), "");
  store.set("/notifications", true);
  handlers.preference?.({});
  assert.equal(store.get("/status"), "예제 알림을 켰어요.");
  store.set("/notifications", false);
  handlers.preference?.({});
  assert.equal(store.get("/status"), "예제 알림을 껐어요.");
});

test("save blocks duplicates, preserves input on failure and permits retry", async (context) => {
  context.mock.timers.enable({ apis: ["setTimeout"] });
  const { store, handlers } = createProfile();
  store.set("/email", "ada@example.com");
  handlers.failNextSave?.({});
  const failedSave = handlers.save?.({});
  assert.equal(store.get("/pending"), true);
  const pendingSnapshot = store.getSnapshot();
  await handlers.save?.({});
  assert.equal(store.getSnapshot(), pendingSnapshot);
  context.mock.timers.tick(1500);
  await failedSave;
  assert.equal(store.get("/email"), "ada@example.com");
  assert.equal(
    store.get("/status"),
    "예제 저장에 실패했어요. 입력값은 그대로예요. 다시 저장해보세요.",
  );
  assert.equal(store.get("/pending"), false);
  assert.equal(store.get("/failNext"), false);
  const retry = handlers.save?.({});
  assert.equal(store.get("/pending"), true);
  context.mock.timers.tick(1500);
  await retry;
  assert.equal(store.get("/status"), "예제 저장을 마쳤어요: ada@example.com");
  assert.equal(store.get("/pending"), false);
});
