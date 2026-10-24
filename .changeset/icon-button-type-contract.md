---
"@bolerish/ui": minor
---

Require `aria-label` or `aria-labelledby` when Button size is `icon`, including through InputGroupButton. Add one of these names to existing icon-only callers; regular text button sizes are unchanged.

Check the built-in Toast icon mapping exhaustively while preserving custom type strings. Unknown types, including inherited object-property names, render their text without a status icon.
