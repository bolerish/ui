---
"@bolerish/ui": patch
---

Make Liquid panels, controls and floating surfaces more transparent, with less
blur, no inset reflections or gloss, and shallower floating shadows. Liquid also
uses a more transparent fill without an inset highlight. Existing components inherit the adjustment
through `data-bolerish-surface="liquid"`; no component API changes are required.
Solid surfaces and reduced-transparency and forced-colors fallbacks retain their
existing behavior. Review text contrast when using custom backgrounds.

Use the same more transparent, lower-blur material across portaled popovers,
menus, selection lists, tooltips, hover cards, date pickers and notifications,
as well as modal surfaces. Foreground content keeps its full opacity.
