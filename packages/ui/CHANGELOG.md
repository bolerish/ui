# @bolerish/ui

## 0.14.0

### Minor Changes

- 8101da7: Select a shared surface treatment with `data-bolerish-surface="solid"` or
  `"liquid"` on `html` or a containing element. Panels, resting controls and
  floating surfaces use role-specific transparency, blur and highlights while
  component variants and semantic state colors remain independent. Apply the
  attribute to `html` for portaled content; a nested `solid` scope can opt out.

  Omitting the attribute preserves the existing appearance, including
  `Card variant="translucent"`. Reduced transparency, forced colors and browsers
  without the required CSS features retain solid fallbacks.
- 25bf1ce: Rename ContentRow to Item throughout the public API. Import from
  `@bolerish/ui/item` and use `Item`, `ItemGroup`, `ItemMedia`, `ItemContent`,
  `ItemTitle`, `ItemDescription`, `ItemActions` and the corresponding Item types.
  The former `content-row` entry point and all ContentRow exports are removed;
  no compatibility aliases remain. Layout and interaction behavior are unchanged.

### Patch Changes

- @bolerish/tokens@0.14.0

## 0.13.0

### Minor Changes

- 67a2652: Replace Button's `icon-xs`, `icon-sm`, `icon-md`, `icon-lg`, and `icon-xl`
  sizes with `size="icon"`. Migrate every removed size to `icon`, which uses
  36px square controls at the default density. Keep visual choices such as
  `variant="ghost"` separate from size. Built-in Carousel controls also use this
  size and remain vertically centered.

  Add `gradient.props({ colors: [accent, glow] }, ...styles)` and the
  `GradientOptions` and `GradientProps` types, available from both `@bolerish/ui`
  and `@bolerish/ui/gradient`. Spread the result onto an existing element, including
  `body`, without introducing a wrapper. The first color supplies the upper-left
  accent and the second the upper-right glow; the background fades into the current
  canvas color. Consumer StyleX styles are composed last, preserving their dynamic
  variables. Supply exactly two non-empty CSS color strings. Reduced transparency,
  forced colors and browsers without the required color mixing use a solid
  background. No image color extraction or automatic text contrast is provided.

  Remove extra Calendar cell padding and inline baseline space so week rows keep
  the intended height. Soften DropdownMenu separators to match the shared default
  separator color. Joined ButtonGroup, ToggleGroup and Input OTP borders now
  derive their overlap from the stroke token instead of a fixed negative pixel.

  Keep existing exported JavaScript, CSS and declaration files available while
  rebuilding the package, reducing intermittent missing-import failures in running
  development servers. Tests remain excluded from the published build.

  Use the installed `@bolerish/ui` package and its compiled CSS for component
  updates. The source-copy CLI, registry and JSON schema have been removed from
  the repository's distribution workflow. Existing copied files remain yours to
  maintain; migrate component imports to `@bolerish/ui` and load the package
  stylesheet to receive updates. Set runtime density, unit, font and motion
  preferences on the application root. Basic precompiled usage does not require a
  StyleX compiler; custom StyleX extensions still do.

### Patch Changes

- Updated dependencies [67a2652]
- Updated dependencies
  - @bolerish/tokens@0.13.0
