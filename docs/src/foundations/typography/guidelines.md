# Typography

Combining size, weight, and line height by role helps people scan headings and read the content they need. Choose type after deciding the information's priority and how much reading it requires.

## Selection guidelines

| Situation                       | Recommended choice                  | Code                                            |
| ------------------------------- | ----------------------------------- | ----------------------------------------------- |
| Page title                      | `fontSizeXl` + `fontWeightSemibold` | `<Heading level={1} size="page">…</Heading>`    |
| Section heading                 | `fontSizeLg` + `fontWeightSemibold` | `<Heading level={2} size="section">…</Heading>` |
| Longer reading content          | `fontSizeMd` + `lineHeightNormal`   | `<P>…</P>`                                      |
| Supporting text beside controls | `fontSizeSm` + `lineHeightNormal`   | `<P variant="description">…</P>`                |
| Supporting metadata             | `fontSizeXs`                        | `<P variant="caption">…</P>`                    |

Start with `lineHeightTight` for short headings and `lineHeightNormal` for multiline content. These combinations guide new screens; they do not replace typography already defined by `Button`, Toast, or `Field`.

### Alignment

Align adjacent titles and button labels on the title's first baseline instead of fixing the title height to the button. Align checkboxes with the first line of a label and description group, even when the description wraps.

> Do not shrink essential guidance or long translations to fit a fixed area. Allow wrapping and content-driven height. Check 200% zoom and long Korean and English text.

### Letter spacing and line height

`typo` currently has no letter-spacing token. Default tracking follows the font and browser settings. Do not tighten all body text simply to make documentation look denser.

Use `lineHeightTight` (1.25) for short headings and `lineHeightNormal` (1.5) for multi-line body text. These values multiply the font size. Adjust grouping and layout spacing first, and preserve content when users increase text spacing. See [Accessibility](/docs/foundations/accessibility) for verification.

## Examples

### When a description wraps to two lines

Use `lineHeightTight` for the short heading and `lineHeightNormal` for the description. Align an adjacent button with the heading's first line and let the description grow below it. Fixing the heading to the button height makes that relationship fragile when text wraps.

### Apply styles to semantic elements

Use [P](/docs/components/p) for paragraphs. Its `body`, `description` and `caption` variants combine the corresponding size, line height and color roles. Inline text can use `span` with tokens; field descriptions and errors keep their dedicated Field components.

Use [Heading](/docs/components/heading) to choose an HTML heading level independently from its visual size.

Typography tokens are exported as `typo`. The existing `typographyVars` name remains a compatibility export of the same variable group; do not apply two separate themes. `spacingRoleVars` provides purpose-based spacing. Configure `theme.unit` as `rem` (default) or `px`, and `theme.density` as `default`, `compact`, or a positive number up to 2. Pixel mode uses 1rem=16px and does not follow root font-size preferences.

## Relative reading styles

Prefer typography tokens for shared roles. Inline code may use a positive `em`
font size to follow the surrounding prose. Reading surfaces may choose a positive
unitless line height, which scales with their text. Foundations lint accepts these
relative relationships while still reporting fixed raw font sizes and line heights.
