# Accessibility

Help people complete the same task with a keyboard, assistive technology, or enlarged text. Pair component behavior with meaningful names, focus order, and tested color combinations so changing how someone uses the screen does not remove an action.

## Design guidelines

### Structure and names

Use `Button` for actions and links for navigation. Follow the content hierarchy with headings, provide a way to skip repeated navigation, and set the page language with `lang`.

Connect `FieldLabel`'s `htmlFor` to the input's `id`. Name icon buttons with `aria-label` and hide decorative icons with `aria-hidden`. Provide alternative text for informative images and empty `alt` for decorative images. Keep essential instructions visible rather than only in `Tooltip`.

### Keyboard and focus

| Interaction        | Verification                                                     |
| ------------------ | ---------------------------------------------------------------- |
| Navigation         | Tab and Shift+Tab follow a meaningful order                      |
| Activation         | Buttons support Enter and Space; links support Enter             |
| Composite controls | Preserve arrow-key behavior in `Select`, `Tabs`, and Radio Group |
| Closing popups     | Verify the component's close button and Escape behavior          |
| Returning focus    | Return to the trigger or a useful continuation point             |

Keep focus within a modal while it is open, with a working way to close it. Sticky headers and panels must not completely obscure the focused element. Preserve focus indicators and avoid positive `tabIndex` values. Provide a non-dragging alternative for drag interactions.

### Contrast and target size

AA text contrast is **4.5:1** for ordinary text and **3:1** for large text. Large text is at least 18pt, or bold 14pt: 24 CSS px or approximately 18.67 CSS px respectively. Exceptions include inactive elements and logos; see [text contrast requirements](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).

Check semantic tokens in their actual foreground/background combinations, including composited translucent layers. Do not communicate errors or selection through color alone.

AA pointer targets are at least 24×24 CSS px, with exceptions for spacing, inline links, and other cases. Distinguish icon size from the clickable area. `sizeVars.touchTarget` is 2.75rem, equivalent to 44px at a 16px root font size; not every control automatically uses it. See [target size and exceptions](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).

### Zoom and text spacing

Check 200% zoom and narrow viewports for clipped content, controls, and errors. Content and functionality must remain available when users set line height to 1.5 times the font size, paragraph spacing to 2 times, letter spacing to 0.12 times, and word spacing to 0.16 times. These are resilience checks, not mandatory default design values. See [text spacing requirements](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html) for language-specific applicability.

### Errors and status announcements

Set `Field`'s `invalid` and the input's `aria-invalid`, and connect the error description through `aria-describedby`. Preserve values after failed submission and explain how to correct them. See [Field](/docs/components/field) for composition.

Announce result counts and completion without moving focus. Use `Banner`'s `announce="polite"` for routine status and `assertive` for urgent information. Avoid duplicate announcements. Allow paste and autofill in authentication fields.

## Examples

### Follow a settings change through to completion

Tab to a field, change its value, save, and check the completion announcement with a screen reader. If saving fails, keep the value and correction guidance. This one task exercises names, keyboard behavior, errors, and status messages.

## Verification order

1. Use automated checks to find name, role, and structure issues.
2. Complete primary tasks with the keyboard, including cancellation and recovery.
3. Check names, roles, values, errors, and dynamic results with a screen reader.
4. Check light and dark themes, zoom, text spacing overrides, high contrast, and reduced motion.

Passing automated checks does not establish full conformance. Record the screens, environments, and tasks verified manually. This guide is a verification baseline, not WCAG certification for @bolerish/ui.
