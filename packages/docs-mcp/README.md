# @bolerish/docs-mcp

Read-only MCP tools for bolerish components, APIs, original React examples,
tokens and Foundations. The server uses the official
[MCP TypeScript SDK](https://ts.sdk.modelcontextprotocol.io/v2/serving/stdio)
over stdio. It does not connect to Pen or Figma, generate application code,
or change consumer files.

## Register with your package manager

To use a published release, choose one command to register the server with
Codex. These commands download
and run the CLI without adding it to your app's dependencies.

Requires Node 22.13+ and your chosen package manager. The Yarn command requires
Yarn 2 or later. Bun's runner uses this CLI's Node shebang.

```sh
# npm
codex mcp add bolerish-docs -- npx --yes --package=@bolerish/docs-mcp bolerish-docs-mcp

# pnpm
codex mcp add bolerish-docs -- pnpm --package=@bolerish/docs-mcp dlx bolerish-docs-mcp

# yarn
codex mcp add bolerish-docs -- yarn dlx --package @bolerish/docs-mcp bolerish-docs-mcp

# bun
codex mcp add bolerish-docs -- bunx --package @bolerish/docs-mcp bolerish-docs-mcp
```

The package name and executable name differ, so each command selects the
package explicitly. For other MCP hosts, use the command and arguments after
`--` as the server configuration. Restart or reconnect the host, then check
that `search_docs` and `get_doc` are listed.

Runner references: [npm](https://docs.npmjs.com/cli/v11/commands/npx/),
[pnpm](https://pnpm.io/cli/dlx), [Yarn](https://yarnpkg.com/cli/dlx),
[Bun](https://bun.sh/docs/pm/bunx).

## Use the local build

Requires Node 22.13+ and this repository's pnpm installation. From the
repository root, use pnpm to install the workspace and build the CLI:

```sh
pnpm install
pnpm --filter @bolerish/docs-mcp build
```

Register the built CLI with your MCP host. For Codex, replace the path with
your absolute checkout path:

```sh
codex mcp add bolerish-docs -- node /absolute/path/to/bolerish-ui/packages/docs-mcp/dist/cli.js
```

For hosts that accept `mcpServers` JSON:

```json
{
  "mcpServers": {
    "bolerish-docs": {
      "command": "node",
      "args": ["/absolute/path/to/bolerish-ui/packages/docs-mcp/dist/cli.js"]
    }
  }
}
```

Restart or reconnect the host after registration. Ask it, for example:

> Use bolerish to build an account form. Read the installation and spacing
> guidelines, check Input and Button APIs, then find a matching example.

The local build follows this checkout. Publishing and host registration are
separate actions.

## Tools

- `search_docs`: search the complete reference text. `query` defaults to an
  empty string to list documents. Optional `section` filters `components`,
  `foundations`, `guides`, `api`, `tokens` or `examples`. `limit` is 1–50,
  default 20. `offset` defaults to 0. The response includes total matches,
  document IDs and `nextOffset`; pass it as `offset` to read the next page.
  A null `nextOffset` marks the end.
- `get_doc`: read the full reference using an exact ID from `search_docs`,
  such as `components/button`, `foundations/spacing`, `tokens/semantic` or
  `examples/button/Default`. Unknown IDs return a tool error.

Both tools identify the bundled UI, tokens and lint versions. References are
English. Search matches all whitespace-separated terms without case sensitivity;
it is a text search, not semantic search or translation.

## Source and freshness

The build regenerates the existing canonical Markdown and search catalog with
`docs/scripts/build-guidelines.ts`. It then bundles those references, token and
shared type sources, and the actual colocated `.tsx` example files into
`dist/documents.json`. Examples are not reconstructed from MDX or metadata.

The installed server needs no checkout or network connection at runtime.
Rebuild after changing source documentation, examples, tokens or package versions.
The snapshot follows this checkout; verify the consumer's installed declarations
before selecting props. It does not automatically follow newer npm releases.

## Development

```sh
pnpm --filter @bolerish/docs-mcp typecheck
pnpm test:mcp
pnpm release:status
pnpm pack:check
```

Tests launch the compiled CLI over stdio from outside the checkout, read real
references and example sources, and exercise validation and failed lookups.
Tests and TypeScript sources are excluded from the published artifact.
This package is versioned independently through Changesets.
