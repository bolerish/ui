# @bolerish/ui

## 2.1.0

### Minor Changes

- Add composable Sidebar navigation with independent desktop and mobile state, mobile Dialog, collapse modes and link rendering.

  Use 32px desktop menu rows, 16px icons and a 48px icon rail, with 44px mobile targets and distinct 28px submenu rows.

  The provider fills its parent height; consumers choose viewport sizing. Desktop collapse uses motion preferences, and menu content scrolls without a visible scrollbar.

  Support render composition on SidebarGroupLabel and custom or hidden CollapsibleTrigger indicators.

  Add SidebarGroupTrigger with a default rotating indicator and accessible collapsible content. SidebarGroup defaults to open so plain label/content groups remain visible, and supports controlled state and render composition.

### Patch Changes

- @bolerish/tokens@2.1.0

## 2.0.0

### Major Changes

- 0f3d2b0: CarouselContent now creates its viewport internally. Remove CarouselViewport wrappers and imports; place CarouselItem children directly inside CarouselContent. CarouselContent props and styles continue to target the moving slide track. CarouselViewport is no longer exported. Move any custom viewport styling to an app-owned wrapper as appropriate.

  Carousel controls now center using their rendered dimensions in horizontal and vertical layouts.

### Patch Changes

- 78dc2ec: Apply vertical padding and spacing at the Card root so content-only cards receive consistent insets. CardFooter now has a top border, rounded bottom corners and vertical padding; its previous flex alignment is removed. Consumers that need a footer action layout should supply their own layout styles.
- 9b0e2bf: Allow DropdownMenuRadioItem to render a custom selected indicator through its optional indicator prop. The default dot remains unchanged; no migration is required.
- 437265f: Open DatePicker calendars at the selected date’s month for controlled and uncontrolled values, including when reopening after selection. No API changes or migration are required.
- @bolerish/tokens@2.0.0

## 1.0.1

### Patch Changes

- b5c9d3d: Use the Phosphor SSR entry point for built-in icons to remove their React Context dependency. Built-in icons no longer inherit Phosphor IconContext defaults; pass icon properties explicitly for custom icons.
- @bolerish/tokens@1.0.1

## 1.0.0

### Major Changes

- 280dc06: Remove the public Surface API, both solid and glass modes, and Card material variants. Panels now use opaque semantic backgrounds. Dialog, AlertDialog and Drawer backdrops use a gray overlay with subtle blur independently of any surface setting; reduced transparency and forced colors disable that blur.

  Remove imports from `@bolerish/ui/surface`, root `surface`/`SurfaceOptions`/`SurfaceProps` imports, `surface.props()` calls, `data-bolerish-surface` attributes and saved surface mode settings. Remove `variant="default"` and `variant="translucent"` from Card. Keep semantic background roles such as `bgSurface`; they continue to support app composition and theming.

  The earlier Liquid API and its refraction assets are also removed. Remove `@bolerish/ui/liquid` imports and liquid data attributes; use ordinary opaque components with app-owned backgrounds.

### Patch Changes

- 41f6ac3: Use a compact caret icon for CollapsibleTrigger and add vertical padding to CollapsibleContent. Existing props remain compatible; layouts that add content padding can adjust it through the existing styling props.
- 3a14f52: Give DrawerContent default panel padding and scrolling in every direction without doubling DrawerHeader or DrawerFooter insets. Its styling props still target the inner content. Custom layouts that previously added their own padding can override or remove the default through the existing styling props.

  Keep Calendar range interiors visible with the semantic selected background during hover and keyboard focus, while retaining stronger range endpoints.
- f2a9ba4: Refine control, content, popup and selection shapes and spacing. Improve task-title line height and active form boundaries while preserving props and keyboard interactions. Review fixed-size layouts; no prop migration is required.
- 89a32bc: Replace the Snackbar dot with a distinct bell, check, warning, error or information icon for each tone. Icons remain decorative so message text is announced once. Existing props remain compatible and require no migration.
- 5a7219d: Give destructive buttons a soft red background with bright red text, a transparent border, and stronger red background layers on hover and press. Disabled and keyboard focus behavior are preserved.
- 05fcfaf: Include a package README linking to official documentation and the existing agent workflow, with installed-version and declaration precedence guidance. No API changes or migration are required.
- Updated dependencies [547ee4a]
- Updated dependencies [f2a9ba4]
- Updated dependencies [05b0ed6]
- Updated dependencies [5a7219d]
- Updated dependencies [09caebb]
  - @bolerish/tokens@1.0.0

## 0.18.1

### Patch Changes

- 4861414: Keep Liquid Drawer surfaces from sampling their own dark backdrop. Visible overlays now dim only the area outside the Drawer while preserving outside-click dismissal, keyboard recovery and all four directions. Transparent/absent overlays, Solid mode, reduced transparency and forced-color fallbacks retain their behavior. No API migration is required.
- 5b19216: Refine Liquid surfaces with restrained stationary directional sheen, quieter structural edges and close contact shadows. Increase neutral tint to reduce background-text interference, and soften sheen on small controls. Text, geometry, focus/error states and browser-specific refraction fallbacks retain their existing behavior. No API migration is required.
- 0b7d330: Keep Liquid blur, tint and reflections visible in Safari and Firefox when SVG backdrop reference filters cannot render. CSS engine-feature gates select a brightness identity filter for those engines instead of the SVG reference; these gates are a compatibility fallback, not a direct SVG-rendering capability test. Chromium retains its SVG refraction enhancement.

  Support prefixed WebKit backdrop filtering across shared surfaces and Drawer dimming. Solid mode, reduced-transparency preferences and forced colors retain their opaque fallbacks. No API migration is required; browsers without color mixing still use opaque surfaces.
- 5d2a266: Keep Liquid Dialog and AlertDialog panels from sampling their own dimmed backdrop, matching Drawer. Share modal dimming so only the last mounted modal paints the outside scrim, including during closing transitions. Solid mode, reduced transparency, forced colors and browsers without the required CSS support retain the existing backdrop path. No API migration is required.

  Nested Liquid modals keep the outside dimming steady during entry and exit. Their transform motion remains; panel opacity stays stable while it owns the scrim.
- @bolerish/tokens@0.18.1

## 0.18.0

### Minor Changes

- Add Snackbar as the canonical compact notification, with open/defaultOpen/onOpenChange and duration (3000ms by default; 0 disables auto-dismiss). StatusPill remains a deprecated compatibility wrapper with persistent inline defaults; migrate visible to open and pass onOpenChange for controlled auto-dismiss.

  Add a calendar icon to DatePicker and match the calendar popup to its trigger width within viewport constraints. Calendar keeps its normal default width but can shrink to fit.

  Add Carousel orientation and controlsPlacement props. Vertical carousels use up/down arrows and require a defined height; orientation takes precedence over options.axis. Previous/Next continue to accept Button variants, including ghost for arrow-only controls. Existing horizontal defaults remain unchanged.

  Reduce Tooltip hover delay from the upstream 600ms default to 150ms. Provider and trigger delay overrides remain supported, with the trigger taking precedence.

  Snackbar supports semantic tones, visibility fades and a decorative color echo, with reduced-motion support. Position accepts all six top/bottom and left/center/right placements: default bottom-center, 24px desktop and 16px small-screen gaps plus safe-area insets. Small screens center horizontally; offset overrides the gap (numbers use px). Use position={null} for inline layout. Positioned notifications do not move focus.

  Apply the OTP input surface to InputOTPGroup instead of the outer InputOTP layout container. Backgrounds now stop at the actual digit group and do not fill unused row space or separators. Slots share the group's background; input behavior, borders and focus indicators are unchanged. Custom compositions should wrap slots in InputOTPGroup to receive the default surface.
  Separate decorative liquid-surface borders from optical reflections. Card and floating-surface edges retain their width and geometry but use a lighter structural outline, with a restrained upper highlight and lower shadow instead of two bright rims. Solid surfaces, semantic focus/error/selection borders, forced colors, reduced transparency and unsupported-filter fallbacks retain their boundaries. Dark liquid panels use a denser tint to preserve secondary-text contrast. No migration is required.

  Reduce liquid blur and tint opacity to preserve background detail, including a subtle inner reflection on Liquid itself. Existing surface APIs remain compatible.
  Fill the complete rectangular Menubar trigger area on hover and while open, including its corners. The enclosing menubar retains its rounded frame; keyboard focus and disabled behavior are unchanged.
  Use the same fast 120ms transition for small trigger-driven popups: Tooltip, HoverCard, Popover, Select, Combobox and DropdownMenu. HoverCard now shares Tooltip's 150ms default hover delay; explicit delay overrides are preserved. Click-triggered controls continue to open immediately and reduced-motion preferences remain respected.
  Render the segmented Tabs selection directly on the active trigger so its initial appearance does not depend on client-side indicator measurements. Selection, keyboard behavior and props remain unchanged. The segmented indicator no longer animates between triggers.
  Keep standalone Toggle borders on the same outer edge when pressed. Remove group-only inset selection borders and decorative wrappers; soft toggles use their own subtle background. All variants render a single button again, preserving refs and styling targets. ToggleGroup framing remains unchanged.

  Soft Toggle selection uses the same interactionSelected background as ToggleGroupItem. Standalone Toggle remains a single button in every variant, with no new wrapper or migration.

  Raise the light Liquid panel tint to 52% so supporting text retains WCAG AA contrast over colored backing surfaces. Existing surface APIs remain unchanged.

### Patch Changes

- @bolerish/tokens@0.18.0

## 0.17.0

### Minor Changes

- 85aca70: Select the built-in light or dark theme with `data-bolerish-theme="light"` or
  `data-bolerish-theme="dark"` on `html` after loading the package CSS. The attribute
  applies color and shadow tokens, document colors and font, and `color-scheme`
  without importing JavaScript or configuring a StyleX compiler.

  Compiled StyleX themes on the same element take precedence over the attribute's
  built-in token values. Precompiled variable definitions now use StyleX's variable
  layer so consumer themes can override them. Existing `themeClassNames` imports remain supported; no
  migration is required. Apps can switch the attribute instead of replacing theme
  classes, preserving unrelated document classes.

### Patch Changes

- @bolerish/tokens@0.17.0

## 0.16.0

### Minor Changes

- f18d2da: Add `Liquid` and `LiquidProps` through the root and `@bolerish/ui/liquid` entry points.
  In Liquid mode, the component refracts an explicitly supplied decorative
  `background` while foreground children remain sharp and interactive. It does not
  capture the page or require a new runtime dependency. Solid mode, reduced
  transparency and forced colors retain an opaque surface. Large surfaces and
  unsupported canvas environments keep the material without refraction.

  The unreleased Glass name and subpath are replaced by Liquid without aliases.
  For existing components, the global surface setting is sufficient: a packaged
  SVG adds gentle live-backdrop refraction in Chromium while Safari and Firefox
  retain blur. No Provider, per-component wrapper or runtime registration is
  needed. The shared map is fixed and stretched rather than fitted per element.
  CSS bundlers must retain or emit the referenced SVG asset; Solid and accessibility
  fallbacks disable the filter.
- 5827df0: Add `surface.props({ mode: "solid" | "liquid" })` through the root and
  `@bolerish/ui/surface` entry points. It returns only `data-bolerish-surface`,
  preserving independently composed `className` and `style` props. Apply it to
  `html` to include portaled surfaces; existing data attributes remain supported.
  The helper requires no Provider, wrapper or consumer StyleX compiler and does
  not capture page content. Unsupported modes throw `TypeError`.

### Patch Changes

- 9bb676b: Make Liquid panels, controls and floating surfaces more transparent, with less
  blur, no inset reflections or gloss, and shallower floating shadows. Liquid also
  uses a more transparent fill without an inset highlight. Existing components inherit the adjustment
  through `data-bolerish-surface="liquid"`; no component API changes are required.
  Solid surfaces and reduced-transparency and forced-colors fallbacks retain their
  existing behavior. Review text contrast when using custom backgrounds.

  Use the same more transparent, lower-blur material across portaled popovers,
  menus, selection lists, tooltips, hover cards, date pickers and notifications,
  as well as modal surfaces. Foreground content keeps its full opacity.
- @bolerish/tokens@0.16.0

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
