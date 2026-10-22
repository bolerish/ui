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
