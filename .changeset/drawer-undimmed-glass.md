---
"@bolerish/ui": patch
---

Keep Liquid Drawer surfaces from sampling their own dark backdrop. Visible overlays now dim only the area outside the Drawer while preserving outside-click dismissal, keyboard recovery and all four directions. Transparent/absent overlays, Solid mode, reduced transparency and forced-color fallbacks retain their behavior. No API migration is required.
