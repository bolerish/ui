# State

Distinguishing availability from persistent selection helps people tell what they can do from what they have already chosen. Treat momentary input response, selection, and request outcomes as separate information.

## Selection guidelines

| Situation                            | Recommended choice                                                        | Code                                                    |
| ------------------------------------ | ------------------------------------------------------------------------- | ------------------------------------------------------- |
| Pointer enters the control           | `interactionHover`; `interactionSolidHover` for filled action buttons     | `backgroundColor: colorVars.interactionHover`           |
| While pressing the control           | `interactionPressed`; `interactionSolidPressed` for filled action buttons | `backgroundColor: colorVars.interactionPressed`         |
| Show the current keyboard position   | `strokeFocus` with a focus outline                                        | `outlineColor: colorVars.strokeFocus`                   |
| Keep a selected item identifiable    | `bgSelected` with a selection indicator                                   | `backgroundColor: colorVars.bgSelected`                 |
| The control is currently unavailable | `fgDisabled` with the control’s `disabled` attribute                      | `color: colorVars.fgDisabled`                           |
| Waiting for a request                | Status text and `Spinner`                                                 | `<Spinner />`                                           |
| An input value needs correction      | `FieldError` and an explanation beside the input                          | `<FieldError>Enter a valid email address.</FieldError>` |

Use `interactionPressed` only while pressing. Use `bgSelected` for flat selection and `interactionSelected` for a raised selection within a group. Combining them makes selection and input feedback hard to distinguish.

### Implementation

Prefer semantic props such as `disabled`, `checked`, and `aria-invalid`. A visually disabled control must not remain clickable. Prevent duplicate submissions during loading while explaining what is happening.

Set `outlineStyle`, `outlineWidth`, and `outlineOffset` alongside the focus color. Connect selection to `checked` or `aria-pressed`, and mark pending regions with `aria-busy`. For input errors, set `aria-invalid` and connect the error description ID through `aria-describedby`.

> Check default, hover, pressed, focused, and disabled states in both themes. Test selection and focus together. Explain why a control is unavailable nearby when that information is needed.

### State and outcome colors

`interaction*` tokens express hover, press, selection, and availability. Layer translucent colors over the existing surface; use `interactionSolid*` on filled action backgrounds.

`bgFeedback*`, `fgFeedback*`, and `strokeFeedback*` express the background, content, and border for information, success, warning, and error. Keep pointer state separate from the outcome of a task.

## Examples

### When focus returns to a selected item

A selected item should keep its selection treatment when focus returns. The focus indicator adds the current keyboard position. Using only a pressed color for selection loses that information once the control is released.

### Apply state styles

Start with `Button` for an action and `Toggle` for persistent selection. The example shows how CSS properties connect to state when building a new control. Hover over **Pin project**, press, and release. The selected background, border, and check mark remain while the pressed layer disappears. Tab to the control to add focus without losing selection.

> Hover and pressed colors are translucent layers. This example combines selection and pointer layers over `bgSubtle`, with a border and check mark to distinguish selection. Use `interactionSolidHover` and `interactionSolidPressed` over a filled primary-action background. Color alone does not provide HTML state or behavior.

## Role composition contracts

Choose tokens by role, not by a preferred color. Selection and drop targets are distinct roles
even when their values match. The existing `interactionSelected` name and values remain supported.

| Role                            | Background            | Content and boundary                                  | Additional cue                                              |
| ------------------------------- | --------------------- | ----------------------------------------------------- | ----------------------------------------------------------- |
| Content                         | `bgSurface`           | `fgPrimary`, optional `strokeDefault`                 | Content structure and heading                               |
| Quiet group                     | `bgSubtle`            | `fgPrimary` / `fgSecondary`, optional `strokeDefault` | Group label; no selection meaning                           |
| Floating popup                  | `bgRaised`            | `fgPrimary`, `strokeDefault`                          | `shadowVars.floating`; component owns positioning and focus |
| Flat selection                  | `bgSelected`          | `fgPrimary`, optional `strokeStrong`                  | Check or selection boundary and semantic selection state    |
| Raised selection within a group | `interactionSelected` | `fgPrimary`, `shadowVars.subtle`                      | Place inside a `bgSubtle` container                         |
| Drop receiving area             | `bgDropTarget`        | `fgPrimary`, `strokeDropIndicator` boundary           | Describe the result, such as “Move into this folder”        |
| Exact insertion position        | None                  | `strokeDropIndicator`, `sizeVars.focusRing` thickness | Line and “Move before this item” label                      |

Segmented Tabs and soft Toggle Groups share the selection surface color. Segmented Tabs add a shadow; soft Toggle Groups use the selected background. Tabs switch panels;
Toggle Groups choose values. Keep their distinct semantics and keyboard behavior.
A standalone soft Toggle uses `bgSelected`; only outline Toggle keeps a selection boundary.

### Overlapping states

1. Keep the selected background and indicator through hover and press.
2. Add translucent hover and press layers without replacing the background. Press wins over hover.
3. Draw focus as a separate outline without removing an error border or selection indicator.
4. Disabled controls block input and hover/press feedback but retain the stored selection.
   Use `fgDisabled` without reducing the entire control's opacity again.
5. A forbidden drop removes receiving highlights and insertion lines. Show a prohibition cue and
   explanation; the application must also reject the operation.

### Drag states

Keep the source slot and name visible with a dashed `strokeDefault` boundary and a “Moving” label.
Use an area for a receiving target and a line for the exact insertion position. Do not mark all
eligible targets as active insertion positions or reuse the keyboard focus ring for the source.

The application owns drag eligibility, ordering and persistence. Provide equivalent buttons or
menus for keyboard and touch users. Clear temporary indicators on cancel and completion.
The example below moves real items and offers equivalent “Move before” buttons. It ignores external
files and drags from outside the list; dropping on the source does not change the order.

Primary buttons use `bgActionPrimaryHover` for their monochrome hover state. Segmented Tabs use a subtle `strokeDefault` inset edge and shadow; soft Toggle Group uses the selected background.

Default and soft Toggle/Toggle Group use the selected background without adding an inset border. Only outline keeps the selected boundary. Segmented Tabs use strokeDefault and the subtle shadow for the selected surface. Keyboard focus remains independent of selection.
