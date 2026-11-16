---
"@bolerish/ui": minor
---

Replace the liquid surface mode with solid and glass, and remove Liquid, LiquidProps, the @bolerish/ui/liquid entry point and refraction assets. Use surface.props({ mode: "glass" }) for translucent floating surfaces without distortion. Ordinary cards and fields stay opaque; omitted surface attributes now use solid, including translucent card variants. Migrate application storage and direct liquid data attributes to glass. Replace decorative Liquid backgrounds with app-owned Gradient backgrounds and, where needed, translucent Cards. No separate Glass component is provided.
