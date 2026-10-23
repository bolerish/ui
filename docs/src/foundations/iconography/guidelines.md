# Iconography

Consistent, familiar symbols make repeated actions easier to find. Add visible text where the symbol alone would leave a first-time user guessing.

## Selection guidelines

Import icons directly from `@phosphor-icons/react`. Check existing Phosphor icons first. Use the same icon and weight for the same role. Choose from `sizeVars.iconXs`, `iconSm`, `iconMd`, and `iconLg`.

An icon's visible size is different from its touch target. Provide enough space to press small icons, and prefer the existing icon size props on `Button`.

### Accessible names

Add an `aria-label` to icon-only buttons. Hide decorative icons beside text with `aria-hidden` to avoid repeating the label. A tooltip does not replace a required accessible name.

### Alignment

Align Toast status icons to the title's first line and keep the close icon at that line on the right. Do not move icons to the center of the entire message when the description wraps. Keep one icon for the same action.

## Examples

### Place icons in a file row

A file-type icon helps identify the item; a more-actions icon opens a menu. One decorates a name and the other is a control. Even when their drawings are the same size, their accessible names and interactive areas serve different purposes.
