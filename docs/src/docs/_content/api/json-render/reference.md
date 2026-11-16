# JSON Render

`@bolerish/json-render` provides an initial component catalog and React registry for json-render 0.23.1 and React 19.2.3 or later in React 19. You do not need to map each component yourself. This is the first validation step toward bolerish v2; it does not cover the entire component library.

## Installation and ownership

Install `@bolerish/json-render`, `@bolerish/ui`, `@json-render/core@0.23.1`, `@json-render/react@0.23.1`, React and React DOM. Follow the existing UI installation guide and import `@bolerish/ui/global.css` once. A consumer StyleX compiler is unnecessary.

Import `bolerishCatalog`, `bolerishComponentDefinitions` and `parseBolerishSpec` from `@bolerish/json-render/catalog`. This entry can run on the server. Import `bolerishRegistry` or `bolerishComponents` from the package root on the client. Use json-render's `JSONUIProvider` and `Renderer` directly. Apps can extend the catalog with their own actions and use the provided component mappings.

## Supported contract

The initial catalog supports Card, FieldGroup, Heading, Paragraph, Input, Switch and Button. Input and Switch include their labels and descriptions. Input accepts an app-owned error message. Button emits `press`; Input emits `change` and `blur`; Switch emits `change`.

`parseBolerishSpec(value, state)` checks one tree against the catalog, validates initial resolved props, and preserves event bindings. It supports literal props, `$state` reads, and `$bindState` writes on Input.value and Switch.checked. It rejects extra props, unknown components, missing references, cycles, shared children and unreachable elements. The initial limits are 200 elements and 30 levels. It excludes conditional/repeated elements, named slots, arbitrary CSS, HTML and executable code.

The app owns the state store and must keep resolved values compatible with the catalog. Check app action names before rendering. App handlers own business validation, permissions, request handling, duplicate-request protection and retry. JSON validation does not authorize an action. Keep secrets out of UI state. Parse specifications at the boundary and start a new provider session when applying a replacement.

## Edit and run

This example uses prepared JSON and a simulated local save. It does not call AI or persist data. Change a label, apply the JSON, enter an email and save. Use “Fail next save” to check recovery. Invalid JSON leaves the previous preview intact. Applying valid JSON resets the preview state.
