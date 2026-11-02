---
"@bolerish/ui": patch
---

Keep Liquid blur, tint and reflections visible in Safari and Firefox when SVG backdrop reference filters cannot render. CSS engine-feature gates select a brightness identity filter for those engines instead of the SVG reference; these gates are a compatibility fallback, not a direct SVG-rendering capability test. Chromium retains its SVG refraction enhancement.

Support prefixed WebKit backdrop filtering across shared surfaces and Drawer dimming. Solid mode, reduced-transparency preferences and forced colors retain their opaque fallbacks. No API migration is required; browsers without color mixing still use opaque surfaces.
