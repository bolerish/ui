---
"@bolerish/ui": patch
---

Use the Phosphor SSR entry point for built-in icons to remove their React Context dependency. Built-in icons no longer inherit Phosphor IconContext defaults; pass icon properties explicitly for custom icons.
