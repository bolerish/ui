# @bolerish/eslint-plugin-ui

## 0.1.1

### Patch Changes

- 67a2652: Provide the private workspace preview of Foundations lint guidance with the
  `bolerish-ui/color-tokens`, `bolerish-ui/typography-tokens` and
  `bolerish-ui/spacing-tokens` rules. Inspect literal values in imported
  `stylex.create()` calls and JSX inline styles, including nested states and
  conditional branches. Diagnostics name the CSS property, recommend the matching
  token family and link to its Foundation guidance.
  
  Use the recommended preset or individual color, typography and spacing presets.
  Rules default to warnings and support individual overrides and standard line,
  next-line, region and file comment exceptions in ESLint and Oxlint. Resolve
  import aliases and shadowing, avoid reporting unrelated local data or another
  library's `create` calls, and safely skip unsupported TypeScript import-equals
  bindings.
  
  Ship compiled JavaScript and TypeScript declarations with no runtime dependencies,
  and expose shared rule metadata through `@bolerish/eslint-plugin-ui/foundations`.
  The supported Node baseline is 22; ESLint integration targets version 9 and TSX
  parsing remains the consuming project's responsibility. No autofix, Biome adapter
  or inference of semantic roles from arbitrary variable references is included.
  
  The package remains private and unpublished. Use a workspace dependency or a
  locally packed archive for evaluation; this change does not make it available
  for installation from the npm registry.
  
  Recognize component-relative `em` font sizes, margins and gaps, and positive
  unitless line heights without suppression comments. Keep reporting raw colors,
  fixed font dimensions, numeric layout spacing and negative numeric margins.
  
  Check shared UI `.ts` styles as well as `.tsx` components in the workspace.
  Accept relative margin and gap shorthands without suppressing fixed dimensions
  or unsupported component counts.
