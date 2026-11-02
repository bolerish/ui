---
"@bolerish/ui": patch
---

Keep Liquid Dialog and AlertDialog panels from sampling their own dimmed backdrop, matching Drawer. Share modal dimming so only the last mounted modal paints the outside scrim, including during closing transitions. Solid mode, reduced transparency, forced colors and browsers without the required CSS support retain the existing backdrop path. No API migration is required.

Nested Liquid modals keep the outside dimming steady during entry and exit. Their transform motion remains; panel opacity stays stable while it owns the scrim.
