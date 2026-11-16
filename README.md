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
Set `data-bolerish-theme="light"` or `data-bolerish-theme="dark"` on `html`
to select a built-in theme, including its `color-scheme`.

## Documentation

[Browse the docs](https://ui.bolerish.com) for installation, themes, styling,
components and Foundations. Docs follow the current workspace API; check the
installed package changelog when upgrading. Automatic npm publishing remains
disabled; manual releases require verification and explicit approval.
See the [release conditions](.changeset/README.md#uitokens-publication-resumption).

The [lint guide](https://ui.bolerish.com/docs/lint) explains the
plugin's ESLint/Oxlint rules and exceptions.
For coding agents, start with [`llms.txt`](https://ui.bolerish.com/llms.txt).
The [documentation MCP](https://ui.bolerish.com/docs/mcp) provides read-only search
and retrieval of bundled APIs, examples, tokens and guidelines from a local CLI.

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

### Verification workflow

Lefthook checks staged files before commits, running lint and formatting in
parallel. Before a push it runs the workspace type checks.

`verify.yml` selects the PR scope, runs static/unit checks and collects the final
`verify` result. Reusable `verify-ui.yml` and `verify-docs.yml` own browser and docs
verification; the local setup action installs the pinned workspace tools.
Documentation is built once. Its static assets, generated public references and
compiled UI are shared with two browser shards and the static, HTTP, agent and
dev contract job. These consumers do not rebuild the documentation or UI.

PRs changing only the root README or repository skill Markdown skip browser
jobs; static checks and unit tests still run. These paths do not hide other
changes in a mixed PR. PRs changing documentation Markdown/MDX or lint/docs-MCP
skip UI browsers.
When every changed file is a document's `docs.mdx` or a guide MDX, the expensive
responsive page sweep visits only those documents and the home page, retaining
all viewport/language/theme combinations. Other browser interaction tests still
run. Shared code, examples, assets, configuration and unknown paths retain full
page coverage. Removed or unknown document routes also fall back to full coverage.
Merge-queue checks, main pushes, manual Verify runs and local tests always use full coverage unless
an explicit route selection is supplied. Each selected job must pass. New PR commits
cancel older runs for that PR; main, manual and merge-queue runs remain independent.
UI and docs browsers use four isolated workers in CI; local runs retain their
existing worker counts. Static
checks and documentation builds run directly on the runner without a browser container.
The merge-group trigger supports full verification in a merge queue; repository
branch rules must separately require that queue before merging.

Run the selection tests locally with:

```sh
node --experimental-strip-types --test scripts/ci-scope.test.ts docs/test/responsive-routes.test.ts
```
