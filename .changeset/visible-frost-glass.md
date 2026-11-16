---
"@bolerish/ui": patch
---

Make Glass visibly transmit its backdrop: explicitly translucent panels use a 72% fill, while floating surfaces and modals use 80%. Both use 24px backdrop blur and 1.6× saturation. Solid surfaces, ordinary cards and fields, and opaque accessibility fallbacks retain their existing behavior.
