---
"@bolerish/ui": major
---

Remove the public Surface API, both solid and glass modes, and Card material variants. Panels now use opaque semantic backgrounds. Dialog, AlertDialog and Drawer backdrops use a gray overlay with subtle blur independently of any surface setting; reduced transparency and forced colors disable that blur.

Remove imports from `@bolerish/ui/surface`, root `surface`/`SurfaceOptions`/`SurfaceProps` imports, `surface.props()` calls, `data-bolerish-surface` attributes and saved surface mode settings. Remove `variant="default"` and `variant="translucent"` from Card. Keep semantic background roles such as `bgSurface`; they continue to support app composition and theming.
