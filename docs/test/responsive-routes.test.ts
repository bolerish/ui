import assert from "node:assert/strict";
import test from "node:test";

import { responsiveRoutes } from "./responsive-routes.ts";

const available = ["/", "/docs/components/button", "/docs/components/input"];

test("a PR document selection visits the home page and only the selected pages", () => {
  assert.deepEqual(responsiveRoutes(available, '["/docs/components/button"]'), [
    "/",
    "/docs/components/button",
  ]);
  assert.deepEqual(
    responsiveRoutes(available, '["/", "/docs/components/button", "/docs/components/button"]'),
    ["/", "/docs/components/button"],
  );
});

test("local/full runs and removed pages retain full coverage; malformed selections fail", () => {
  for (const selection of [undefined, "", "[]", '["/docs/removed"]']) {
    assert.deepEqual(responsiveRoutes(available, selection), available);
  }
  for (const selection of ["null", "{}", "[12]", "invalid"]) {
    assert.throws(() => responsiveRoutes(available, selection));
  }
});
