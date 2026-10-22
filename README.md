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
those dependencies and imports with `@bolerish/*`, install `@bolerish/ui@0.11.1`,
and load `@bolerish/ui/global.css` once. Use the precompiled theme classes above
instead of adding a StyleX compiler solely for built-in components.

Message, Bubble, and outgoing-message color tokens have been removed. Replace
those usages with conversation layouts owned by your app. Use `Paragraph` from
`@bolerish/ui/paragraph` for body, description, and caption text; `P` and `PProps`
remain compatibility aliases. `Heading` requires `level={1}` through `level={6}`,
independently of its visual `size`.

For locally copied components, a package upgrade does not replace source files.
Keep local imports and merge updated components and tokens together. The CLI is
now `bolerish`; run `bolerish init --force` to migrate configuration to
`.bolerish.json` and the installed schema. Existing `.nuee.json` and `nuee.json`
remain readable. Rename runtime `--nuee-*` variables to `--bolerish-*` and
`data-nuee-motion` to `data-bolerish-motion`; the old runtime names are no longer
read. JSON settings apply to the optional source-copy path, not precompiled
package themes.

See [the v0.11.0 release notes](CHANGELOG.md#version-v0110) for the full changes.

## Optional source ownership

Use the CLI only when you want editable local component source:

```sh
pnpm dlx @bolerish/ui init --vite
pnpm dlx @bolerish/ui add button
```

This path configures StyleX and copies components into your project. Import copied
components from your configured local alias instead of the package. Package
updates do not replace copied or manually edited files; merge those changes
explicitly. The following configuration applies to this source-copy path only.

### Generated appearance defaults

`.bolerish.json` can configure initial appearance without editing each component:

`init` links `./node_modules/@bolerish/ui/configuration_schema.json` with `$schema`
for editor completions and validation. Install `@bolerish/ui` in the project to resolve
the schema, even when running the CLI with `bunx`. No separate schema file is generated. The CLI reads `.bolerish.json` first, then
`.nuee.json` and `nuee.json`. Run `bolerish init --force` to write the new name and
schema while preserving configuration; legacy files remain untouched. An old
`.nuee.schema.json` can then be removed.

```json
{
  "theme": {
    "density": "compact",
    "unit": "rem",
    "motion": "system",
    "fonts": { "body": "system-ui", "heading": "Georgia, serif" }
  }
}
```

Keep the existing aliases and other configuration fields. After editing the
configuration, run `bolerish init --force`. Import the generated `preferences.css`
from your CSS entry (Vite initialization adds the import), and apply
`stylex.props(...themeStyles)` from `settings.stylex.ts` to the app root. Put the
styles on `html` when overlays portal to `body`. Compact density keeps 24px icon
controls, touch targets and focus strokes independent of the scale.

Generated files group shared styles by responsibility:

```text
src/styles/
  tokens/                 # color-palette, semantic, themes, density
  control-layout.ts       # shared control placement types, copied when needed
  settings.stylex.ts
  preferences.css
  reset.css
```

`aliases.styles` points to `styles`, and token imports use its `tokens` child.
Existing flat token files remain usable. Run `bolerish init --force` to copy them
into `tokens` without deleting the originals or overwriting customized tokens.

JSON is an installation default, not a live user-settings store. Runtime font
choices override `--bolerish-font-body` and `--bolerish-font-heading` on the root; removing
an override restores the generated default. Fonts are CSS family lists; @bolerish/ui
does not download font files. JSON accepts `system` or `off` as the app default.
Set `data-bolerish-motion="system"`, `"on"` or `"off"` on `html` for the app end
user's runtime choice. `system` follows OS reduced motion; `off` suppresses
animation, transitions and smooth scrolling. Only an explicit end-user `on`
choice overrides OS reduction. The app owns the settings UI and persistence;
do not set `on` automatically from a developer default.
App-controlled View Transitions and JavaScript scrolling must use the same
resolved preference. Generated `MotionPreference` and `motionDefault` provide
the runtime type and initial default. Remove the attribute to restore JSON's
default; selecting `system` explicitly follows the OS even if JSON uses `off`.
Package consumers can import `MotionPreference` from `@bolerish/ui` and load
`@bolerish/ui/global.css`. Existing copied components need the updated motion
selectors from `add --force`, or a manual merge if their source was edited.

Existing aliases, accessibility settings and edited source files are retained.
Unedited generated settings files can refresh when JSON changes. If you edited
those files, merge the new defaults yourself. Older
`accessibility.respectReducedMotion` configurations remain readable, but the field is deprecated and no longer
removes reduced-motion rules from copied components. Do not use `respectReducedMotion: false` to turn motion off.

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

Typography tokens are exported as `typo`. The existing `typographyVars` name remains a compatibility export of the same variable group; do not apply two separate themes. `spacingRoleVars` provides purpose-based spacing. Configure `theme.unit` as `rem` (default) or `px`, and `theme.density` as `default`, `compact`, or a positive number up to 2. Pixel mode uses 1rem=16px and does not follow root font-size preferences.
