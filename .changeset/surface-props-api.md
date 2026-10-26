---
"@bolerish/ui": minor
---

Add `surface.props({ mode: "solid" | "liquid" })` through the root and
`@bolerish/ui/surface` entry points. It returns only `data-bolerish-surface`,
preserving independently composed `className` and `style` props. Apply it to
`html` to include portaled surfaces; existing data attributes remain supported.
The helper requires no Provider, wrapper or consumer StyleX compiler and does
not capture page content. Unsupported modes throw `TypeError`.
