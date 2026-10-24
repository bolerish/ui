---
"@bolerish/lint": minor
---

Rename the package to `@bolerish/lint`. Install the new package and update
ESLint imports, Oxlint `jsPlugins` specifiers and the `/foundations` metadata
import. Rule names remain `bolerish-ui/*`, so existing severities and per-rule
comment exceptions remain valid. The previous npm package is not an alias.
