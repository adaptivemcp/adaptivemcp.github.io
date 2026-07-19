---
description: The published @adaptivemcp/* packages — generated from each package.json by `pnpm docs`.
---

# Packages

Adaptive MCP publishes its core libraries under the
[`@adaptivemcp` npm organization](https://www.npmjs.com/org/adaptivemcp). The
packages are dependency-light and follow the same boundaries as the
[architecture](/guide/architecture).

> **Version note.** The version column is a live badge resolved from npm at
> render time, so it always reflects the published version. The package list and
> descriptions are generated from each `package.json` by `pnpm docs` — edit the
> source, not this file.

## Published (`@adaptivemcp/*`)

All packages below are published to npm (see `PUBLISHABLE_PACKAGES` in
[`scripts/lib/workspace.ts`](https://github.com/kemalelmizan/adaptive-mcp/blob/main/scripts/lib/workspace.ts)),
released with the
[`scripts/release.ts`](https://github.com/kemalelmizan/adaptive-mcp/blob/main/scripts/release.ts)
flow (see [`docs/RELEASE.md`](https://github.com/kemalelmizan/adaptive-mcp/blob/main/docs/RELEASE.md)
for the full release runbook).

<!-- packages:published:start -->
| Package | Version | Install | Description |
| --- | --- | --- | --- |
| `@adaptivemcp/spec` | [![npm](https://img.shields.io/npm/v/@adaptivemcp/spec)](https://www.npmjs.com/package/@adaptivemcp/spec) | `npm i @adaptivemcp/spec` | Extension identifiers, event schemas, and shared types for Adaptive MCP. |
| `@adaptivemcp/memory` | [![npm](https://img.shields.io/npm/v/@adaptivemcp/memory)](https://www.npmjs.com/package/@adaptivemcp/memory) | `npm i @adaptivemcp/memory` | Persistent operational knowledge for Adaptive MCP, backed by SQLite (node:sqlite). |
| `@adaptivemcp/telemetry` | [![npm](https://img.shields.io/npm/v/@adaptivemcp/telemetry)](https://www.npmjs.com/package/@adaptivemcp/telemetry) | `npm i @adaptivemcp/telemetry` | Tool execution events and observability for Adaptive MCP. |
| `@adaptivemcp/evaluation` | [![npm](https://img.shields.io/npm/v/@adaptivemcp/evaluation)](https://www.npmjs.com/package/@adaptivemcp/evaluation) | `npm i @adaptivemcp/evaluation` | Outcome scoring and feedback loops for Adaptive MCP. |
| `@adaptivemcp/extension` | [![npm](https://img.shields.io/npm/v/@adaptivemcp/extension)](https://www.npmjs.com/package/@adaptivemcp/extension) | `npm i @adaptivemcp/extension` | Adaptive MCP extension: derives the YAML tools-metadata view from the SQLite store and serves it to MCP clients. |
| `@adaptivemcp/runtime` | [![npm](https://img.shields.io/npm/v/@adaptivemcp/runtime)](https://www.npmjs.com/package/@adaptivemcp/runtime) | `npm i @adaptivemcp/runtime` | Batteries-included Adaptive MCP runtime: wires telemetry, evaluation, routing, orchestration, approval, and the extension into one transport-agnostic loop. |
| `@adaptivemcp/routing` | [![npm](https://img.shields.io/npm/v/@adaptivemcp/routing)](https://www.npmjs.com/package/@adaptivemcp/routing) | `npm i @adaptivemcp/routing` | Model selection and cost optimization for Adaptive MCP. |
| `@adaptivemcp/orchestration` | [![npm](https://img.shields.io/npm/v/@adaptivemcp/orchestration)](https://www.npmjs.com/package/@adaptivemcp/orchestration) | `npm i @adaptivemcp/orchestration` | Composition and execution strategies for Adaptive MCP. |
| `@adaptivemcp/approval` | [![npm](https://img.shields.io/npm/v/@adaptivemcp/approval)](https://www.npmjs.com/package/@adaptivemcp/approval) | `npm i @adaptivemcp/approval` | Intent, plan, and tool approval boundaries for Adaptive MCP. |
| `@adaptivemcp/thin-client` | [![npm](https://img.shields.io/npm/v/@adaptivemcp/thin-client)](https://www.npmjs.com/package/@adaptivemcp/thin-client) | `npm i @adaptivemcp/thin-client` | Minimal client-side execution loop for Adaptive MCP. |
<!-- packages:published:end -->

## Responsibilities at a glance

<!-- packages:responsibilities:start -->
| Package | Responsibility |
| --- | --- |
| `@adaptivemcp/spec` | Extension identifiers, event schemas, and shared types for Adaptive MCP. |
| `@adaptivemcp/memory` | Persistent operational knowledge for Adaptive MCP, backed by SQLite (node:sqlite). |
| `@adaptivemcp/telemetry` | Tool execution events and observability for Adaptive MCP. |
| `@adaptivemcp/evaluation` | Outcome scoring and feedback loops for Adaptive MCP. |
| `@adaptivemcp/extension` | Adaptive MCP extension: derives the YAML tools-metadata view from the SQLite store and serves it to MCP clients. |
| `@adaptivemcp/runtime` | Batteries-included Adaptive MCP runtime: wires telemetry, evaluation, routing, orchestration, approval, and the extension into one transport-agnostic loop. |
| `@adaptivemcp/routing` | Model selection and cost optimization for Adaptive MCP. |
| `@adaptivemcp/orchestration` | Composition and execution strategies for Adaptive MCP. |
| `@adaptivemcp/approval` | Intent, plan, and tool approval boundaries for Adaptive MCP. |
| `@adaptivemcp/thin-client` | Minimal client-side execution loop for Adaptive MCP. |
<!-- packages:responsibilities:end -->

## What's next

- Multi-server aggregation: merge `tools-metadata` across servers into one view.
- More insight types: cost drift, latency regression, and approval friction.
