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

Use `strokeDefault` for decorative divisions, including menu separators. Use spacing and labels to distinguish action groups. Essential control boundaries use `strokeControl`; selection, error and focus retain dedicated tokens. A border alone does not guarantee sufficient contrast.

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

Decorative boundaries retain strokeDefault without additional fading. Essential control, selection, error and focus boundaries retain their dedicated tokens.

Solid is the default, including when the surface attribute is omitted. In Glass mode, menus, popovers, selection lists, dialogs, drawers, toasts and tooltips use 80% bgRaised and 24px backdrop blur with 1.6× saturation. Explicitly translucent Cards and Menubar use 72% bgSurface with the same blur. Ordinary Cards and input fields remain opaque. No refraction, sheen or inset reflection is added. Existing shadow tokens apply in both modes.

Reduced transparency, forced colors and unsupported effects use opaque fallbacks. Glass modals with a visible overlay also require :has(); otherwise they use an opaque panel and ordinary backdrop. Check actual composite backgrounds and custom themes. Decorative borders do not establish a 3:1 essential boundary.

Secondary buttons and grouped tabs/toggles retain bgSubtle. Semantic feedback, selection and disabled states preserve their roles. Progress tracks and scrollbar affordances keep their existing tokens. Background decoration does not change text opacity, focus or HTML state.
