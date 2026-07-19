# The `tools-metadata` Extension Resource

MCP formalizes the **server** contract and lets the server **govern** how clients
interact with its primitives, the same direction as the **Prompts** primitive
(server authors, client discovers and applies). Adaptive MCP adopts that pattern:
the server **governs** tool adaptation by publishing policy, and the client is
the **executor** that learns dynamically and reports observations back.

Adaptive MCP proposes a **narrow, server-governed** extension, a single resource
the server publishes so clients can read (and report against) learned tool
metadata. The proposal (draft) lives at
[`docs/sep-2133-tools-metadata.md`](https://github.com/kemalelmizan/adaptive-mcp/blob/main/docs/sep-2133-tools-metadata.md).

| Field | Value |
| --- | --- |
| URI | `dev.adaptivemcp/tools-metadata` |
| MIME type | `application/yaml` |
| Scope | server governance (annotations, budgets, required approvals) + client-reported observations |

The `dev.adaptivemcp/` prefix is the reversed domain of `adaptivemcp.dev` (owned
by the author), using the reversed-domain namespace convention. The client learning
machinery (`@adaptivemcp/telemetry`, `evaluation`, `routing`, `orchestration`,
`approval`, `thin-client`) is the **executor** of this policy, not part of the
extension's server contract.

The derived YAML view is exposed as the MCP resource
`dev.adaptivemcp/tools-metadata` (mime type `application/yaml`).

## Advertising the extension in `initialize`

The `@modelcontextprotocol/sdk` (v1.29) includes `extensions` in its
`ServerCapabilities` schema, so a server can advertise the extension in
`initialize` via `capabilities.extensions`. Adaptive MCP's example server does
**not** rely on that negotiation. It exposes the metadata as a plain
resource via `server.registerResource(...)`, the standard MCP approach that
degrades gracefully on any host that ignores unknown resources:

- the resource is registered directly via `server.registerResource(...)`;
- the `EXTENSION_NAMESPACE` / `TOOLS_METADATA_EXTENSION` constants in
  `@adaptivemcp/spec` provide the canonical identifier for any host that wants to
  advertise it through `capabilities.extensions`.

When a server wants to advertise it explicitly, it can pass the capability:

```ts
// conceptual: advertise the extension in initialize
const server = new McpServer({ name: "adaptive-example", version: "0.1.0" });
server.registerResource("tools-metadata", "dev.adaptivemcp/tools-metadata", {
  title: "Adaptive MCP Tools Metadata",
  mimeType: "application/yaml",
}, async (uri) => ({ contents: [{ uri: uri.href, mimeType: "application/yaml", text: runtime.extension.resourceText() }] }));
// and advertise in initialize:
// capabilities: { extensions: { "dev.adaptivemcp/tools-metadata": {} } }
```

## Graceful degradation

Because the resource is registered through the standard MCP resource mechanism,
any host that does not understand `dev.adaptivemcp/` simply ignores it. Clients
that do understand it read the YAML, apply the learned metadata, and report
observations back into their local SSOT. No changes to MCP itself are required.
