# Packages

Adaptive MCP publishes its core libraries under the
[`@adaptivemcp` npm organization](https://www.npmjs.com/org/adaptivemcp). The
packages are dependency-light and follow the same boundaries as the
[architecture](/guide/architecture).

> **Version note.** Versions below reflect the current state of the repository
> (`main`). Published versions on npm may lag behind; always check the badge for
> the live published version. The four executor packages are **private** and are
> not published to npm.

## Published (`@adaptivemcp/*`)

These five are the **published** set (see `PUBLISHABLE_PACKAGES` in
[`scripts/lib/workspace.ts`](https://github.com/kemalelmizan/adaptive-mcp/blob/main/scripts/lib/workspace.ts)),
released with the
[`scripts/release.ts`](https://github.com/kemalelmizan/adaptive-mcp/blob/main/scripts/release.ts)
flow (see [`docs/RELEASE.md`](https://github.com/kemalelmizan/adaptive-mcp/blob/main/docs/RELEASE.md)
for the full release runbook).

| Package | Version | Install | Description |
| --- | --- | --- | --- |
| `@adaptivemcp/spec` | [![npm](https://img.shields.io/npm/v/@adaptivemcp/spec)](https://www.npmjs.com/package/@adaptivemcp/spec) `0.1.1` | `npm i @adaptivemcp/spec` | Extension identifiers (`dev.adaptivemcp/` reversed-domain namespace), event schemas, and shared types. |
| `@adaptivemcp/memory` | [![npm](https://img.shields.io/npm/v/@adaptivemcp/memory)](https://www.npmjs.com/package/@adaptivemcp/memory) `0.2.1` | `npm i @adaptivemcp/memory` | Persistent operational knowledge backed by SQLite (`node:sqlite`), the SSOT. |
| `@adaptivemcp/telemetry` | [![npm](https://img.shields.io/npm/v/@adaptivemcp/telemetry)](https://www.npmjs.com/package/@adaptivemcp/telemetry) `0.1.1` | `npm i @adaptivemcp/telemetry` | Tool execution events and observability (recorder + memory-backed store). |
| `@adaptivemcp/evaluation` | [![npm](https://img.shields.io/npm/v/@adaptivemcp/evaluation)](https://www.npmjs.com/package/@adaptivemcp/evaluation) `0.2.1` | `npm i @adaptivemcp/evaluation` | Outcome scoring and feedback loops; emits `observed_failure_rate` / `avg_duration_ms` insights. |
| `@adaptivemcp/extension` | [![npm](https://img.shields.io/npm/v/@adaptivemcp/extension)](https://www.npmjs.com/package/@adaptivemcp/extension) `0.2.1` | `npm i @adaptivemcp/extension` | Derives the YAML `tools-metadata` view from the SSOT and serves it as the `dev.adaptivemcp/tools-metadata` MCP resource. |

## Private (not published)

`routing`, `orchestration`, `approval`, and `thin-client` are implemented but
kept private for now. They are the client-side **executor** of the policy the
server governs, and their APIs are still stabilizing. `examples` and `apps` are
runnable demos, not libraries.

| Package | Version | Responsibility |
| --- | --- | --- |
| `@adaptivemcp/routing` | `0.0.2` | `Router`: model selection + budget guardrails. |
| `@adaptivemcp/orchestration` | `0.0.2` | `Orchestrator`: retry-policy (`workflow`) recommendations. |
| `@adaptivemcp/approval` | `0.0.2` | `ApprovalGate`: enforcement (allow / deny / require_confirmation). |
| `@adaptivemcp/thin-client` | `0.0.2` | `ThinClient`: client-side execution loop with gate + retry. |

## Responsibilities at a glance

| Package | Responsibility |
| --- | --- |
| `@adaptivemcp/spec` | Extension identifiers (`dev.adaptivemcp/` reversed-domain namespace), event schemas, shared types |
| `@adaptivemcp/memory` | SQLite SSOT store (`MemoryStore`) over `node:sqlite` |
| `@adaptivemcp/telemetry` | `TelemetryRecorder` + memory-backed store + stat queries |
| `@adaptivemcp/evaluation` | `Evaluator` emits `observed_failure_rate` / `avg_duration_ms` insights |
| `@adaptivemcp/extension` | `ExtensionController` derives + writes the YAML view and exposes the MCP resource |
| `@adaptivemcp/routing` | `Router`: model selection + budget guardrails |
| `@adaptivemcp/orchestration` | `Orchestrator`: retry-policy (`workflow`) recommendations |
| `@adaptivemcp/approval` | `ApprovalGate`: enforcement (allow / deny / require_confirmation) |
| `@adaptivemcp/thin-client` | `ThinClient`: client-side execution loop with gate + retry |

## What's next

- Promote `routing`, `orchestration`, `approval`, and `thin-client` to published
  packages once their APIs settle.
- Multi-server aggregation: merge `tools-metadata` across servers into one view.
- More insight types: cost drift, latency regression, and approval friction.
