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

| Role                  | Value                             | Use                                |
| --------------------- | --------------------------------- | ---------------------------------- |
| Dark canvas           | oklch(13.89505% 0.002948 246.256) | Lowest screen surface              |
| Dark content          | oklch(17.2333% 0.002638 247.98)   | Cards, inputs and default surfaces |
| Dark raised surface   | oklch(20.39403% 0.002529 247.951) | Popups and subtle grouping         |
| Dark selected surface | oklch(26.44965% 0.009761 268.306) | Selected surfaces                  |
| Dark supporting text  | oklch(64.88123% 0.014593 262.359) | Descriptions and metadata          |
| Light canvas          | oklch(100% 0 0)                   | Lowest light surface               |
| Light content         | oklch(100% 0 0)                   | Cards and inputs                   |
| Light grouping        | oklch(96.74343% 0.001326 286.375) | Subtle groups                      |
| Light primary action  | oklch(21.03309% 0.00586 285.885)  | Dark button on a light surface     |
| Light primary label   | oklch(100% 0 0)                   | Light label on a dark button       |
| Dark primary action   | oklch(91.97285% 0.004031 286.32)  | Light button on a dark surface     |
| Dark primary label    | oklch(21.03309% 0.00586 285.885)  | Dark label on a light button       |
| Light primary hover   | oklch(37.03234% 0.01188 285.805)  | Dark button hover                  |
| Dark primary hover    | oklch(87.11079% 0.005451 286.286) | Light button hover                 |

Distinguish primary actions and current progress through monochrome contrast. Information, success, warning and error colors communicate their respective states.

Essential input boundaries use oklch(61.88292% 0.014771 262.356) in light mode and oklch(50.91762% 0.01212 261.768) in dark mode.
Decorative strokeDefault does not replace them. Dark selected boundaries use
oklch(61.88292% 0.014771 262.356) via strokeStrong. Focus uses oklch(35.09517% 0.008057 255.546) in light and oklch(64.88123% 0.014593 262.359) in dark. Tested
text pairings target 4.5:1 and essential control/focus boundaries target 3:1.

## Palette authoring and generation

Author colors in OKLCH in `packages/tokens/palette.oklch.json`. Adjust lightness,
chroma and hue, then run `pnpm palette:generate` to emit literal OKLCH StyleX tokens.
Do not edit the palette values in generated `color-palette.stylex.ts` directly.
Solid colors retain OKLCH coordinates; translucent colors include a percentage alpha.
Generation rejects colors outside sRGB; reduce chroma
and review them again. `pnpm palette:check` checks generated values against the
source, and `pnpm test:tokens` checks conversion and contrast. Consumers receive
generated tokens that browsers resolve without JavaScript color conversion.

## Content backgrounds

Use colors derived from content, such as album artwork, in an app-owned background gradient.
Do not remap action, error, or selection tokens to match the content. Keep existing semantic tokens for ordinary screens.

Apply the gradient to the surrounding container and keep cards opaque so text and controls remain readable.

For prose placed directly on the background, use a full-surface contrast veil to bound luminance.
Keep a readable foreground for prose, dates and song details rather than blurring surrounding text.
Use an opaque surface for reading and editing.
Recheck contrast when changing veil strength, text colors or consumer themes.

Check body and secondary text contrast on light and dark backgrounds with the default themes.
Custom themes, text placed directly on images, and input or focus states need checks against their actual combinations.
See [Card](/docs/components/card) for the example and its scope.

## Soft surface boundaries

Decorative boundaries retain strokeDefault without additional fading. Essential control, selection, error and focus boundaries retain their dedicated tokens.

Panels remain opaque. Modal backdrops use the gray overlay role with subtle blur; reduced transparency and forced colors disable the blur. Check contrast in custom themes.

Secondary buttons and grouped tabs/toggles retain bgSubtle. Semantic feedback, selection and disabled states preserve their roles. Progress tracks and scrollbar affordances keep their existing tokens. Background decoration does not change text opacity, focus or HTML state.

Information, success, warning and error feedback use 12% tinted fills with stronger semantic borders. Foregrounds use dark status colors in light mode and light status colors in dark mode; text contrast is checked at 4.5:1 on canvas, content, grouping and raised backgrounds. The light canvas is pure white; the dark canvas retains its existing dark color.

Destructive actions retain bright red text over a 12% red fill. This pairing does not guarantee 4.5:1 contrast for small text. Adjust the foreground in your theme when your product requires that target.
