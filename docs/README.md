# Docs development

TanStack Start renders the known routes at build time. Production serves only
`dist/client` through Cloudflare Static Assets; there is no request-time React
server. Vite retains SSR for development.

## Commands

From the repository root:

```sh
pnpm dev:docs
pnpm build:docs
pnpm --filter @bolerish/docs preview
pnpm --filter @bolerish/docs run deploy
```

Development and preview use port 3000; stop one before starting the other.
Deployment requires Cloudflare authentication. For Workers Builds, use
`pnpm build:docs` followed by
`pnpm --filter @bolerish/docs exec wrangler deploy --config wrangler.jsonc`.
Keep static asset routing in `wrangler.jsonc` and prerendering in `vite.config.ts`.

## Source layout

```text
src/
  app/
    __root.tsx
    (site)/
      page.tsx
      _components/
      _lib/
      docs/
        $guide/page.tsx
        $section/$slug/{-$locale}/page.tsx
        _components/
        _lib/
        _content/
        _config/locales/
    preview/$example/page.tsx
  shared/
    lib/
    model/
    styles/
```

Routes use nested `page.tsx` files and TanStack's `__root.tsx`/`$param` conventions.
Auxiliary folders are excluded from route discovery. Keep page-specific code
near its route; `shared` must not import app internals. Tests follow their owners.

`@/` maps to `docs/src/` in TypeScript and Vite. Use it across directories and
relative imports for adjacent files and Node-run tools/tests. Import UI through
`@bolerish/ui` public subpaths. The generated `app/routeTree.gen.ts` is committed;
rebuild after route changes.

## Edit documentation

Keep `docs.mdx` and its React examples together in
`src/app/(site)/docs/_content/components/{name}/`. Pass actual `?raw` source to
`ComponentPreview`. Use two static `LocaleContent` blocks per language for the
overview and usage text; shared previews stay outside them.

Package guides live in `_content/guides/`. Add their entry to `_lib/catalog.ts`.
Foundations use `guidelines.md` for English and `guidelines.kr.md` for Korean.
[Translation conventions](<src/app/(site)/docs/_config/locales/README.md>) cover
prose and token descriptions. Verify props against the package source.

Examples render inline. Use isolated previews only when shared global behavior
requires a separate document, such as Toast. Keep example imports, state and
composition runnable; avoid documentation-specific code in displayed examples.

## Runtime behavior

English uses `/` and `/docs/...`; Korean appends `/ko`. Unknown paths return
HTTP 404. `_redirects` handles old short paths; Storybook and locale query links
resolve in the browser. The 404 document has a working docs link and no hydration.

Browser settings persist in a cookie. Explicit URL values take precedence;
language follows the path. A head script applies color mode before React loads.
Home examples load as one group and retain content height in responsive columns.

## Generated files and checks

Build/dev generates localized Markdown, search JSON, `llms.txt`, `llms-full.txt`,
`api/*.md`, `agent/SKILL.md`, robots and sitemap from the canonical docs/source.
`installation.md` comes from the root README. Generated files are not edited by
hand. `shared/lib/site.ts` defines canonical and sitemap origin.

```sh
pnpm check
pnpm --filter @bolerish/docs test:agent
pnpm --filter @bolerish/docs test:static
pnpm --filter @bolerish/docs test:dev
```

After starting the built preview, run `pnpm --filter @bolerish/docs test:runtime`.
Set `DOCS_URL` for another local port or deployment. The workspace Foundations
lint runs on docs TS/TSX with `pnpm --filter @bolerish/docs lint`; see the
[lint guide](https://ui.bolerish.com/docs/lint) for rules and exceptions.
