# @bolerish/json-render

Initial official bolerish catalog and React mappings for json-render 0.23.1.
Requires React/React DOM ^19.2.3 and @bolerish/ui ^1.0.1.

Import `@bolerish/ui/global.css` once. No consumer StyleX compiler is required.

```tsx
import { bolerishRegistry } from "@bolerish/json-render";
import { parseBolerishSpec } from "@bolerish/json-render/catalog";
import { createStateStore } from "@json-render/core";
import { JSONUIProvider, Renderer } from "@json-render/react";

const store = createStateStore({ name: "" });
const spec = parseBolerishSpec(
  {
    root: "name",
    elements: {
      name: {
        type: "Input",
        props: {
          label: "Name",
          value: { $bindState: "/name" },
        },
      },
    },
  },
  store.getSnapshot(),
);

// Retain the store for the lifetime of this provider session.
<JSONUIProvider registry={bolerishRegistry} store={store}>
  <Renderer spec={spec} registry={bolerishRegistry} />
</JSONUIProvider>;
```

The server-safe `/catalog` entry exports `bolerishComponentDefinitions`,
`bolerishCatalog`, and `parseBolerishSpec`. The root exports `bolerishComponents`
and `bolerishRegistry`. Apps can declare their own catalog actions while reusing
`bolerishComponents` with json-render's `defineRegistry`.

Supports Card, FieldGroup, Heading, Paragraph, Input, Switch and Button.
The parser accepts a single tree (200 elements, depth 30), literal props,
`$state` reads, and `$bindState` on Input.value/Switch.checked. Events accept
`{ action: 'appHandler' }`: Input change/blur, Switch change, Button press.
Conditional/repeated elements, named slots and arbitrary styles/code are excluded.
The parser validates initial resolved values; apps must keep subsequent state
values compatible with the catalog and validate action names. Restart the provider
session when replacing the spec. This subset is a compatibility contract, not a
claim to accept every json-render specification.

Apps own business validation, permissions, async operations, duplicate-request
guards, state storage and error recovery. Bind Input.error to an app error string
and Button.pending to an app pending boolean. Input and Switch include accessible
labels/descriptions. Button.pending disables activation and displays a spinner.
Never put secrets in UI state. Specification validation does not grant action
execution permission. The adapter does not provide persistence or AI generation.
