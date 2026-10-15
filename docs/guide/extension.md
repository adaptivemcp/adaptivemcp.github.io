---
description: The dev.adaptivemcp/tools-metadata MCP resource — a narrow, server-governed extension that publishes learned tool metadata and degrades gracefully.
---

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
| Extension identifier | `dev.adaptivemcp/tools-metadata` (scheme-less, per SEP-2133 naming) |
| Resource URI (wire) | `dev.adaptivemcp://tools-metadata` (the identifier with a `://` URI scheme) |
| MIME type | `application/yaml` |
| Scope | server governance (annotations, budgets, required approvals) + client-reported observations |

The `dev.adaptivemcp/` prefix is the reversed domain of `adaptivemcp.dev` (owned
by the author), using the reversed-domain namespace convention. The client learning
machinery (`@adaptivemcp/telemetry`, `evaluation`, `routing`, `orchestration`,
`approval`, `thin-client`) is the **executor** of this policy, not part of the
extension's server contract.

The derived YAML view is exposed as the MCP resource
`dev.adaptivemcp://tools-metadata` (mime type `application/yaml`). A server that
publishes it declares per-tool policy in the document — risk level and
`require_approval` — and the client reads that as a **floor**: server-governed
policy can only raise a gate, never lower it.

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

When a server wants to advertise it explicitly, it can pass the capability
under the extension identifier, and register the resource under its wire URI:

```ts
import { TOOLS_METADATA_RESOURCE_URI } from "@adaptivemcp/spec";

// conceptual: advertise the extension in initialize
const server = new McpServer({ name: "adaptive-example", version: "0.1.0" });
server.registerResource("tools-metadata", TOOLS_METADATA_RESOURCE_URI, {
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
observations back into their local store. No changes to MCP itself are required.

## Adoption

The extension is published by a real third-party server and consumed by a real
client:

- **QC** (QueryCleaner) — a Python MCP server that publishes
  `dev.adaptivemcp://tools-metadata` with per-tool policy (risk level and
  `require_approval`) derived from its own operation model. It advertises the
  resource by existence via `resources/list` rather than
  `capabilities.extensions`, the same graceful-degradation approach the example
  server uses. (QC is not yet public; its repository is private during
  pre-release.)
- **The [Adaptive MCP agent](https://github.com/adaptivemcp/agent)** — reads the
  server's tools-metadata via `--server-policy` and applies it as a **floor**:
  server-governed policy can raise a gate (e.g. force `require_approval` on a
  destructive tool) but never lower one the client's own learned metadata or
  host configuration has already set.
