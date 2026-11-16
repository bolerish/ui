---
"@bolerish/ui": patch
---

Give DrawerContent default panel padding and scrolling in every direction without doubling DrawerHeader or DrawerFooter insets. Its styling props still target the inner content. Custom layouts that previously added their own padding can override or remove the default through the existing styling props.

Keep Calendar range interiors visible with the semantic selected background during hover and keyboard focus, while retaining stronger range endpoints.
