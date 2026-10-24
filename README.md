# bolerish/ui

A React design system built with StyleX: components, tokens, themes and Foundations.

## Quick start

Requires React 19. Install the compiled package:

```sh
npm install @bolerish/ui
pnpm add @bolerish/ui
yarn add @bolerish/ui
bun add @bolerish/ui
```

Load the styles in your app's CSS entry:

```css
@import "@bolerish/ui";
```

```tsx
import { Button } from "@bolerish/ui/button";

export function SaveButton() {
  return <Button>Save</Button>;
}
```

Prebuilt components and themes work without a StyleX compiler. Configure one
when writing your own StyleX styles or token themes.

## Documentation

[Browse the docs](https://ui.bolerish.com) for installation, themes, styling,
components and Foundations. Docs preview the current workspace API;
UI and tokens npm publishing is paused; the lint plugin is released independently.
See the [resumption conditions](.changeset/README.md#uitokens-publication-resumption) before deciding on a release.

The [lint guide](https://ui.bolerish.com/docs/lint) explains the
plugin's ESLint/Oxlint rules and exceptions.
For coding agents, start with [`llms.txt`](https://ui.bolerish.com/llms.txt).

## Development

Use Node 22.13+ for the workspace tooling.

```sh
pnpm install
pnpm dev:docs
pnpm check
pnpm test
pnpm --filter @bolerish/ui exec playwright install chromium
pnpm --filter @bolerish/ui test:browser
pnpm build:docs
```

[Docs development](docs/README.md) · [Lint package](packages/lint/README.md)
· [Release workflow](.changeset/README.md) · [Changelog](CHANGELOG.md)
