# @bolerish/eslint-plugin-ui

Foundations diagnostics for custom React UI, using the same rules in ESLint and
Oxlint. This is a private workspace package; it is not published to npm yet.
Use a workspace dependency (`"@bolerish/eslint-plugin-ui": "workspace:*"`) in this
monorepo, or pack it locally to try it in another app.

## Rules

| Rule                            | Foundation                                                                       | Suggested tokens                 |
| ------------------------------- | -------------------------------------------------------------------------------- | -------------------------------- |
| `bolerish-ui/color-tokens`      | [Color](../../docs/src/shared/ui/docs/foundations/color/guidelines.md)           | `colorVars`                      |
| `bolerish-ui/typography-tokens` | [Typography](../../docs/src/shared/ui/docs/foundations/typography/guidelines.md) | `typo`                           |
| `bolerish-ui/spacing-tokens`    | [Spacing](../../docs/src/shared/ui/docs/foundations/spacing/guidelines.md)       | `spacingRoleVars`, `spacingVars` |

The rules inspect literal values in imported `stylex.create()` calls and JSX
`style={{ ... }}` objects, including conditional values and nested StyleX states.
Aliases and shadowed imports are resolved through the linter's scope information.
Unrelated data objects are ignored. Diagnostics link the property to the relevant
Foundation and token group. Rules default to warnings and never autofix: a raw
color or gap does not reveal which semantic role the author intended.

Prefer shared tokens for reusable layout and type scales. The component contracts
also allow positive `em` font sizes relative to surrounding prose, positive
unitless line heights, and `em` margins/gaps relative to inline icons or text.
These are proportional relationships, not fixed layout sizes. Fixed `px`/`rem`
values, numeric layout gaps and raw colors are still reported. Padding has no
relative-unit allowance. Border overlaps use `calc(${sizeVars.stroke} * -1)`;
negative numeric margins are still reported. The allowed units per property are
included in the exported Foundations metadata.

Diagnostics describe the property and matching token family, for example:

> When setting fontSize, use typo.fontSize* tokens instead of the literal 13.

| When setting                                         | Use                                   |
| ---------------------------------------------------- | ------------------------------------- |
| `color`                                              | `colorVars.fg*`                       |
| `backgroundColor`                                    | `colorVars.bg*`                       |
| `borderColor`, `outlineColor`                        | `colorVars.stroke*`                   |
| `fontSize`, `fontWeight`, `lineHeight`, `fontFamily` | The corresponding `typo` token family |
| `gap`, `padding`, `margin` and their longhands       | `spacingRoleVars` or `spacingVars`    |

These are token-family recommendations; choose the semantic role for the actual
content and state. The rules do not select one exact token for you.

```tsx
// Warns: direct values bypass the shared scale and theme.
const styles = stylex.create({ panel: { color: "#333333", fontSize: 13, gap: 13 } });

// Passes: choose the role for this UI.
const styles = stylex.create({
  panel: {
    color: colorVars.fgPrimary,
    fontSize: typo.fontSizeSm,
    gap: spacingRoleVars.fieldGap,
  },
});
```

## ESLint

In an app that has a workspace or locally packed dependency installed:

```js
// eslint.config.js
import bolerishUi from "@bolerish/eslint-plugin-ui";

export default [
  {
    ...bolerishUi.configs.recommended,
    files: ["src/**/*.{js,jsx,ts,tsx}"],
  },
];
```

Configure your existing TypeScript/JSX parser separately. The plugin does not
install a parser or change your project's language settings.

Use `configs.color`, `configs.typography` or `configs.spacing` to enable one group.
Override any rule individually with `off`, `warn` or `error`:

```js
{
  ...bolerishUi.configs.recommended,
  rules: {
    ...bolerishUi.configs.recommended.rules,
    "bolerish-ui/spacing-tokens": "off",
  },
}
```

File overrides and [comment exceptions](#comment-exceptions) can narrow the scope.

## Oxlint

```json
{
  "jsPlugins": [{ "name": "bolerish-ui", "specifier": "@bolerish/eslint-plugin-ui" }],
  "rules": {
    "bolerish-ui/color-tokens": "warn",
    "bolerish-ui/typography-tokens": "warn",
    "bolerish-ui/spacing-tokens": "warn"
  }
}
```

Use regular Oxlint overrides and disable comments for exceptions. This repository
loads the local plugin and applies the rules to `packages/ui/src/**/*.tsx`.
Existing ESLint/Oxlint editor integrations can surface these diagnostics; no
separate editor extension is provided. The actual editor UI has not been tested.
ESLint 9.39 and Oxlint 1.80 are covered by executable JS and TSX tests. Oxlint's JS plugin API
is still alpha; future versions may require adjustments.

## Comment exceptions

Both ESLint and Oxlint honor the following `eslint-*` comments. Oxlint also accepts
its native `oxlint-*` prefix. These are handled by the engines; the plugin adds no
custom comment parser. Keep the rule ID to disable only the intended check, and
write the reason after `--`.

Disable the next diagnostic line, placing the comment directly above the value:

```js
const styles = stylex.create({
  icon: {
    // eslint-disable-next-line bolerish-ui/spacing-tokens -- optical adjustment for this asset
    marginInlineStart: -1,
  },
});
```

Disable the current line:

```js
const styles = stylex.create({ icon: { gap: 13 } }); // eslint-disable-line bolerish-ui/spacing-tokens -- custom asset spacing
```

Disable a region and restore the rule afterwards:

```js
/* eslint-disable bolerish-ui/spacing-tokens -- custom asset spacing */
const styles = stylex.create({ icon: { gap: 13 } });
/* eslint-enable bolerish-ui/spacing-tokens */
```

For a whole-file exception, put the `eslint-disable` block at the top and omit the
`eslint-enable` block. Multiple rule IDs can be comma-separated. Other enabled
rules still run. This requires inline comments to be allowed in the app's linter
configuration.

## Boundaries

- CSS files, class strings, style objects passed by reference and CommonJS imports
  are not analyzed in this first version. CSS shorthands such as `font`, `border`
  and `background` are also outside the property list.
- CSS-wide keywords, system colors, transparent/currentColor, zero spacing and
  CSS `var(...)` references are permitted. Expressions and identifiers are left
  to the app. Passing a variable does not prove it is a valid bolerish token.
- Width, height, role selection, contrast and accessibility need context and are
  not inferred. `letterSpacing` has no corresponding token and is not checked.
- Content-derived palettes and token/theme definitions should keep explicit
  file/rule exceptions instead of being replaced with UI tokens.
- Biome uses a separate plugin API; this ESLint plugin is not a Biome adapter.

## Shared knowledge for agents

`@bolerish/eslint-plugin-ui/foundations` exports the JSON used by the rules. Each
entry relates CSS properties, token-family recommendations, allowed keywords and a Foundation
page. A future agent skill can read this same metadata and the linked guidelines
instead of maintaining another copy. This is a small relationship catalog, not
an ontology engine, and it does not encode product-specific layout decisions.

## Development and distribution

Author the plugin and tests in TypeScript. `pnpm build` compiles `src/index.ts`
and the shared JSON to `dist/`, including declarations. Only `dist/`, this README
and package metadata are packed. Consumers load JavaScript and need no TS loader
or runtime dependencies. Node 22 or later is required; ESLint is an optional peer
for type-checking configurations that import the plugin; it is not imported
by the plugin at runtime.

The TypeScript-aware AST types are development dependencies only. The public
plugin/configuration types use ESLint's declarations; consumer fixtures check
that these are directly usable in a typed ESLint configuration.

The root `pnpm lint` builds the plugin before loading its compiled entry. After
editing plugin source, rebuild before expecting changes in an editor using the
local configuration. `pnpm typecheck` checks source, tests and compiled public
declarations; `pnpm test` also builds before executing the compiled plugin.
`pnpm pack` builds automatically before creating a local package.

## Verification

Run `pnpm --filter @bolerish/eslint-plugin-ui test`. Tests execute actual ESLint and
Oxlint engines, covering diagnostics, nested states, aliases, shadowing, unrelated
data, grouped settings and exceptions. They also cover local data inside dynamic
style functions, TypeScript import-equals, typed configuration compatibility and
loading a packed package outside the workspace with plain Node.

Official plugin APIs:
[ESLint](https://eslint.org/docs/latest/extend/plugins),
[Oxlint](https://oxc.rs/docs/guide/usage/linter/js-plugins.html),
[Biome](https://biomejs.dev/linter/plugins/).
