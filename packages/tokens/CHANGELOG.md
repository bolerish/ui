# @bolerish/tokens

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
