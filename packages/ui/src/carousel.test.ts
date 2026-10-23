/* oxlint-disable react/no-children-prop -- Node SSR tests use createElement without JSX. */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselViewport,
} from "../dist/carousel.js";

function render(slideRatio?: readonly [number, number]) {
  return renderToStaticMarkup(
    createElement(
      Carousel,
      { "aria-label": "Featured cards", slideRatio, children: null },
      createElement(
        CarouselViewport,
        {},
        createElement(
          CarouselContent,
          {},
          createElement(CarouselItem, {}, "One"),
          createElement(CarouselItem, {}, "Two"),
        ),
      ),
      createElement(CarouselPrevious),
      createElement(CarouselNext),
    ),
  );
}

test("carousel ratio produces a gap-aware share without leaking props and keeps named controls", () => {
  const html = render([70, 20]);
  assert.match(html, /0\.7777777777777778/);
  assert.doesNotMatch(html, /slideRatio=/);
  assert.match(html, /aria-label="Featured cards"/);
  assert.match(html, /aria-label="Previous slide"/);
  assert.match(html, /aria-label="Next slide"/);
  assert.doesNotMatch(render(), /0\.7777777777777778/);
  const css = readFileSync(new URL("../dist/stylex.css", import.meta.url), "utf8");
  assert.match(html, /100%\s*-\s*var\(--bolerish-carousel-gap/);
  assert.match(css, /flex-basis:\s*var\(--bolerish-carousel-basis,\s*100%\)/);
  assert.match(css, /gap:\s*var\(--bolerish-carousel-gap/);
});

test("carousel rejects invalid ratios and unsupported vertical preview", () => {
  for (const ratio of [
    [0, 20],
    [-1, 20],
    [70, Infinity],
    [NaN, 20],
  ] as const) {
    assert.throws(() => render(ratio), /finite positive/);
  }
  assert.throws(
    () =>
      renderToStaticMarkup(
        createElement(Carousel, { slideRatio: [70, 20], options: { axis: "y" }, children: "Card" }),
      ),
    /horizontal/,
  );
});
