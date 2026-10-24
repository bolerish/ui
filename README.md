# bolerish/ui

A design system built with React and StyleX. Install the package to use compiled
React components, CSS, and light/dark themes. Basic usage needs no StyleX build
plugin or generated source files. React 19 or later is required.

## Installation

```sh
pnpm add @bolerish/ui
```

Load the stylesheet once in your app's CSS entry:

```css
@import "@bolerish/ui";
```

The explicit `@bolerish/ui/global.css` path also remains available.
The stylesheet includes the reset, component styles, tokens, and both color themes.
Import it before app styles so intentional app overrides come afterwards.

## Usage

```tsx
import { Button } from "@bolerish/ui/button";

export function SaveButton() {
  return <Button>Save</Button>;
}
```

Root imports such as `import { Button } from "@bolerish/ui"` also work.

## Global surface treatment

After loading the stylesheet, set `data-bolerish-surface="solid"` or `"liquid"`
on `html`. Component variants and color themes remain independent. A nested
`solid` scope can opt out; portaled content follows the attribute on `html`.
Omitting the attribute preserves the previous appearance, including
`Card variant="translucent"`. No StyleX compiler is required for the attribute.
Reduced transparency, forced colors and unsupported CSS retain solid fallbacks.

```tsx
import type { ReactNode } from "react";

export function Document({ children }: { children: ReactNode }) {
  return (
    <html data-bolerish-surface="liquid">
      <body>{children}</body>
    </html>
  );
}
```

## Content-colored backgrounds

Apply a compiled gradient to an existing element; no wrapper or StyleX compiler
is required. Load the package stylesheet as described above.

```tsx
import { gradient } from "@bolerish/ui/gradient";

export function MusicBackground({ children }: { children: React.ReactNode }) {
  return <section {...gradient.props({ colors: ["#80414b", "#b49058"] })}>{children}</section>;
}
```

For StyleX consumers, pass the original styles:
`gradient.props({ colors }, styles.layout, styles.dynamic(value))`.
The helper calls `stylex.props()` once with its background first and consumer
styles last, so StyleX handles conflicts and dynamic variables. Do not pass an
already converted `stylex.props()` result or spread both results separately.
The gradient follows the active theme and uses a solid fallback for unsupported
color mixing, reduced transparency or forced colors. Chosen colors still require
a contrast check for text placed directly over them.

## Light and dark themes

The default theme is light. `themeClassNames` contains precompiled color and shadow
classes, including canvas, text, body font and `color-scheme`; applying them does
not require a StyleX compiler. Apply the chosen theme
to `html` so controls portaled to `body` inherit it too.

```tsx
import { themeClassNames } from "@bolerish/ui/theme";

export function Document({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={themeClassNames.dark}>
      <body>{children}</body>
    </html>
  );
}
```

Use `themeClassNames.light` for light mode. Your app owns the saved preference,
system preference detection, and initial theme; replace the previous theme's
classes when switching, while preserving unrelated root classes. For SSR, apply the initial theme before
hydration to avoid a flash of the wrong theme.

Components accept a string `className` and React `style` object for plain CSS,
CSS modules and inline overrides. These target the same element as `xstyle`;
CSS precedence follows the normal cascade. Preserve focus and state contrast
when overriding appearance.

StyleX remains available for typed `xstyle` extensions. If your app authors
`stylex.create()` styles or custom token themes, configure the StyleX compiler
for that app. This is optional for the prebuilt components and themes above.

## LLM guide

See [the @bolerish/ui usage guide for LLMs](docs/README.md#ai-coding-agent-references)
for package imports, theme setup, StyleX extensions, and exact component APIs.

## Upgrade to v0.11.0

Versions v0.9.1 and earlier used `@nuee/*`. For installed-package usage, replace
those dependencies and imports with `@bolerish/*`, install `@bolerish/ui@0.12.0`,
and load `@bolerish/ui/global.css` once. Use the precompiled theme classes above
instead of adding a StyleX compiler solely for built-in components.

Message, Bubble, and outgoing-message color tokens have been removed. Replace
those usages with conversation layouts owned by your app. Use `Paragraph` from
`@bolerish/ui/paragraph` for body, description, and caption text; `P` and `PProps`
remain compatibility aliases. `Heading` requires `level={1}` through `level={6}`,
independently of its visual `size`.

Previously copied components remain local files and are not updated by installing
the package. Import from `@bolerish/ui` to adopt the packaged components.
The source-copy CLI is no longer distributed. Existing copies remain yours to maintain.

## Runtime preferences

Set `--bolerish-density` on `html` to `1` (default) or `0.875` (compact).
Override `--bolerish-font-body` and `--bolerish-font-heading` with CSS font-family
lists; the package does not download fonts.

Set `data-bolerish-motion="system"`, `"on"` or `"off"` on `html`.
Without the attribute, motion follows the OS preference. Only an explicit end-user
`on` choice should override OS reduced motion. Your app owns settings and persistence,
including JavaScript scrolling and View Transitions. Import `MotionPreference`
from `@bolerish/ui` for typed settings.

### AI coding-agent entry points

The docs build generates `llms.txt`, Korean/English guidelines, per-component
`api/*.md` references and `agent/SKILL.md` from canonical documentation and source.
Start at the generated index, find the control, then compare its exact reference
with your installed local version. The generated skill catalog is available for
manual use; no plugin, marketplace or Context7 registration is performed.
See [the AI export workflow](docs/README.md#ai-coding-agent-references).

A representative inline search uses the supported local API:

```tsx
import { Combobox, ComboboxInput } from "@bolerish/ui/combobox";
import { Input } from "@bolerish/ui/input";

export function InlineControls() {
  return (
    <div>
      <Input variant="inline" aria-label="Bookmark title" />
      <Combobox>
        <ComboboxInput
          variant="inline"
          aria-label="Search"
          startAddon={
            <button type="button" aria-label="Search engine">
              Engine
            </button>
          }
          endAddon={<span>Shortcut</span>}
        />
      </Combobox>
    </div>
  );
}
```

Typography tokens are exported as `typo`. `typographyVars` remains a compatibility
export of the same variable group. `spacingRoleVars` provides purpose-based spacing.
For custom StyleX styles, import tokens from `@bolerish/tokens` and configure your
app's StyleX compiler.

## Foundations lint (workspace preview)

[`@bolerish/eslint-plugin-ui`](packages/eslint-plugin-ui/README.md) warns about direct
color, typography and spacing values in custom StyleX or JSX inline styles.
It includes ESLint and Oxlint configuration and focused exceptions. The package
is currently private and has not been published to npm. Its shared Foundations
metadata links rules to token groups and the corresponding guidance for agents.

## Releases

UI and tokens share a release version; the lint plugin has its own version.
Record package changes with `pnpm changeset`, inspect them with
`pnpm release:status`, and prepare versions with `pnpm version:packages`.
Publishing remains a separate, authenticated action. See the
[release guide](.changeset/README.md) for compatibility rules and the workflow.
Write release notes only in changeset files; package changelogs are generated.
The root [changelog](CHANGELOG.md) preserves historical releases.

## Development tooling ownership

- `packages/tokens/palette/`: authoring color conversion, palette generation and
  their tests. Root palette commands delegate to the token package.
- `packages/ui/scripts/build.ts`: compile UI modules, declarations and CSS.
- `docs/scripts/build-guidelines.ts`: generate documentation and agent references.
- `scripts/verify-packages.ts`: check both published packages' archives and
  exported declarations before a release. This cross-package check stays at root.

These are development/build tools, not application runtime imports. Tests stay
beside the code or package contract they verify.
