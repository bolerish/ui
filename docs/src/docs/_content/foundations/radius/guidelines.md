# Radius

Consistent corners make controls and panels feel like parts of the same system. Choose a radius for the surface's scale and nesting, while preserving existing component shapes.

## Selection guidelines

| Situation                     | Recommended choice | Code                            |
| ----------------------------- | ------------------ | ------------------------------- |
| Small details                 | `radiusVars.sm`    | `borderRadius: radiusVars.sm`   |
| Small actions and inset items | `radiusVars.md`    | `borderRadius: radiusVars.md`   |
| Controls and popups           | `radiusVars.lg`    | `borderRadius: radiusVars.lg`   |
| Circular avatars and pills    | `radiusVars.full`  | `borderRadius: radiusVars.full` |

Existing components already define their corners. These values are starting points for new surfaces, not instructions to override each component.

### Nested surfaces

Check inner and outer corners together with their spacing. Avoid applying one radius mechanically to every nested surface or repeatedly adding new values.

> Ensure images, focus rings, and popups are not clipped. Inspect the content before adding `overflow: hidden` to create rounded edges; it can hide focus indicators and menus.

## Examples

### A card containing an image

When an image touches the card's edge, check that the two contours meet cleanly. When it sits inside padding, inspect the inset and inner radius together. Check for focus indicators and menus extending outside before clipping the entire card.

Use sm (4px) for details, md (8px) for small actions and inset items, lg (12px) for controls and popups, and xl (16px) for cards and dialogs. Keep circles and pills full.
