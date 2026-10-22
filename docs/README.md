# @bolerish/ui documentation

## Component examples

Keep `docs.mdx` and React examples together in `src/components/{component}/`.
Write the overview and usage text directly in `docs.mdx`, inside
`<LocaleContent locale="ko">` and `<LocaleContent locale="en">` blocks. Keep two
static Markdown blocks per language: overview, then usage. Shared previews stay
outside these blocks; the Markdown exports read the same text for coding agents.
Pass the example's `?raw` import to `ComponentPreview` to display its usage code.
Import components from `@bolerish/ui/{component}` so examples exercise the built package.
Use `isolated height={360}` for examples that need an overlay boundary.
Keep preview-only layout in `ComponentPreview` and the isolated preview canvas.
Show only imports, app state and composition needed to use the component in examples.
Use the installed `className`/`style` APIs for simple placement; reserve `xstyle`
for examples that actually demonstrate StyleX customization.

## Foundations

Edit `src/foundations/{topic}/guidelines.md` and `guidelines.en.md` together.
These files supply localized user documentation. Agent entry points, API links
and full LLM guidelines use the English foundation files and English MDX blocks.

The development and build scripts generate `public/llms.txt`, `llms-full.txt`,
`bolerish-for-llms.md`, and per-topic Markdown. The full LLM
file contains canonical English content; Korean per-topic files remain available
for the user documentation. To regenerate them during development,
run this from `docs/`:

```sh
node scripts/build-guidelines.mjs
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
