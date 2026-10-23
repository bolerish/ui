# Gradient

Extend content colors into an atmosphere. Keep semantic color tokens on ordinary screens and apply gradients to backgrounds associated with changing content, such as album artwork.

## Selection guidelines

| Situation                                       | Recommended choice                | Rationale                                                 |
| ----------------------------------------------- | --------------------------------- | --------------------------------------------------------- |
| An atmosphere derived from music or photography | Layered radial gradients          | Two colors blend across a shared background               |
| A transition into the next content region       | A linear fade into `bgCanvas`     | The background meets the base surface without a hard edge |
| Long text or inputs over a background           | A contrast veil or opaque surface | Reading and editing remain predictable as colors change   |
| Floating secondary controls                     | `Card variant="translucent"`      | Controls remain distinct while sharing the background     |

## Compose the background

Apply the gradient to the outer container. Do not apply opacity or a mask to the whole card, its text or its controls. Preserve action, error and selection colors when changing background colors, positions or spread.

Spread two colors with `radial-gradient()` layers and add a veil using the base canvas color. Fade the veil into the canvas at the bottom to connect the next region. The example below shows the full composition with semantic tokens and dynamic colors.

## Reading and accessibility

- Maintain at least 4.5:1 contrast for ordinary text and 3:1 for large text.
- Check overlapping colors and the brightest and darkest positions, not just one representative color.
- Decorative layers must not intercept pointer input. Prefer opaque surfaces for long text and editing.
- Remove decorative gradients for reduced transparency and forced colors; restore the base canvas or system colors.
- Background motion is optional. Respect reduced motion if adding it.

## Example

The example combines background color selection, a contrast veil, a bottom fade and a translucent Card. Its reading surface stays opaque. Change the documentation theme and the selected background color together.

## Apply to an existing element

`gradient.props({ colors }, ...styles)` from `@bolerish/ui/gradient` returns `className` and `style`. Supply exactly two valid CSS colors. Apply the result to an existing `body`, `section` or `div` without an extra element, client hook or consumer StyleX compiler. Load the base `@bolerish/ui` stylesheet first.

```tsx
import { gradient } from "@bolerish/ui/gradient";

<section {...gradient.props({ colors: ["#80414b", "#b49058"] })} />;
```

`colors` is ordered as `[accent, glow]`.

- `colors[0]` (`#80414b`): the accent radiating from the top left `(0%, 0%)`.
- `colors[1]` (`#b49058`): the glow radiating from the upper right `(100%, 15%)`.

The colors overlap and blend, fading into the base canvas toward the bottom. They are not the start and end stops of a linear gradient.
