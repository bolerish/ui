---
"@bolerish/ui": patch
---

Apply vertical padding and spacing at the Card root so content-only cards receive consistent insets. CardFooter now has a top border, rounded bottom corners and vertical padding; its previous flex alignment is removed. Consumers that need a footer action layout should supply their own layout styles.
