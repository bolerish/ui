import { defineCatalog, resolveElementProps } from "@json-render/core";
import type { StateModel } from "@json-render/core";
import { schema } from "@json-render/react/schema";
import { z } from "zod";

export const bolerishComponentDefinitions = {
  Card: {
    props: z.strictObject({ title: z.string(), description: z.string().optional() }),
    slots: ["default"],
    description: "A titled panel containing related content.",
  },
  FieldGroup: {
    props: z.strictObject({}),
    slots: ["default"],
    description: "A vertical group of fields and actions.",
  },
  Heading: {
    props: z.strictObject({
      text: z.string(),
      level: z.union([
        z.literal(1),
        z.literal(2),
        z.literal(3),
        z.literal(4),
        z.literal(5),
        z.literal(6),
      ]),
    }),
    description: "A semantic heading. Choose its level from the document hierarchy.",
  },
  Paragraph: {
    props: z.strictObject({ text: z.string() }),
    description: "Body text, including application status messages.",
  },
  Input: {
    props: z.strictObject({
      label: z.string().min(1),
      value: z.string(),
      type: z.enum(["text", "email"]).optional(),
      description: z.string().optional(),
      error: z.string().optional(),
      disabled: z.boolean().optional(),
    }),
    description:
      "A labelled text field. Bind value with $bindState. The app supplies validation errors. Emits change and blur.",
  },
  Switch: {
    props: z.strictObject({
      label: z.string().min(1),
      checked: z.boolean(),
      description: z.string().optional(),
      disabled: z.boolean().optional(),
    }),
    description:
      "An immediate on/off setting. Bind checked with $bindState. Emits change after updating state.",
  },
  Button: {
    props: z.strictObject({
      label: z.string().min(1),
      variant: z.enum(["primary", "secondary", "outline", "ghost", "destructive"]).optional(),
      disabled: z.boolean().optional(),
      pending: z.boolean().optional(),
    }),
    description:
      "An action button emitting press. pending disables activation and displays a spinner; the app must also guard duplicate requests.",
  },
};

export const bolerishCatalog = defineCatalog(schema, {
  components: bolerishComponentDefinitions,
  actions: {},
});

const statePath = z
  .string()
  .refine(
    (path) =>
      !path.split("/").some((part) => ["__proto__", "prototype", "constructor"].includes(part)),
    "Unsafe state path",
  )
  .regex(/^\/(?:[^/~]+(?:~[01][^/~]*)*)(?:\/(?:[^/~]+(?:~[01][^/~]*)*))*$/);
const expression = z.union([
  z.strictObject({ $state: statePath }),
  z.strictObject({ $bindState: statePath }),
]);
const action = z.strictObject({ action: z.string().min(1) });
const elementSchema = z.strictObject({
  type: z.enum(["Card", "FieldGroup", "Heading", "Paragraph", "Input", "Switch", "Button"]),
  props: z.record(z.string(), z.unknown()),
  children: z.array(z.string()).optional(),
  on: z.partialRecord(z.enum(["press", "change", "blur"]), action).optional(),
});
const specSchema = z.strictObject({
  root: z.string().min(1),
  elements: z.record(z.string(), elementSchema),
});

/** Parse the initial, single-tree subset. App state and action handlers remain app-owned. */
export function parseBolerishSpec(input: unknown, state: StateModel) {
  const spec = specSchema.parse(input);
  const keys = Object.keys(spec.elements);
  if (keys.length > 200) throw new Error("Use at most 200 elements.");
  for (const element of Object.values(spec.elements)) {
    const definition = bolerishComponentDefinitions[element.type];
    const shape = Object.fromEntries(
      Object.entries(definition.props.shape).map(([key, value]) => [
        key,
        z.union([value, expression]),
      ]),
    );
    z.strictObject(shape).parse(element.props);
    definition.props.parse(resolveElementProps(element.props, { stateModel: state }));
    for (const [key, value] of Object.entries(element.props)) {
      if (
        typeof value === "object" &&
        value !== null &&
        "$bindState" in value &&
        !(
          (element.type === "Input" && key === "value") ||
          (element.type === "Switch" && key === "checked")
        )
      ) {
        throw new Error("Only Input.value and Switch.checked support write bindings.");
      }
    }
    if (
      (element.children?.length ?? 0) > 0 &&
      element.type !== "Card" &&
      element.type !== "FieldGroup"
    ) {
      throw new Error(`${element.type} does not accept children.`);
    }
    for (const event of Object.keys(element.on ?? {})) {
      const allowed =
        element.type === "Button"
          ? ["press"]
          : element.type === "Input"
            ? ["change", "blur"]
            : element.type === "Switch"
              ? ["change"]
              : [];
      if (!allowed.includes(event)) throw new Error(`${element.type} does not emit ${event}.`);
    }
  }
  const visited = new Set<string>();
  function visit(key: string, depth: number) {
    if (depth > 30) throw new Error("Use at most 30 levels.");
    if (visited.has(key))
      throw new Error("Elements must form a tree without cycles or shared children.");
    if (!Object.hasOwn(spec.elements, key)) throw new Error(`Missing element: ${key}`);
    visited.add(key);
    for (const child of spec.elements[key].children ?? []) visit(child, depth + 1);
  }
  visit(spec.root, 0);
  if (visited.size !== keys.length) throw new Error("Remove elements outside the root tree.");
  return spec;
}
