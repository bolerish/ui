# Radius

Consistent corners make controls and panels feel like parts of the same system. Choose a radius for the surface's scale and nesting, while preserving existing component shapes.

## Selection guidelines

| Situation                  | Recommended choice      | Code                            |
| -------------------------- | ----------------------- | ------------------------------- |
| Small controls and badges  | `radiusVars.sm`         | `borderRadius: radiusVars.sm`   |
| General surfaces           | `radiusVars.md`         | `borderRadius: radiusVars.md`   |
| Large panels and previews  | `radiusVars.lg` or `xl` | `borderRadius: radiusVars.lg`   |
| Circular avatars and pills | `radiusVars.full`       | `borderRadius: radiusVars.full` |

Existing components already define their corners. These values are starting points for new surfaces, not instructions to override each component.

### Nested surfaces

Check inner and outer corners together with their spacing. Avoid applying one radius mechanically to every nested surface or repeatedly adding new values.

> Ensure images, focus rings, and popups are not clipped. Inspect the content before adding `overflow: hidden` to create rounded edges; it can hide focus indicators and menus.

## Examples

### A card containing an image

When an image touches the card's edge, check that the two contours meet cleanly. When it sits inside padding, inspect the inset and inner radius together. Check for focus indicators and menus extending outside before clipping the entire card.
