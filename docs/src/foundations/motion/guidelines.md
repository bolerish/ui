# Motion

Connecting the start and end of a change helps people keep their place. Choose timing and easing according to whether the change is a small input response or a larger surface transition.

## Selection guidelines

| Situation                                  | Recommended choice                                             | Code                                            |
| ------------------------------------------ | -------------------------------------------------------------- | ----------------------------------------------- |
| Hover and press feedback                   | `motionVars.durationFast`                                      | `transitionDuration: motionVars.durationFast`   |
| General state and surface transitions      | `motionVars.durationNormal`                                    | `transitionDuration: motionVars.durationNormal` |
| Larger areas such as `Dialog` and `Drawer` | `motionVars.durationSlow`                                      | `transitionDuration: motionVars.durationSlow`   |
| Repeating loading feedback                 | `durationLoading`; `durationLoadingReduced` for reduced motion | `animationDuration: motionVars.durationLoading` |

Consider `easingStandard` for state changes and `easingEnter` and `easingExit` for entry and exit. Preserve the component's existing motion settings and media queries first.

### Reduced motion

Respect `prefers-reduced-motion`. Retain progress text and state when reducing rotation or movement. Only an explicit end-user runtime choice may override the OS preference.

> Do not add looping animation just for emphasis. If scaling blurs text and borders, consider translation, dimensions, or opacity instead. Do not make people wait for decoration after loading completes.

## Examples

### When a panel opens and closes

Consider `easingEnter` for arrival and `easingExit` for departure. Use `durationFast` for a brief button color change. The open panel and any pending state must remain clear when motion is reduced.

## App defaults and user preferences

Load the `@bolerish/ui` stylesheet to follow OS reduced motion by default.
Set `data-bolerish-motion` on `html` to `system`, `on` or `off`.
Only the end user's explicit `on` overrides OS reduced motion. Removing the
attribute follows the OS. Your app owns the settings UI and persistence;
developers must not apply `on` automatically as their default.

```ts
import type { MotionPreference } from "@bolerish/ui";

function setMotionPreference(preference: MotionPreference) {
  document.documentElement.dataset.bolerishMotion = preference;
}
```

Keep loading copy and open states visible, and apply the same resolved choice
to JavaScript scrolling and View Transitions.
