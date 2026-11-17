import assert from "node:assert/strict";
import { test } from "node:test";

import {
  canvasReadySchema,
  canvasStatusSchema,
  parseDraft,
  renderRequestSchema,
} from "./contracts.ts";

test("drafts default only app state and preserve the DS-owned specification", () => {
  const spec = { root: "title", elements: {} };
  assert.deepEqual(parseDraft(JSON.stringify({ designSystem: "bolerish", spec })), {
    designSystem: "bolerish",
    state: {},
    spec,
  });
  for (const source of [
    "{",
    "null",
    '{"designSystem":"bolerish"}',
    '{"designSystem":"","spec":{}}',
    '{"designSystem":"bolerish","state":[],"spec":{}}',
    '{"designSystem":"bolerish","spec":{},"module":"./untrusted.js"}',
  ]) {
    assert.throws(() => parseDraft(source));
  }
});

test("frame messages reject malformed revisions, executable fields and incomplete errors", () => {
  assert.equal(canvasReadySchema.safeParse({ type: "preview:ready" }).success, true);
  assert.equal(
    renderRequestSchema.safeParse({
      type: "preview:render",
      revision: 1,
      fileId: "overview.json",
      source: "{}",
      theme: "light",
    }).success,
    true,
  );
  assert.equal(
    renderRequestSchema.safeParse({
      type: "preview:render",
      revision: -1,
      fileId: "x",
      source: "{}",
      theme: "light",
    }).success,
    false,
  );
  assert.equal(
    renderRequestSchema.safeParse({
      type: "preview:render",
      revision: 1,
      fileId: "x",
      source: "{}",
      theme: "light",
      module: "untrusted",
    }).success,
    false,
  );
  assert.equal(
    canvasStatusSchema.safeParse({ type: "preview:status", revision: 1, status: "error" }).success,
    false,
  );
});
