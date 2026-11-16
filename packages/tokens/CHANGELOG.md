# @bolerish/tokens

## 1.0.1

No changes in this release.

## 1.0.0

### Minor Changes

- f2a9ba4: Add intermediate neutral colors and refine light/dark text and surface hierarchy. Increase section and page typography to 20/32px while preserving token names and user settings. Review layouts and custom theme overrides when upgrading.

### Patch Changes

- 547ee4a: Refine the existing subtle, floating and overlay shadows with contact and ambient layers in light and dark themes. Token names and component APIs remain unchanged; existing consumers receive the updated appearance without migration.
- 05b0ed6: Emit palette colors as OKLCH instead of HEX, preserving the authored colors and alpha. Consumers reading raw token CSS values must accept OKLCH syntax.
- 5a7219d: Use the bright #e5484d error accent as text over a 12% red fill for destructive actions and error feedback in both themes. This deliberately prioritizes the reference appearance over the 4.5:1 small-text contrast target; check suitability for your product. Other semantic feedback roles retain their values.
- 09caebb: Use subtle 12% tinted information, success and warning feedback backgrounds with readable theme-specific foregrounds and stronger semantic borders. Error feedback also uses a readable theme-specific foreground. The light canvas is now pure white; the dark canvas is unchanged. Existing semantic token names remain compatible and require no migration.

## 0.18.1

No changes in this release.

## 0.18.0

No changes in this release.

## 0.17.0

No changes in this release.

## 0.16.0

No changes in this release.

## 0.15.0

No changes in this release.

## 0.14.0

No changes in this release.

## 0.13.0

### Patch Changes

- 67a2652: Keep the token release aligned with `@bolerish/ui` through their fixed release
  group. Exported token names and runtime CSS variable names remain stable;
  existing token imports require no migration.

  Move palette conversion and generation tools into the token package for
  maintainers. Exclude these authoring tools, colocated tests and test support from
  the published package while retaining the token source exports.
- Make standard surface borders easier to distinguish with black at 10% in light
  mode and white at 12% in dark mode. Existing `strokeDefault` consumers receive
  the revised boundaries without changing imports. Control, focus and interaction
  tokens retain their existing roles and values.
