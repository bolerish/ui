import assert from "node:assert/strict";
import test from "node:test";

import type { StyleXStyles } from "@stylexjs/stylex";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../dist/accordion.js";
import { Banner, BannerContent } from "../../dist/banner.js";
import { Combobox, ComboboxInput } from "../../dist/combobox.js";
import { Label } from "../../dist/label.js";
import { NativeSelect } from "../../dist/native-select.js";
import { TableContainer, Table, TableBody, TableCell, TableRow } from "../../dist/table.js";

// Compiled StyleX values let these tests isolate prop forwarding from the compiler.
const spacing = { $$css: true, marginBlockStart: "consumer-spacing" } as unknown as StyleXStyles<{
  marginBlockStart: 8;
}>;
const placement = { $$css: true, alignSelf: "consumer-placement" } as unknown as StyleXStyles<{
  alignSelf: "center";
}>;

test("container xstyle arrays reach the root without leaking a DOM attribute", () => {
  const html = renderToStaticMarkup(
    createElement(Accordion, {
      xstyle: [spacing, placement],
      className: "consumer-class",
      style: { opacity: 0.7 },
    }),
  );
  assert.match(html, /class="[^"]*consumer-spacing/);
  assert.match(html, /class="[^"]*consumer-placement/);
  assert.match(html, /class="[^"]*consumer-class/);
  assert.match(html, /style="[^"]*opacity:0.7/);
  assert.doesNotMatch(html, /\bxstyle=/i);
});

test("accordion trigger includes a heading and styles the button", () => {
  const html = renderToStaticMarkup(
    createElement(
      Accordion,
      null,
      createElement(
        AccordionItem,
        { value: "settings" },
        createElement(AccordionTrigger, { xstyle: spacing }, "Settings"),
      ),
    ),
  );
  assert.match(html, /<h\d\b[^>]*><button\b/);
  assert.match(html, /<button\b[^>]*consumer-spacing/);
});

test("text and table parts forward their own style extensions", () => {
  assert.match(
    renderToStaticMarkup(createElement(Label, { xstyle: placement }, "Name")),
    /consumer-placement/,
  );
  const html = renderToStaticMarkup(
    createElement(
      Table,
      null,
      createElement(
        TableBody,
        null,
        createElement(TableRow, null, createElement(TableCell, { xstyle: spacing }, "Value")),
      ),
    ),
  );
  assert.match(html, /<td\b[^>]*class="[^"]*consumer-spacing/);
});

test("accordion content styles its children while panel props stay outside", () => {
  const html = renderToStaticMarkup(
    createElement(
      Accordion,
      { defaultValue: ["one"] },
      createElement(
        AccordionItem,
        { value: "one" },
        createElement(AccordionContent, { xstyle: placement, id: "panel" }, "Panel body"),
      ),
    ),
  );
  assert.match(
    html,
    /<div[^>]*id="panel"[^>]*><div[^>]*class="[^"]*consumer-placement[^>]*>Panel body<\/div>/,
  );
  assert.doesNotMatch(html, /\bxstyle=/i);
});

test("composite inputs apply placement to their outer box", () => {
  const native = renderToStaticMarkup(createElement(NativeSelect, { xstyle: placement }));
  assert.match(native, /^<span[^>]*consumer-placement/);
  assert.doesNotMatch(native, /<select[^>]*consumer-placement/);
  const combo = renderToStaticMarkup(
    createElement(Combobox, null, createElement(ComboboxInput, { xstyle: placement })),
  );
  assert.match(combo, /<div[^>]*consumer-placement/);
  assert.doesNotMatch(combo, /<input[^>]*consumer-placement/);
});

test("banner content and table container extensions do not leak into DOM attributes", () => {
  const banner = renderToStaticMarkup(
    createElement(Banner, null, createElement(BannerContent, { xstyle: placement }, "Notice")),
  );
  assert.match(banner, /<div[^>]*consumer-placement[^>]*>Notice<\/div>/);
  const table = renderToStaticMarkup(
    createElement(TableContainer, { xstyle: placement }, createElement(Table, { xstyle: spacing })),
  );
  assert.match(table, /^<div[^>]*consumer-placement/);
  assert.match(table, /<table[^>]*consumer-spacing/);
  assert.doesNotMatch(banner + table, /\b(?:contentXstyle|containerXstyle)=/i);
});
