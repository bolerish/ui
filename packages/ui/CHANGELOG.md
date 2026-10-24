# @bolerish/ui

## 0.15.0

### Minor Changes

- e8196f2: Require `aria-label` or `aria-labelledby` when Button size is `icon`, including through InputGroupButton. Add one of these names to existing icon-only callers; regular text button sizes are unchanged.
  
  Check the built-in Toast icon mapping exhaustively while preserving custom type strings. Unknown types, including inherited object-property names, render their text without a status icon.
- afca7c0: Add Input variants `none` and `underline`. Both retain the normal field sizing and
  text styles. `none` removes the resting border and fill while preserving visible
  keyboard focus and an error outline. `underline` limits the border and focused
  emphasis to the bottom edge, including a thicker-line fallback in forced colors.
  The default `outline` and typography-inheriting `inline` remain available.
- e8196f2: Refine Liquid surfaces with a bright edge, inner reflection and role-specific transparency while preserving the existing DOM and solid accessibility fallbacks.
  
  Keep notifications open when Escape belongs to an editing field. Unhandled Escape elsewhere still dismisses the newest notification. Add `Toaster.closeLabel` and `ComboboxInput.triggerLabel` for localized accessible names.
  
  Keep keyboard-highlighted options visible in forced-color modes across Select, Combobox and menus. Passing `null` to ComboboxInput addons now removes them; omit an addon to retain its default.

### Patch Changes

- e8196f2: Raise the Base UI minimum to 1.9 for valid Menubar portal ownership. Forward Slider accessible names to its native inputs and retain visible Calendar day numerals in accessible names. Default examples include explicit field/slot labels and matching Tabs panels; automated WCAG checks exercise resting and opened states.
- 16cb516: Reduce the default circular CarouselPrevious and CarouselNext buttons to 1.5rem
  (24px at the default root size), retaining their icon size, accessible names and
  vertical centering. Other icon buttons and carousel navigation behavior are unchanged.
- Keep Calendar months within narrow containers and let Pagination controls wrap
  without shrinking their labels or overflowing. Let Select and Combobox lists
  scroll within the popup's available height instead of clipping their final items.
  Keep dropdown menus and popovers within the available viewport height with
  scrollable content.
  Existing props remain unchanged.
- @bolerish/tokens@0.15.0

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
