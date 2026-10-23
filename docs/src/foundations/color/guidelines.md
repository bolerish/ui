# Color

Consistent color roles help people distinguish essential content, supporting text, and available actions. Semantic tokens let you compose light and dark screens using the same decisions.

## Selection guidelines

| Situation                          | Recommended choice        | Code                                   |
| ---------------------------------- | ------------------------- | -------------------------------------- |
| Outer page background              | `colorVars.bgCanvas`      | `backgroundColor: colorVars.bgCanvas`  |
| Content surface                    | `colorVars.bgSurface`     | `backgroundColor: colorVars.bgSurface` |
| Subtle separation                  | `colorVars.bgSubtle`      | `backgroundColor: colorVars.bgSubtle`  |
| Raised surface, such as a popup    | `colorVars.bgRaised`      | `backgroundColor: colorVars.bgRaised`  |
| Headings and essential content     | `colorVars.fgPrimary`     | `color: colorVars.fgPrimary`           |
| Supporting information             | `colorVars.fgSecondary`   | `color: colorVars.fgSecondary`         |
| Standard divider                   | `colorVars.strokeDefault` | `borderColor: colorVars.strokeDefault` |
| Boundary that must remain distinct | `colorVars.strokeControl` | `borderColor: colorVars.strokeControl` |

Pair strong action backgrounds with `fgOnActionPrimary` or `fgOnActionDestructive`. Pair feedback tokens such as `fgFeedbackError` with a specific explanation.

## Examples

### Apply roles to a settings panel

Use `bgSurface` for the panel, `fgPrimary` for its title, and `fgSecondary` for supporting text. When saving fails, add an error role and a recovery message. Giving both supporting text and the error a muted treatment hides what needs attention.

> Keep the same semantic token across light and dark modes. Semantic tokens do not guarantee contrast for every foreground and background combination. Test the actual pairing and communicate state through more than color.

## Hierarchy and boundaries

Use `fgPrimary` for essential content, `fgSecondary` for readable supporting text,
`fgTertiary` for low-priority supplementary marks, and `fgDisabled` only for unavailable
controls. Supporting descriptions are not disabled content.

Use `strokeDefault` for ordinary divisions and `strokeStrong` for a clearer separation
between action groups in menus. Dropdown Menu separators follow this rule. A strong border
is not a substitute for selection, error or focus, and does not guarantee sufficient contrast.

Follow the role composition contracts in [State](/docs/foundations/state)
for selection and drop backgrounds, foregrounds and borders. `bgSubtle` alone does not mean selected.

## Palette

Use cool near-black surfaces and monochrome Zinc primary actions. Light surfaces and essential control boundaries preserve contrast for reading and interaction.

| Role                  | Value   | Use                                |
| --------------------- | ------- | ---------------------------------- |
| Dark canvas           | #08090A | Lowest screen surface              |
| Dark content          | #0F1011 | Cards, inputs and default surfaces |
| Dark raised surface   | #161718 | Popups and subtle grouping         |
| Dark selected surface | #23252A | Selected surfaces                  |
| Dark supporting text  | #8A8F98 | Descriptions and metadata          |
| Light canvas          | #EEEEEE | Lowest light surface               |
| Light content         | #FFFFFF | Cards and inputs                   |
| Light grouping        | #F5F5F5 | Subtle groups                      |
| Light primary action  | #18181B | Dark button on a light surface     |
| Light primary label   | #FFFFFF | Light label on a dark button       |
| Dark primary action   | #E4E4E7 | Light button on a dark surface     |
| Dark primary label    | #18181B | Dark label on a light button       |
| Light primary hover   | #3F3F46 | Dark button hover                  |
| Dark primary hover    | #D4D4D8 | Light button hover                 |

Distinguish primary actions and current progress through monochrome contrast. Information, success, warning and error colors communicate their respective states.

Essential input boundaries use #81868F in light mode and #62666D in dark mode.
Decorative strokeDefault does not replace them. Dark selected boundaries use
#81868F via strokeStrong. Focus uses #383B3F in light and #8A8F98 in dark. Tested
text pairings target 4.5:1 and essential control/focus boundaries target 3:1.

## Palette authoring and generation

Author colors in OKLCH in `packages/tokens/palette.oklch.json`. Adjust lightness,
chroma and hue, then run `pnpm palette:generate` to emit literal HEX StyleX tokens.
Do not edit the palette values in generated `color-palette.stylex.ts` directly.
Solid colors use six-digit HEX; translucent colors use eight-digit HEX with
eight-bit alpha rounding. Generation rejects colors outside sRGB; reduce chroma
and review them again. `pnpm palette:check` checks generated values against the
source, and `pnpm test:tokens` checks conversion and contrast. Consumers receive
generated tokens without runtime OKLCH conversion.

## Content backgrounds and translucent surfaces

Use colors derived from content, such as album artwork, in an app-owned background gradient.
Do not remap action, error, or selection tokens to match the content. Keep existing semantic tokens for ordinary screens.

Use `Card` with `variant="translucent"` when its background should show through slightly.
Apply the gradient to the surrounding container. Translucent surfaces separate a reading area;
avoid repeating backdrop blur across the screen or behind long passages of text.
Adjust the surface background rather than the entire card's `opacity`, which would also fade text and controls.

For prose placed directly on the background, use a full-surface contrast veil to bound luminance.
Keep a readable foreground for prose, dates and song details rather than blurring surrounding text.
Reserve translucent surfaces for floating controls and use an opaque surface for editing.
Recheck contrast when changing veil strength, text colors or consumer themes.

Check body and secondary text contrast on light and dark backgrounds with the default themes.
Custom themes, text placed directly on images, and input or focus states need checks against their actual combinations.
See [Card](/docs/components/card) for the example and its scope.

## Soft surface boundaries

Decorative boundaries across components use `strokeDefault` directly: black at 6%
in light mode and white at 5% in dark mode. Do not reduce its opacity again.
Essential input, selection, error and focus boundaries keep their existing tokens.
Menus, popovers and selection lists use 94% `bgRaised`; Menubar and translucent
Card use 92% `bgSurface`, with a 16px backdrop blur. Dialog, Drawer, Toast,
ordinary Card and inputs remain opaque. Opaque surfaces are the fallback;
reduced transparency and forced colors remove the blur. Tooltip uses the same opaque bgRaised/fgPrimary colors as Popover.

Blend only the content background into `bgCanvas` toward its lower edge.
Do not mask or reduce opacity on the text, cards or controls themselves.

### Coverage across components

Secondary buttons and grouped tabs/toggles use `bgSubtle`; decorative boundaries
on cards, tables, accordions, attachments, empty states, timelines and badges
share `strokeDefault`. Essential input, checkbox, radio, switch and slider
boundaries remain distinct. Progress uses `bgSubtle` for its track; draggable
scrollbar thumbs use `strokeControl`. Dialogs, drawers, toasts and banners keep
opaque or semantic feedback surfaces. Layout-only components add no new surface.
Typography components, selection, error and focus styling remain unchanged.
This is a shared visual language, not a requirement to blur every component.

Resting form boundaries use strokeDefault; filled surfaces and labels identify fields. Focus and invalid outlines keep their dedicated tokens. strokeControl remains available for distinct affordances such as scrollbar thumbs.
