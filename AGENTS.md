# AGENTS.md

Project-specific guidance for AI coding agents.

## Changelog

Write user-facing package changes once in `.changeset/*.md`. Each entry should
cover one package and describe the resulting behavior, compatibility and any
required migration. Do not duplicate entries in the root `CHANGELOG.md`.

Changesets generates package `CHANGELOG.md` files during version preparation.
Commit the consumed changeset deletions with the generated logs, manifests and
lockfile. The root changelog only links to package logs and preserves historical
releases. Documentation-app-only changes do not require an npm package changeset.

## Package versions

Use Changesets for package changes. UI and tokens are a fixed release group;
the UI lint plugin is independent. Docs and the root workspace are private apps.
Run `pnpm release:status` to review the plan and `pnpm version:packages` to prepare
versions and the lockfile. Version preparation does not authorize publishing.
See `.changeset/README.md` for compatibility rules and the release procedure.

## UI composition

Before creating or changing screens, read
`docs/src/shared/ui/docs/foundations/overview/guidelines.md` and the relevant topic's
`guidelines.md` in `docs/src/shared/ui/docs/foundations/`. Use these rules for component choice,
semantic tokens, layout, states, accessible interactions, and interface copy.
Verify names and supported props against the component source; documentation
does not authorize inventing APIs. State any necessary exception.
Foundation `guidelines.md` files are English; Korean translations use `guidelines.kr.md`.

Documentation examples live beside each component's `docs.mdx` as ordinary
React files. Display their actual source with `?raw`; do not reconstruct code
from Storybook metadata or regular expressions.

## Tests

Keep tests beside the implementation they verify, including component tests
that exercise compiled output. Put shared styling checks beside shared styles,
package distribution/type contracts beside the package manifest, and whole-site
runtime checks in `docs/test/`. Release policy tests live beside
`.changeset/config.json`. Exclude colocated tests from production compilation
and published artifacts.

Write expectations from the intended public behavior and run the code through its
real boundary. Do not copy implementation logic into tests or use source-text
matches as evidence that behavior works. Keep necessary file/export conventions
separate from runtime assertions.

When adding or changing tests for non-trivial logic, check whether targeted,
intentional defects are detected in an isolated copy or with a mutation tool.
Report detected, surviving, compile-invalid and unexecuted cases separately.
Investigate survivors for missing branches and boundary inputs; document equivalent
or non-behavioral mutations instead of chasing a 100% score. Passing tests and
mutation checks do not establish that the requirements themselves are correct.

Reference: [AI-generated tests and mutation testing](https://velog.io/@k-svelte-master/ai-generated-tests-mutation-testing).
