---
name: bolerish-ui
description: Use when implementing, changing, or reviewing React interfaces that consume @bolerish/ui, including component selection, styling, interaction states, and accessibility. Does not apply to unrelated UI or imply adopting this library.
---

# bolerish-ui

## Scope

Apply the current bolerish documentation to the requested consumer UI. This is a discovery and application guide; Foundations, component documentation, and installed APIs remain the sources of truth. Preserve the product's task and visual direction.

## Environment

Inspect the consumer's resolved UI/tokens versions, package exports and declarations, existing composition, CSS entry, and server/client boundaries. Read installation and styling guidance before changing integration. Basic consumption uses compiled package CSS without a StyleX compiler; authoring StyleX requires the app's compiler. Preserve user-controlled theme, font, density, and motion settings.

## Source discovery

Use [source-map.md](references/source-map.md) to locate the relevant sources. Read Foundation overview, the affected topics, the component contract, and an original React example before composing or reviewing UI.

When docs MCP is available, start with `get_doc({ id: "guides/agent-workflow" })`, then `search_docs` and `get_doc` for focused references. If the entry is missing, search for actual IDs instead. Compare bundled versions with resolved packages. For absent or stale references, use canonical checkout docs and installed declarations; use the generated documentation index when no checkout is available. Read only supported tool parameters. Follow search pagination when needed.

Installed APIs take precedence over bundled snapshots. Trace inherited props to their installed dependency declarations. If a required contract remains unavailable, identify the gap rather than inventing props or tokens. Do not install or reconfigure MCP as part of applying this skill.

## Composition and styles

Choose components by task and supported props before adding styles. Resolve token names and roles from current sources rather than copying a palette or token catalog here. Reuse existing examples and app composition; state, saving, persistence, and recovery remain app-owned.

Preserve legitimate `className`, `style`, and layout rules. Check the actual styling target. Controls restrict `xstyle` to their declared placement/layout contract; containers may accept broader styles. Put relationships between controls in their owning layout rather than changing control internals. Explain a necessary exception by its missing supported capability and narrow scope.

## States and interactions

Distinguish immediate settings from choices submitted later. Follow State and Feedback for pending, success, failure, empty, invalid, disabled, and overlapping selection/focus states. Preserve input on save failure and offer only recovery actions the app implements.

Keep names, descriptions, errors, keyboard operation, focus return, and announcements connected. Check responsive wrapping, long localized text, zoom, contrast on actual backgrounds, and reduced motion for the affected flow. Adapt layout before shrinking or clipping essential content.

## Verification

Reread changed controls and styles for duplicated component behavior or token values. Discover whether `check_css` is actually available. If present, submit complete relevant CSS blocks as the `css` string, not a filename. Reuse that input with each returned `nextOffset` as `offset` until null; review every diagnostic and unreviewed area. Variables, functions, custom properties, and shorthands need provenance review. Zero diagnostics and `coverage.complete` prove neither semantic roles, contrast, layout, nor rendered behavior. If unavailable, review manually and report the limitation. ESLint/Oxlint does not run this check automatically.

Run applicable consumer checks and verify the changed user flow. Report completed checks, unresolved diagnostics, exceptions, and unverified environments separately. Skill maintenance scenarios are in [forward-tests.md](references/forward-tests.md); they are not evidence of automatic loading or independent agent compliance.
