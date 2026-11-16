# Surface

Select the shared Solid or Glass material for installed components. Load `@bolerish/ui/global.css` first. No Provider, wrapper or consumer StyleX compiler is required.

```tsx
import { surface } from "@bolerish/ui/surface";

<html data-bolerish-theme="dark" {...surface.props({ mode: "glass" })} />;
```

## `surface.props(options)`

`options.mode` is required: `"solid" | "glass"`. Returns `SurfaceProps`: `{ "data-bolerish-surface": "solid" | "glass" }`. `SurfaceOptions` is exported from both `@bolerish/ui` and `@bolerish/ui/surface`. Missing or unsupported modes throw `TypeError`.

Solid is the default, including when the attribute is omitted. Glass adds 80% `bgRaised` and 24px backdrop blur with 1.6× saturation to floating and raised surfaces. Cards, ordinary Attachment panels, outlined Items and Menubar use 72% `bgSurface` and the same blur. Input fields keep their opaque material. Glass panels add a thin inset highlight without refraction or lens distortion and retain the existing elevation shadow tokens.

Reduced transparency, forced colors and unsupported effects use solid fallbacks. Visible-overlay modals also require `:has()` for the glass treatment; otherwise they use an opaque panel and ordinary backdrop. Theme colors, selection, error, focus, disabled states and text opacity retain their contracts. Custom themes must be checked against their actual composite backgrounds; the helper does not correct translucent or low-contrast custom colors.

## Composition

The result contains no `className`, `style`, `ref` or event handlers and can be spread before or after ordinary props or `stylex.props()` without replacing them. Normal JavaScript spread order applies if the same data attribute is supplied twice. The optional StyleX composition requires your existing compiler; the helper itself does not.

## Scope and portals

Apply to `html` for the entire document, including portaled menus, dialogs and notifications. A local `surface.props({ mode: "solid" })` overrides material for DOM descendants. An attribute does not paint an ordinary `div` or `section`, and it does not reach portals mounted outside the subtree.

Direct `data-bolerish-surface="solid"` and `"glass"` attributes are supported. Your app owns preference state, persistence and color mode. See [Theming](/docs/theming).

## Content backgrounds

Use [Gradient](/docs/api/gradient) on an app-owned background and, when needed, `Card variant="translucent"` inside a Glass scope. Keep editing surfaces opaque and check text, boundaries and focus against your actual background.

## Migrate from Liquid

`Liquid`, `LiquidProps`, the `@bolerish/ui/liquid` entry point and the `liquid` surface mode have been removed. Use `surface.props({ mode: "glass" })` for shared glass surfaces. Replace an owned decorative background with an app background using Gradient and, when needed, `Card variant="translucent"`. This preserves a translucent surface without refraction. No separate Glass component is provided.

Migrate application storage and direct data attributes from `liquid` to `glass`. The documentation site migrates its own old preferences and URLs; the npm package does not migrate application storage. The old `liquid` data attribute has no supported selector and does not reset an enclosing Glass scope.
