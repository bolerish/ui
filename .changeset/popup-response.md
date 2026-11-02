---
"@bolerish/ui": patch
---

Use the same fast 120ms transition for small trigger-driven popups: Tooltip, HoverCard, Popover, Select, Combobox and DropdownMenu. HoverCard now shares Tooltip's 150ms default hover delay; explicit delay overrides are preserved. Click-triggered controls continue to open immediately and reduced-motion preferences remain respected.
