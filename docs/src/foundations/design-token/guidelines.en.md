# Design Token

Using the same token for the same role avoids choosing colors and spacing again on every screen. A named role also preserves the reason for a value when the screen changes.

## Selection guidelines

### When to use tokens

Use tokens for color, typography, spacing, corners, shadows, target sizes, and motion. Prefer an existing component's `size` or `variant` prop before overriding its styles.

### Choose a group

| Role                                          | Token group                             |
| --------------------------------------------- | --------------------------------------- |
| Surface, text, boundary, state                | `colorVars`                             |
| Gaps and padding                              | `spacingVars`                           |
| Controls, icons, content width, touch targets | `sizeVars`                              |
| Font, size, weight, line height               | `typo`                                  |
| Corners, shadows, stacking                    | `radiusVars`, `shadowVars`, `layerVars` |
| Duration, easing, disabled opacity            | `motionVars`, `opacityVars`             |

Use semantic tokens instead of raw palette values in new screens. Keep an unmatched value local first. Add a shared token only when the same intent recurs across multiple uses.

## Examples

### Start with the component

Choose `Button`'s `size` when changing a save button. Apply tokens to decisions the component does not own, such as a new panel's padding. This preserves the component's relationship between type, height, and spacing.

### Example

Use role-based tokens for a panel’s background, text, and padding.

```tsx
import * as stylex from "@stylexjs/stylex";
import { colorVars, spacingVars } from "@/styles/tokens/semantic.stylex";

const styles = stylex.create({
  panel: {
    backgroundColor: colorVars.bgSurface,
    color: colorVars.fgPrimary,
    padding: spacingVars.space6,
  },
});
```

Custom StyleX styles import `@bolerish/tokens` and require the app's StyleX compiler. Check names in the actual token file before writing a screen. Do not invent tokens.

## Token values and previews

Find values and visual samples beside each topic’s guidance: [Color](?path=/docs/foundations-color--docs), [Typography](?path=/docs/foundations-typography--docs), [Spacing](?path=/docs/foundations-spacing--docs), [Layout](?path=/docs/foundations-layout--docs), [Radius](?path=/docs/foundations-radius--docs), [Elevation](?path=/docs/foundations-elevation--docs), [State](?path=/docs/foundations-state--docs), [Motion](?path=/docs/foundations-motion--docs).
