---
"@bolerish/ui": minor
---

Add Snackbar as the canonical compact notification, with open/defaultOpen/onOpenChange and duration (3000ms by default; 0 disables auto-dismiss). StatusPill remains a deprecated compatibility wrapper with persistent inline defaults; migrate visible to open and pass onOpenChange for controlled auto-dismiss.

Add a calendar icon to DatePicker and match the calendar popup to its trigger width within viewport constraints. Calendar keeps its normal default width but can shrink to fit.

Add Carousel orientation and controlsPlacement props. Vertical carousels use up/down arrows and require a defined height; orientation takes precedence over options.axis. Previous/Next continue to accept Button variants, including ghost for arrow-only controls. Existing horizontal defaults remain unchanged.

Reduce Tooltip hover delay from the upstream 600ms default to 150ms. Provider and trigger delay overrides remain supported, with the trigger taking precedence.
