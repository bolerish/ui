## StyleX composition

For StyleX consumers, pass the original styles before converting them with `stylex.props()`.

```tsx
<div {...gradient.props({ colors }, styles.layout, styles.width(640))} />
```

The helper calls `stylex.props(gradientStyles, ...styles)` once. Consumer styles follow the gradient styles, so later values win for the same property. StyleX handles conditional styles, arrays and dynamic CSS variables. Shorthand/longhand resolution follows the consumer's StyleX configuration. There is no additional class concatenation or inline-style merging policy.

Do not pass an already converted `stylex.props()` result or ordinary React `className`/`style` objects as arguments. Separate spreads such as `{...stylex.props(...)} {...gradient.props(...)}` replace the earlier `className` and `style` through normal JavaScript property precedence. Spread the composed result once. Ordinary CSS consumers can apply the helper output directly and define layout with CSS; external overrides of identical properties follow the normal cascade.

## API reference

### `gradient.props(options, ...styles)`

| Argument         | Type                        | Required / default   | Description                                                                               |
| ---------------- | --------------------------- | -------------------- | ----------------------------------------------------------------------------------------- |
| `options.colors` | `readonly [string, string]` | Required; no default | Two non-empty CSS colors: top-left accent `colors[0]`, then upper-right glow `colors[1]`. |
| `...styles`      | `stylex.StyleXStyles[]`     | Optional; none       | Original StyleX styles, applied after the background styles.                              |

Returns `GradientProps` (`ReturnType<typeof stylex.props>`): the `className` and dynamic `style` attributes to spread onto one existing element. The exported `GradientOptions` type describes the color options.

Missing colors, a count other than two, non-string values or empty strings throw a `TypeError`. CSS color syntax is validated by the browser.

## Themes and fallback surfaces

The background follows the semantic `bgCanvas` token in light and dark themes. It fills the entire element: on a long `body`, the fade follows the document height. It does not change the element's size, positioning or scroll attachment.

Unsupported CSS color mixing, reduced transparency and forced colors remove the gradient and use an opaque canvas or system background. The helper does not extract artwork colors or automatically calculate text contrast for arbitrary colors. The consuming app chooses content colors and verifies contrast on the resulting background.

There is no additional Gradient wrapper component. Artwork color extraction and music data belong to the consuming app. See [Color](/docs/foundations/color) for semantic colors and surfaces.
