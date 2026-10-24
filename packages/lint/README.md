# @bolerish/lint

Foundations diagnostics for custom React UI in ESLint and Oxlint.
The new package name is prepared in the workspace and has not been published yet.
Replace old package imports and Oxlint specifiers when migrating; `bolerish-ui/*`
rule names and comment exceptions stay the same.

Install as a development dependency. Node 22+ is required.
The plugin has no runtime dependencies and works independently of the UI package.

## Setup

```sh
npm install --save-dev @bolerish/lint
pnpm add -D @bolerish/lint
yarn add --dev @bolerish/lint
bun add --dev @bolerish/lint
```

Configure ESLint or Oxlint below. TypeScript/JSX parser setup belongs to the app.
No StyleX compiler or UI runtime is required to load the rules.

## Rules

| Rule                            | Use when setting                                                 |
| ------------------------------- | ---------------------------------------------------------------- |
| `bolerish-ui/color-tokens`      | `colorVars` for text, background and border colors               |
| `bolerish-ui/typography-tokens` | `typo` for font size, weight, family and line height             |
| `bolerish-ui/spacing-tokens`    | `spacingRoleVars` or `spacingVars` for gaps, padding and margins |

Rules inspect literal values in imported `stylex.create()` and JSX inline
styles, including nested states and conditionals. Diagnostics name the matching
token family; they do not choose a semantic role or autofix values.

## ESLint

```js
import bolerishUi from "@bolerish/lint";

export default [
  {
    ...bolerishUi.configs.recommended,
    files: ["src/**/*.{js,jsx,ts,tsx}"],
  },
];
```

Configure the app's TypeScript/JSX parser separately. Use `configs.color`,
`configs.typography` or `configs.spacing` for one group. Override rule IDs with
`off`, `warn` or `error` for narrower scopes.

## Oxlint

```json
{
  "jsPlugins": [{ "name": "bolerish-ui", "specifier": "@bolerish/lint" }],
  "rules": {
    "bolerish-ui/color-tokens": "warn",
    "bolerish-ui/typography-tokens": "warn",
    "bolerish-ui/spacing-tokens": "warn"
  }
}
```

ESLint/Oxlint rule-specific disable comments work when inline comments are allowed:

```js
// eslint-disable-next-line bolerish-ui/spacing-tokens -- optical adjustment for this asset
const styles = stylex.create({ icon: { marginInlineStart: -1 } });
```

[The lint guide](https://ui.bolerish.com/docs/lint) covers configuration,
exceptions and inspection limits. Biome is not supported. Oxlint's JS plugin API
is alpha; compatibility is tested with ESLint 9.39 and Oxlint 1.80.

## Boundaries

CSS files, class strings, referenced objects, CommonJS and shorthand properties
are not analyzed. Variables/expressions do not prove token use. Positive relative
`em` typography/margins/gaps and unitless line heights are permitted; padding has
no relative-unit allowance. Width, height, contrast and semantic role need review.

`@bolerish/lint/foundations` exports the same property/token/allowed
value metadata used by the rules. Only `dist/`, this README and package metadata
are distributed. ESLint is an optional peer for configuration types.

## Development

```sh
pnpm --filter @bolerish/lint typecheck
pnpm --filter @bolerish/lint test
```

Source and tests live together in `src/`; distribution contracts live beside
`package.json`. Tests run the compiled plugin in actual ESLint/Oxlint engines and
check typed configurations and packed consumers. Rebuild after source edits
before expecting the local editor integration to use them.

The plugin's development compiler is pinned to TypeScript ~6.0.3 because
typescript-eslint 8.72 supports TypeScript <6.1. Revisit both together when
upgrading typescript-eslint. The compiled plugin does not import TypeScript at
runtime; this pin does not constrain consumer apps.
