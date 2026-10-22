# Spacing

Different gaps distinguish related information from separate tasks. Repeating the same spacing for the same relationship makes groups visible without adding borders everywhere.

## Selection guidelines

| Situation                    | Recommended choice             | Code                          |
| ---------------------------- | ------------------------------ | ----------------------------- |
| Icons and short labels       | `space1`, `space2`             | `gap: spacingVars.space2`     |
| Elements in one row or field | `space2`, `space3`             | `gap: spacingVars.space3`     |
| Related fields and rows      | `space3`, `space4`             | `gap: spacingVars.space4`     |
| Padding in cards and panels  | `space4`, `space6`             | `padding: spacingVars.space6` |
| Different sections           | `space8`, `space10`, `space12` | `gap: spacingVars.space8`     |

Choose values from `spacingVars`. Reserve `space0_5` for small boundary adjustments, not the primary layout of a new screen.

## Layout recipes

| Layout              | Starting point                                                               |
| ------------------- | ---------------------------------------------------------------------------- |
| Page inline padding | `space4` on narrow screens and `space6` on wider screens                     |
| Form                | `space2` between label and input; `space4` between related fields            |
| Card or panel       | `space4` or `space6` inside; `space4` between cards                          |
| Settings screen     | `space2` for title and description, `space4` for fields, `space8` for groups |

These values are starting points for new layouts. If content or viewport constraints
require a change, continue using the same token for the same relationship. Equal spacing
throughout obscures which description belongs to an item and where a new group or task begins.

> Do not hide alignment problems with arbitrary margins. Check baselines, line heights, control sizes, and layout properties first. Use the same token for the same relationship throughout the screen.

## Control density

Start with supported `md` / `controlMd` sizes for forms and `sm` / `controlSm` for dense
toolbars. Keep heights and inner spacing consistent within a group. Compact layouts must
not weaken content, error or focus cues.

Use the available icon-button sizes starting at `icon-xs`; distinguish glyph size from hit
area. For touch-first layouts choose a size or layout that accommodates `touchTarget`.
Use existing size APIs before introducing a universal `compact` prop.

## Generated defaults and app density

Set `theme.density` to `compact` in `.bolerish.json` and run `bolerish init --force`.
Apply `themeStyles` from the generated `settings.stylex.ts` to the app root.
Its inherited `--bolerish-density` scales spacing, controls, icons and text together.
`default` preserves the original sizes; `compact` uses 0.875. `controlXs`, touch
targets and focus strokes stay independent of this scale.

`FieldSet` and `FieldGroup` use `space4` between related fields. `Field` uses
`space2` internally. Section separation belongs to the parent layout; avoid
adding a second section gap to every nested group.

## Spacing by purpose

Use `spacingRoleVars` for new layouts. These semantic roles reference the existing
`spacingVars` scale. Safe-area insets remain the app's responsibility.

| Token          | Purpose                      | Default  |
| -------------- | ---------------------------- | -------- |
| `pageGutter`   | Page inline padding          | `space4` |
| `panelPadding` | Card or panel padding        | `space4` |
| `sectionGap`   | Independent sections         | `space8` |
| `fieldGap`     | Related fields               | `space4` |
| `labelGap`     | Label, control and help text | `space2` |
| `inlineGap`    | Related elements in one row  | `space2` |
| `textGap`      | Title and description        | `space1` |

FieldSet and FieldGroup use fieldGap. Set sectionGap on the parent. Do not blindly
stack page and panel padding. Keep responsive exceptions in the owning layout.

## Units and scale

`theme.unit` accepts `rem` (default) or `px`. Pixel mode preserves semantic lengths
at 1rem=16px but does not follow the user's root font size; browser zoom still works.
Keep rem as the accessibility default. `theme.density` accepts default, compact or a
numeric multiplier greater than zero and at most two. Spacing, text, controls,
icons and content widths use the same multiplier. Percentage and viewport-based
product layouts remain app-owned; this is not a transform of the entire page.
Minimum controls, touch targets, focus strokes, unitless line heights and weights
stay independent of density. Merge the new unit variable into customized tokens;
initialization preserves those files rather than overwriting them.
