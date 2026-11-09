# Elevation

Showing the relationship between a floating menu and its background helps people find the active surface. Shadows describe depth; layers determine which surface appears in front.

## Selection guidelines

| Situation                         | Recommended choice                                   | Code                             |
| --------------------------------- | ---------------------------------------------------- | -------------------------------- |
| Groups on the same surface        | Spacing and borders; `shadowVars.subtle` when needed | `boxShadow: shadowVars.subtle`   |
| Small floating menus and popovers | `shadowVars.floating`                                | `boxShadow: shadowVars.floating` |
| Modal surfaces                    | `shadowVars.overlay`                                 | `boxShadow: shadowVars.overlay`  |
| Modal backdrop and content        | `layerVars.modalBackdrop`, `layerVars.modal`         | `zIndex: layerVars.modal`        |
| Popups and notifications          | `layerVars.popup`, `layerVars.notification`          | `zIndex: layerVars.popup`        |

Use the portals and layers managed by components. If a menu is covered, inspect its parent stacking context and portal location before adding a value such as `z-index: 9999`.

## Examples

### Distinguish a menu from a confirmation

Use Dropdown Menu for a row's secondary commands. Use Alert `Dialog` when someone must consider a deletion's consequences. Both float above content, but their focus behavior and effect on the current task differ.

> A shadow does not provide modal focus management or prevent interaction with the background.

> Check borders and shadows in both themes. Keep text and borders crisp when stacking toasts. Document the stacking order and interactions before adding a new layer role.
