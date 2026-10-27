---
"@bolerish/ui": minor
---

Select the built-in light or dark theme with `data-bolerish-theme="light"` or
`data-bolerish-theme="dark"` on `html` after loading the package CSS. The attribute
applies color and shadow tokens, document colors and font, and `color-scheme`
without importing JavaScript or configuring a StyleX compiler.

Compiled StyleX themes on the same element take precedence over the attribute's
built-in token values. Precompiled variable definitions now use StyleX's variable
layer so consumer themes can override them. Existing `themeClassNames` imports remain supported; no
migration is required. Apps can switch the attribute instead of replacing theme
classes, preserving unrelated document classes.
