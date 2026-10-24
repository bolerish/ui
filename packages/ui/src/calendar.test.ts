import assert from "node:assert/strict";
import test from "node:test";

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { Calendar } from "../dist/calendar.js";

test("calendar day names retain the visible numeral and caller date context", () => {
  const html = renderToStaticMarkup(
    createElement(Calendar, {
      mode: "single",
      month: new Date(2026, 9, 1),
      labels: { labelDayButton: () => "Custom date context" },
    }),
  );
  assert.match(html, /aria-label="1, Custom date context"/);
  assert.match(html, /aria-label="31, Custom date context"/);
});
