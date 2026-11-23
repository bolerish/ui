import assert from "node:assert/strict";
import { test } from "node:test";

import { bolerishCatalog, parseBolerishSpec } from "../dist/catalog.js";

const state = { name: "Ada", pending: false };
function input() {
  return {
    root: "input",
    elements: {
      input: {
        type: "Input",
        props: { label: "Name", value: { $bindState: "/name" } },
        on: { change: { action: "validate" } },
      },
    },
  };
}

test("server catalog describes components and parsing preserves app event/write bindings", () => {
  assert.match(bolerishCatalog.prompt(), /Input/);
  const spec = input();
  assert.deepEqual(parseBolerishSpec(spec, state), spec);
});

test("rejects wrong literal and initial state types, unsupported props and bindings", () => {
  for (const props of [
    { label: "Name", value: 12 },
    { label: "Name", value: "", dangerouslySetInnerHTML: { __html: "x" } },
    { label: "Name", value: { $bindState: "/missing" } },
    { label: "Name", value: { $bindState: "/pending" } },
    { label: { $bindState: "/name" }, value: "" },
    { label: "Name", value: { $bindState: "/__proto__/value" } },
  ])
    assert.throws(() =>
      parseBolerishSpec({ root: "x", elements: { x: { type: "Input", props } } }, state),
    );
});

test("rejects missing, cyclic, shared and unreachable tree elements and unsupported events", () => {
  const card = { type: "Card", props: { title: "Settings" }, children: ["root"] };
  assert.throws(() => parseBolerishSpec({ root: "root", elements: { root: card } }, state));
  assert.throws(() => parseBolerishSpec({ root: "missing", elements: {} }, state));
  assert.throws(() =>
    parseBolerishSpec(
      { root: "root", elements: { root: { ...card, children: ["missing"] } } },
      state,
    ),
  );
  const leaf = { type: "Paragraph", props: { text: "Hello" } };
  assert.throws(() =>
    parseBolerishSpec(
      { root: "root", elements: { root: { ...card, children: ["leaf", "leaf"] }, leaf } },
      state,
    ),
  );
  assert.throws(() => parseBolerishSpec({ root: "leaf", elements: { leaf, unused: leaf } }, state));
  assert.throws(() =>
    parseBolerishSpec(
      { root: "leaf", elements: { leaf: { ...leaf, on: { press: { action: "save" } } } } },
      state,
    ),
  );
  assert.throws(() =>
    parseBolerishSpec({ root: "leaf", elements: { leaf: { ...leaf, visible: true } } }, state),
  );
});

test("rejects unsupported leaf children and specification limits", () => {
  const leaf = { type: "Paragraph", props: { text: "Hello" } };
  assert.throws(() =>
    parseBolerishSpec(
      { root: "root", elements: { root: { ...leaf, children: ["child"] }, child: leaf } },
      state,
    ),
  );
  const elements: Record<string, unknown> = {};
  for (let index = 0; index < 32; index++)
    elements[String(index)] = {
      type: "FieldGroup",
      props: {},
      children: index < 31 ? [String(index + 1)] : [],
    };
  assert.throws(() => parseBolerishSpec({ root: "0", elements }, state), /30 levels/);
  for (let index = 32; index <= 200; index++) elements[String(index)] = leaf;
  assert.throws(() => parseBolerishSpec({ root: "0", elements }, state), /200 elements/);
});
