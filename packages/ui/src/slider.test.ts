import assert from "node:assert/strict";
import test from "node:test";

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { Slider } from "../dist/slider.js";

test("slider names reach the native range input", () => {
  const html = renderToStaticMarkup(
    createElement(Slider, { "aria-label": "Volume", defaultValue: 40 }),
  );
  assert.match(html, /<input[^>]*aria-label="Volume"/);
  const referenced = renderToStaticMarkup(
    createElement(Slider, { "aria-labelledby": "volume-label", defaultValue: 40 }),
  );
  assert.match(referenced, /<input[^>]*aria-labelledby="volume-label"/);
});
