---
"@bolerish/ui": minor
---

Add `Liquid` and `LiquidProps` through the root and `@bolerish/ui/liquid` entry points.
In Liquid mode, the component refracts an explicitly supplied decorative
`background` while foreground children remain sharp and interactive. It does not
capture the page or require a new runtime dependency. Solid mode, reduced
transparency and forced colors retain an opaque surface. Large surfaces and
unsupported canvas environments keep the material without refraction.

The unreleased Glass name and subpath are replaced by Liquid without aliases.
For existing components, the global surface setting is sufficient: a packaged
SVG adds gentle live-backdrop refraction in Chromium while Safari and Firefox
retain blur. No Provider, per-component wrapper or runtime registration is
needed. The shared map is fixed and stretched rather than fitted per element.
CSS bundlers must retain or emit the referenced SVG asset; Solid and accessibility
fallbacks disable the filter.
