---
"@bolerish/ui": minor
---

Select a shared surface treatment with `data-bolerish-surface="solid"` or
`"liquid"` on `html` or a containing element. Panels, resting controls and
floating surfaces use role-specific transparency, blur and highlights while
component variants and semantic state colors remain independent. Apply the
attribute to `html` for portaled content; a nested `solid` scope can opt out.

Omitting the attribute preserves the existing appearance, including
`Card variant="translucent"`. Reduced transparency, forced colors and browsers
without the required CSS features retain solid fallbacks.
