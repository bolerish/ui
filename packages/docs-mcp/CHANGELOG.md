# @bolerish/docs-mcp

## 0.2.0

### Minor Changes

- ef9c266: Add the read-only `check_css` tool for submitted CSS text, with shared lint diagnostics, source locations, explicit coverage limits and syntax errors. Bundle an agent workflow reference that connects pre-edit API/example lookup to post-edit CSS review and consumer checks. Existing search and document calls remain compatible. Reconnect the MCP host to discover the new tool; it does not scan files, load CSS imports, edit source or certify interface correctness.
- fa0b958: Add explicit task-phrase search with match reasons and related examples, original heading selection and outlines, and document bundle identity metadata. Existing full-document calls remain supported; no migration is required.

### Patch Changes

- 5a7219d: Update Surface and Card guidance for the stronger frosted material, and document the reference-matched soft error appearance and its small-text contrast limitation.
- 559264c: Remove the Liquid component from document discovery and update Surface references and examples for solid and glass, including migration guidance for removed APIs.
- dde07c1: Update material guidance for content panels that now follow the Glass setting, and show the shared Field layout in the profile Dialog example so its label and input retain the standard gap.
- cab2135: Explain the separate page-backdrop and panel-material blur in Glass mode, including nested modal and accessibility fallbacks.
- eaf20fd: Include up to five searchable document suggestions when get_doc receives an unknown ID. Errors and exact-ID lookup remain unchanged; callers can retry with a suggested ID without a migration.
- Updated dependencies [ef9c266]
- Updated dependencies [f3c1106]
  - @bolerish/lint@0.3.0

## 0.1.0

### Minor Changes

- 8eb08a0: Add a read-only stdio MCP server that searches and retrieves bundled component APIs, original React examples, tokens and Foundations guidance. Responses identify the source package versions; installed declarations take precedence. This is an independently versioned package and does not change UI or token APIs. Register the CLI with your MCP host using npm, pnpm, Yarn or Bun, or use a local build.
