---
"@bolerish/tokens": patch
---

Keep the token release aligned with `@bolerish/ui` through their fixed release
group. This release does not change token values, exported token names or runtime
CSS variable names; existing token imports require no migration.

Move palette conversion and generation tools into the token package for
maintainers. Exclude these authoring tools, colocated tests and test support from
the published package while retaining the token source exports.
