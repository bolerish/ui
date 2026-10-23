/* oxlint-disable react/no-children-prop -- Node SSR tests use createElement without JSX. */
import assert from "node:assert/strict";
import test from "node:test";

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../../dist/accordion.js";
import { Button } from "../../dist/button.js";
import { Card } from "../../dist/card.js";
import { Carousel, CarouselItem } from "../../dist/carousel.js";
import { Input } from "../../dist/input.js";
import { NativeSelect } from "../../dist/native-select.js";
import { Paragraph } from "../../dist/paragraph.js";
import { Textarea } from "../../dist/textarea.js";
import { Timeline } from "../../dist/timeline.js";

const styling = { className: "consumer-class", style: { opacity: 0.5 } };

test("consumer CSS classes and inline styles preserve compiled component styles", () => {
  for (const element of [
    createElement(Button, { ...styling, children: "Save" }),
    createElement(Card, styling),
    createElement(Input, styling),
    createElement(NativeSelect, styling),
    createElement(Paragraph, styling),
    createElement(Textarea, styling),
    createElement(Timeline, styling),
  ]) {
    const html = renderToStaticMarkup(element);
    assert.match(html, /class="[^"]*consumer-class/);
    assert.match(html, /class="(?!consumer-class")[^"]+/);
    assert.match(html, /style="[^"]*opacity:0.5/);
    assert.doesNotMatch(html, /\bxstyle=/);
  }
});

test("state callbacks and nested content retain their own styling target", () => {
  const html = renderToStaticMarkup(
    createElement(
      Accordion,
      { defaultValue: ["item"] },
      createElement(
        AccordionItem,
        { value: "item" },
        createElement(AccordionTrigger, { ...styling }, "Open"),
        createElement(AccordionContent, { ...styling, className: "content-class" }, "Content"),
      ),
    ),
  );
  assert.match(html, /<button[^>]*class="[^"]*consumer-class[^>]*style="[^"]*opacity:0.5/);
  assert.match(
    html,
    /<div[^>]*class="[^"]*content-class[^>]*style="[^"]*opacity:0.5[^>]*>Content<\/div>/,
  );
});

test("inline overrides retain dynamic component variables", () => {
  const html = renderToStaticMarkup(
    createElement(Carousel, {
      slideRatio: [70, 20],
      children: createElement(CarouselItem, styling, "Slide"),
    }),
  );
  assert.match(html, /style="[^"]*0\.7777777777777778[^"]*opacity:0.5/);
});

test("translucent cards select their treatment without forwarding variant to the DOM", () => {
  const defaultHtml = renderToStaticMarkup(createElement(Card, { children: "Content" }));
  const explicitDefault = renderToStaticMarkup(
    createElement(Card, { variant: "default", children: "Content" }),
  );
  const translucent = renderToStaticMarkup(
    createElement(Card, { ...styling, variant: "translucent", children: "Content" }),
  );
  assert.equal(explicitDefault, defaultHtml);
  assert.doesNotMatch(translucent, /\bvariant=/);
  assert.match(translucent, /consumer-class/);
  assert.match(translucent, /opacity:0.5/);
  const translucentClasses = translucent.match(/class="([^"]+)"/)?.[1].split(" ");
  assert.ok(
    translucentClasses?.some((name) => name !== "consumer-class" && !defaultHtml.includes(name)),
  );
});
