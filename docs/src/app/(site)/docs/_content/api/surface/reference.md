# Surface

Select the shared Solid or Liquid material once for installed components. No Provider, wrapper or consumer StyleX compiler is required. Load the `@bolerish/ui` stylesheet first.

```tsx
import { surface } from "@bolerish/ui/surface";
import { themeClassNames } from "@bolerish/ui/theme";

<html className={themeClassNames.dark} {...surface.props({ mode: "liquid" })} />;
```

## `surface.props(options)`

| Argument       | Type                  | Required / default   | Meaning                                   |
| -------------- | --------------------- | -------------------- | ----------------------------------------- |
| `options.mode` | `"solid" \| "liquid"` | Required; no default | Select an opaque or translucent material. |

Returns `SurfaceProps`: `{ "data-bolerish-surface": "solid" | "liquid" }`. The options type is exported as `SurfaceOptions`. The helper is available from `@bolerish/ui` and `@bolerish/ui/surface`. Missing or unsupported modes throw `TypeError`.

Solid uses opaque surfaces. Liquid uses role-specific transparency, blur and shallow floating shadows. In Chromium, existing material surfaces also refract the live backdrop through a packaged SVG filter. No Liquid component or runtime registration is required. Safari and Firefox keep the blur treatment. Theme colors, selected/error/disabled states and text opacity keep their own contracts. Reduced transparency, forced colors and unsupported effects use opaque fallbacks.

## Composition

The result contains no `className`, `style`, `ref` or event handlers. It can be spread before or after ordinary DOM props or `stylex.props()` without replacing their styling.

```tsx
<html {...stylex.props(theme, styles.root)} {...surface.props({ mode: "liquid" })} />
```

This optional StyleX example requires the app's existing compiler. The helper itself is precompiled and does not require one. If the same data attribute is supplied twice, normal JavaScript spread order applies.

## Scope and portals

Apply to `html` for the entire document, including menus, dialogs and notifications rendered through portals. A local scope can override material for descendants:

```tsx
<section {...surface.props({ mode: "solid" })}>
  <Card>Opaque reading surface</Card>
</section>
```

The attribute selects material for participating components; it does not automatically paint an ordinary `div` or `section`. A locally scoped attribute does not reach a portal mounted outside that DOM subtree. Use `html` for document-wide consistency.

The helper returns attributes only: it does not mutate the DOM, store preferences or synchronize color mode. Your app owns state and persistence. See [Theming](/docs/theming) for application settings.

## Gradient and refraction

Use [Gradient](/docs/api/gradient) to add a content-colored background. The shared SVG uses a fixed, gentle displacement map stretched to each surface; it does not track individual corner geometry or capture the page. Keep the referenced `liquid-refraction.svg` asset available when processing package CSS. For an explicit decorative background with a map fitted to its size and corners across browsers, use the optional [Liquid component](/docs/components/liquid); it owns the background layer, SVG filter and resize handling.

Direct `data-bolerish-surface="solid"` and `"liquid"` attributes remain supported. `surface.props()` provides the same behavior through a typed API.
