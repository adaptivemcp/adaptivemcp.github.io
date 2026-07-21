---
description: Install Adaptive MCP, run the adaptation loop locally, and stand up the MCP server + client example. A learning layer over MCP primitives.
---

# Getting Started

This guide walks you through installing Adaptive MCP, running the adaptation
loop locally, and standing up the MCP server + client example.

## Prerequisites

- **Node 22+** (Node 26 recommended)
- **pnpm 11+**

## Install

### From npm

All ten `@adaptivemcp/*` packages are available on npm under the
[`@adaptivemcp` organization](https://www.npmjs.com/org/adaptivemcp). The
core building blocks are `spec`, `memory`, `telemetry`, `evaluation`, and
`extension`; `runtime` wires them into one loop, and `routing`,
`orchestration`, `approval`, and `thin-client` are the client-side executors:

```bash
npm i @adaptivemcp/spec @adaptivemcp/memory @adaptivemcp/telemetry \
      @adaptivemcp/evaluation @adaptivemcp/extension @adaptivemcp/runtime \
      @adaptivemcp/routing @adaptivemcp/orchestration \
      @adaptivemcp/approval @adaptivemcp/thin-client
```

See the [Packages](/packages) page for the current published versions and
per-package responsibilities.

### From source

```bash
git clone https://github.com/kemalelmizan/adaptive-mcp
cd adaptive-mcp
pnpm install
pnpm -r run build      # compile all packages + examples
```

## Adaptation loop

The whole loop (observe, evaluate, derive view) runs locally with no server
or transport. From the repo root:

```bash
cd examples
pnpm quickstart
```

That runs [`examples/src/quickstart.ts`](https://github.com/kemalelmizan/adaptive-mcp/blob/main/examples/src/quickstart.ts),
which feeds a few `deploy_service` calls through the learning loop and prints the
derived `tools-metadata.yaml` view:

```ts
import { MemoryStore } from "@adaptivemcp/memory";
import { TelemetryRecorder, MemoryBackedTelemetryStore } from "@adaptivemcp/telemetry";
import { Evaluator } from "@adaptivemcp/evaluation";
import { ExtensionController } from "@adaptivemcp/extension";

const memory = new MemoryStore();                                   // SQLite store
const telemetry = new TelemetryRecorder({ store: new MemoryBackedTelemetryStore(memory) });
const evaluator = new Evaluator({ memory });
const extension = new ExtensionController({ memory, yamlPath: "tools-metadata.yaml" });

// Observe a realistic stream of calls. The point of the telemetry layer is
// that it learns from *varied* signal — different tools, latency jitter, and
// the occasional failure. A loop that replays the same event 20× teaches the
// evaluator nothing (flat 0% failure rate, flat latency). Here we mix a healthy
// tool, a heavier one, and a deploy that hits a flaky window so the evaluator
// actually has something to learn.
for (let i = 0; i < 40; i++) {
  telemetry.complete({ toolName: "search_customer", serverName: "crm" }, { durationMs: 120 + Math.round(Math.random() * 40) });
}
for (let i = 0; i < 15; i++) {
  telemetry.complete({ toolName: "generate_report", serverName: "analytics" }, { durationMs: 1800 + Math.round(Math.random() * 300), cost: { amount: 0.012, currency: "USD" } });
}
for (let i = 0; i < 25; i++) {
  telemetry.complete({ toolName: "deploy_service", serverName: "demo" }, { durationMs: 900 + Math.round(Math.random() * 150) });
}
// A flaky deploy window: ~40% of these blow up, so the evaluator flags
// deploy_service as flaky and the approval gate will ask for confirmation.
for (let i = 0; i < 15; i++) {
  if (Math.random() < 0.4) {
    telemetry.fail({ toolName: "deploy_service", serverName: "demo" }, { message: "upstream timeout", code: "ETIMEDOUT" }, { durationMs: 1100 });
  } else {
    telemetry.complete({ toolName: "deploy_service", serverName: "demo" }, { durationMs: 1100 });
  }
}
evaluator.evaluateAll();   // store stats → insights → store
extension.sync();          // store → tools-metadata.yaml (and the MCP resource text)
console.log(extension.resourceText());
```

## Usage examples

The pieces below are small, self-contained snippets you can drop into a script
or REPL. They all share the same four building blocks: a `MemoryStore` (the
SQLite store), a `TelemetryRecorder` (observe), an `Evaluator` (learn), and an
`ExtensionController` (derive the view).

### Observe a tool call

```ts
import { MemoryStore } from "@adaptivemcp/memory";
import { TelemetryRecorder, MemoryBackedTelemetryStore } from "@adaptivemcp/telemetry";

const memory = new MemoryStore();
const telemetry = new TelemetryRecorder({
  store: new MemoryBackedTelemetryStore(memory),
});

// Record one completed call (or pass status: "failed" on error).
telemetry.complete(
  { toolName: "deploy_service", serverName: "demo", model: "gpt-5-mini" },
  { durationMs: 900, cost: { amount: 0.002, currency: "USD" } },
  { status: "completed" },
);
```

### Learn from the observations

```ts
import { Evaluator } from "@adaptivemcp/evaluation";

const evaluator = new Evaluator({ memory });
evaluator.evaluateAll();   // folds raw stats into insights in the store
```

### Route to the cheapest viable model

```ts
import { Router } from "@adaptivemcp/routing";

const router = new Router({
  memory,
  models: [
    { id: "gpt-5-mini", costWeight: 1, latencyWeight: 1 },
    { id: "gpt-5", costWeight: 4, latencyWeight: 0.6 },
  ],
  budget: { perToolLimit: 0.05 },
});
router.routeAll();   // writes `model` + `routing` recommendations to the store
```

### Gate a planned tool call

```ts
import { ApprovalGate } from "@adaptivemcp/approval";

const approval = new ApprovalGate({ memory });
const decision = approval.gate("deploy_service");
// → "allow" | "require_confirmation" | "deny"
// based on the human annotation (static risk) and the learned failure rate.
```

### Derive and read the YAML view

```ts
import { ExtensionController } from "@adaptivemcp/extension";

const extension = new ExtensionController({ memory, yamlPath: "tools-metadata.yaml" });
extension.sync();                 // store → tools-metadata.yaml
console.log(extension.resourceText());   // the MCP resource text
```

### Wire it all together

For the full stack (telemetry → evaluation → routing → orchestration →
approval → YAML view) in one object, the examples use `AdaptiveRuntime`
from [`@adaptivemcp/runtime`](https://www.npmjs.com/package/@adaptivemcp/runtime):

```ts
import { AdaptiveRuntime } from "@adaptivemcp/runtime";

const runtime = new AdaptiveRuntime({ yamlPath: "tools-metadata.yaml" });
runtime.observeCompleted({
  toolName: "deploy_service",
  serverName: "demo",
  durationMs: 900,
  status: "completed",
});
const decision = runtime.gate("deploy_service");
runtime.close();
```

## Run the MCP server + client example

```bash
cd examples
pnpm client     # real stdio client that spawns the server and reads the resource
pnpm server     # or start the server alone (blocks on stdio)
```

## Run the scenarios

```bash
cd examples
pnpm scenario            # improvement over time (healthy → flaky → fixed)
pnpm scenario:store       # the store holds the metadata; YAML is derived
pnpm scenario:insights   # telemetry → evaluation → insights
pnpm scenario:annotation # human annotation vs. learned insight
pnpm scenario:adaptive   # full stack: routing + orchestration + approval + thin-client
```

## Build, test, and lint

```bash
pnpm -r run build      # compile all packages + examples
pnpm test              # run the Vitest suite (unit + integration)
pnpm lint              # ESLint
```

`node:sqlite` is loaded via a Vitest alias shim (`vitest.sqlite-shim.mjs`)
because Vite 5.x does not recognize the builtin as external; at runtime Node 26
resolves it natively.
