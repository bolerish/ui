import assert from "node:assert/strict";
import test from "node:test";

import { isNewComponent } from "./component-releases.ts";

test("new components are marked only in the exact release that introduced them", () => {
  assert.equal(isNewComponent("components", "snackbar", "0.18.0"), true);
  assert.equal(isNewComponent("components", "snackbar", "0.18.1"), false);
  assert.equal(isNewComponent("components", "snackbar"), false);
  assert.equal(isNewComponent("components", "snackbar", "0.19.0"), false);
  assert.equal(isNewComponent("components", "snackbar", "1.18.0"), false);
  assert.equal(isNewComponent("components", "snackbar", "0.17.0"), false);
  assert.equal(isNewComponent("components", "button", "0.18.1"), false);
  assert.equal(isNewComponent("guide", "snackbar", "0.18.1"), false);
  assert.equal(isNewComponent("guide", "snackbar", "0.18.0"), false);
  assert.equal(isNewComponent("api", "snackbar", "0.18.0"), false);
  assert.equal(isNewComponent("components", "constructor", "0.18.1"), false);
});
