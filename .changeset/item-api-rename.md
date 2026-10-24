---
"@bolerish/ui": minor
---

Rename ContentRow to Item throughout the public API. Import from
`@bolerish/ui/item` and use `Item`, `ItemGroup`, `ItemMedia`, `ItemContent`,
`ItemTitle`, `ItemDescription`, `ItemActions` and the corresponding Item types.
The former `content-row` entry point and all ContentRow exports are removed;
no compatibility aliases remain. Layout and interaction behavior are unchanged.
