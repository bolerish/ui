# Feedback

Connecting an immediate response to the eventual result tells people whether their action registered, whether to wait, and what to do next. Begin close to the action and keep the outcome visible for as long as it matters.

## Selection guidelines

### Input response and task outcome

Pressing a button and completing a save need feedback at different times. Show the pressed state immediately; announce success only after the asynchronous operation completes.

| Situation              | Recommended choice                                                   | Code                                            |
| ---------------------- | -------------------------------------------------------------------- | ----------------------------------------------- |
| Pointer hover          | `interactionHover`, or `interactionSolidHover` on filled actions     | `backgroundColor: colorVars.interactionHover`   |
| While pressed          | `interactionPressed`, or `interactionSolidPressed` on filled actions | `backgroundColor: colorVars.interactionPressed` |
| Short color transition | `Button`'s `motionVars.durationFast` and `easingStandard`            | `transitionDuration: motionVars.durationFast`   |
| Request pending        | A processing label and `Spinner`                                     | `<Spinner />`                                   |
| Request completed      | Inline confirmation or Toast                                         | `toast.add({ title: "Changes saved." })`        |

The color tokens belong to `colorVars`. A pressed response does not mean success. @bolerish/ui `Button` has no shared pressed-scale effect; do not introduce one as if it were the default. Compare actual colors in [State](/docs/foundations/state).

| Situation                                | Recommended choice                         | Code                                                                                          |
| ---------------------------------------- | ------------------------------------------ | --------------------------------------------------------------------------------------------- |
| An input needs correction                | `FieldError` and a nearby explanation      | `<FieldError>Enter a valid email address.</FieldError>`                                       |
| Work completed without blocking the flow | Toast                                      | `toast.add({ title: "Changes saved." })`                                                      |
| Work can be undone                       | A Toast action and actual data restoration | `actionProps: { children: "Undo", onClick: restoreItem }`                                     |
| Page guidance must remain visible        | `Banner`                                   | `<Banner><BannerContent><BannerTitle>Update available</BannerTitle></BannerContent></Banner>` |
| A short asynchronous operation           | `Spinner` and a status message             | `<Spinner />`                                                                                 |
| Progress is measurable                   | `Progress`                                 | `<Progress value={50} />`                                                                     |
| A risky action needs a decision first    | Alert `Dialog`                             | `<AlertDialog>…</AlertDialog>`                                                                |

Keep essential conditions visible in the page rather than only in a toast that quickly disappears.

### Action responsibilities

Undo must restore the data, then reflect the result. Closing a notification is not restoration. Dismiss all clears the notification list; it does not cancel the underlying work.

> Avoid duplicate messages for the same result. Connect loading, success, and failure messages. Keep necessary state in the page after notifications disappear. Preserve the Toast behavior where Escape closes notifications one at a time, newest first.

### Before interrupting a task

Do not open a modal for routine completion feedback or a correctable input error. Ask for confirmation when a decision is necessary to proceed.

Follow a saving state with success or failure. Preserve input and provide a retry path after failure. Do not invent a percentage when progress cannot be measured.

## Examples

### After someone selects Save

Show the pressed state while the button is held. Once the request starts, indicate progress and prevent duplicate submission. On success, confirm the result; on failure, preserve the input and offer a retry. Each stage answers a different question.

## Color composition and scope

| Role                                              | Composition rule                                                                                                                        |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Input error                                       | Keep the input's normal surface, use its error border and `FieldError`. Do not color the entire input foreground as the only error cue. |
| Persistent information, success, warning or error | Apply matching `bgFeedback*` and `fgFeedback*` to Banner. Add matching `strokeFeedback*` only when a boundary is needed.                |
| Supporting description                            | Use `fgSecondary`. A constraint is not an error before validation fails.                                                                |

Not every message needs both a background and a border. Keep field errors near their input
and request failures in a persistent form-level area. Long Banner body text may use `fgPrimary`
while its heading, icon and background retain the same feedback meaning. Banner has no
`variant` prop; apply these combinations with `xstyle`.
