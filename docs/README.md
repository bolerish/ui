# @bolerish/ui documentation

## Run and deploy

The docs application uses TanStack Start, file-based TanStack Router routes and
Cloudflare Workers. From the repository root run `pnpm dev:docs` (port 3000) or
`pnpm build:docs`. From `docs/`, run `pnpm preview` to exercise the built Worker
locally. With preview running, `pnpm test:runtime` verifies every document,
SSR settings, legacy links, missing pages and the client/server bundle boundary.
Use `DOCS_URL` to check another local port. Run `pnpm deploy` to build and deploy with your Cloudflare account.
Run `pnpm test:dev` from `docs/` to check the first SSR requests with an isolated,
empty dependency cache. Markdown-only dependencies are optimized at startup in
both client and SSR environments to avoid a React instance split on late discovery.
The compatibility date is pinned to the installed local Workers runtime.
For Cloudflare Workers Builds with the repository root as its working directory,
use `pnpm build:docs` as the build command and
`pnpm --filter @bolerish/docs exec wrangler deploy` as the deploy command.
This explicitly selects the docs app instead of asking Wrangler to detect a
project at the workspace root.

- `/` and `/ko`: English and Korean home pages with live component and block
  examples in a responsive, variable-height gallery. Each example has a title and documentation link; card height follows its content. There is no configuration sidebar.
  The first three examples render on the server; lower examples load near the viewport.
  Cards keep their content height in CSS columns: three above 1200px, two through
  1200px, and one through 760px. Reading order runs down each column; resizing
  repositions the same elements and preserves example state.
- `/docs/getting-started`, `/docs/components/$slug`, `/docs/foundations/$slug`, `/docs/patterns/$slug`:
  full-document SSR. English is the default; append `/ko` for Korean.
  The loader preloads MDX and its examples together before switching documents.
  Intent preloads and a five-minute cache avoid repeated cold loads.
- `/preview/$example`: standalone server-rendered examples; Toast docs retain
  iframe isolation because their global manager broadcasts to every demo.
- Previous short paths, Storybook links and `?locale=ko` redirect to
  the short localized paths.

The generated `src/routeTree.gen.ts` is committed and excluded from lint/format.
Run the dev server or build after changing route files.

Theme, motion and density are validated and saved in a cookie for SSR and client
navigation. Changing controls does not add preferences to the URL. Explicit URL
preferences still override cookies for shared links. Language follows the path,
not the cookie. System color mode resolves after hydration to keep markup consistent.
Documentation navigation sections are expanded by default and can be collapsed.

Component source references are available through the generated agent API documents,
not appended to component pages. Examples use build-time raw imports, without
runtime filesystem access. Keep deploy-specific configuration in `vite.config.ts`
and `wrangler.jsonc`.

Storybook has been removed. Component examples render inline with code views;
Storybook's addon panel is replaced by browser checks. Run automated accessibility
checks separately when adding interaction patterns.

## Component examples

Keep `docs.mdx` and React examples together in `src/components/{component}/`.
Write the overview and usage text directly in `docs.mdx`, inside
`<LocaleContent locale="ko">` and `<LocaleContent locale="en">` blocks. Keep two
static Markdown blocks per language: overview, then usage. Shared previews stay
outside these blocks; the Markdown exports read the same text for coding agents.
Pass the example's `?raw` import to `ComponentPreview` to display its usage code.
Import components from `@bolerish/ui/{component}` so examples exercise the built package.
Render examples inline by default; their overlays use the same document as the docs.
Use `isolated height={420}` only for Toast demos, which share a global manager.
Documentation and preview canvases use plain theme backgrounds.
Keep preview-only layout in `ComponentPreview` and the isolated preview canvas.
Show only imports, app state and composition needed to use the component in examples.
Use the installed `className`/`style` APIs for simple placement; reserve `xstyle`
for examples that actually demonstrate StyleX customization.

## Foundations

Edit `src/foundations/{topic}/guidelines.md` (English) and `guidelines.kr.md`
(Korean) together.
These files supply localized user documentation. Agent entry points, API links
and full LLM guidelines use the English foundation files and English MDX blocks.

The development and build scripts generate `public/llms.txt`, `llms-full.txt`,
`bolerish-for-llms.md`, and per-topic Markdown. The full LLM
file contains canonical English content; Korean per-topic files remain available
for the user documentation. To regenerate them during development,
run this from `docs/`:

```sh
node --experimental-strip-types scripts/build-guidelines.ts
```

See [translation conventions](src/documentation/locales/README.md).

## Page structure and tables

Foundation selection guides follow: introduction → Selection guidelines → Examples
→ Token reference. Keep topic-specific rules under the guidelines and place cautions
beside the decision they qualify. Accessibility uses Design guidelines; writing
pages use Writing guidelines. Getting Started remains a numbered walkthrough.

Component pages follow: introduction → Basic example → Usage guidelines →
More examples. Keep installation in Getting Started instead of repeating it on
every page. Explain supported variants, sizes and behavior with their defaults
and intended use; do not reproduce component implementations or inherited DOM props.

Use consistent headings for tables with the same purpose:

| Purpose                     | English columns                            | Korean columns                    |
| --------------------------- | ------------------------------------------ | --------------------------------- |
| Select a token or component | Situation / Recommended choice / Code      | 사용 상황 / 권장 선택 / 적용 코드 |
| Compare alternatives        | Situation / Recommended choice / Rationale | 사용 상황 / 권장 선택 / 선택 이유 |
| Check accessibility         | Interaction / Verification                 | 확인할 동작 / 확인 방법           |
| Revise copy                 | Before / After / Rationale                 | 수정 전 / 수정 후 / 수정 이유     |

API, token-value, and typography-specification tables name the properties they
actually describe. Do not force them into the selection-table format. Code cells
show a real property assignment or component usage, not a bare token name.

Wrap component identifiers, prop names, and token references in inline code, such
as `AlertDialogTitle`, `aria-describedby`, and `colorVars.fgPrimary`. Keep ordinary
prose and section titles as text. Explain what content belongs in a slot only when
it affects a decision, accessibility, or recovery; omit sentences that merely
repeat the slot name.

## AI coding-agent references

The same build emits `installation.md` from the root README, `api/*.md` from
component and token source, and `agent/SKILL.md` from the component
catalog. `llms.txt` links these entries. Edit the canonical guides, source types
or README, then regenerate; do not maintain a second API catalog by hand.
The generated skill is a static downloadable entry, not an installed plugin or
MCP service. Consumers must still inspect their installed local source/version.

Run `pnpm --filter @bolerish/docs test:agent` after generating docs to check freshness,
component coverage, reference links and canonical source contents. The UI consumer
Vite test also compiles the README examples against the package APIs. A separate plugin-free Vite consumer checks components, CSS and both themes.

## Motion preview

The toolbar uses the package runtime attribute: System → `system`, Reduce Motion
→ `off`, Allow Motion → `on`. Keep both inline and isolated examples on that
contract instead of rewriting stylesheet media queries.

## Foundations lint

Run `pnpm --filter @bolerish/docs lint` to check documentation TS/TSX sources and
examples with the workspace `@bolerish/eslint-plugin-ui`. The repository lint
command runs the same color, typography and spacing rules. Use tokens for shared
values. Component-relative `em` typography, margins and gaps, and positive
unitless line heights pass directly. Use narrow, reasoned comment exceptions for
other deliberate deviations. Raw CSS and MDX code strings are outside these AST
rules.
