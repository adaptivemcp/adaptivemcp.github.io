# Getting Started

This guide walks you through installing Adaptive MCP, running the adaptation
loop locally, and standing up the MCP server + client example.

## Prerequisites

- **Node 26** — the built-in `node:sqlite` module is available without the
  `--experimental-sqlite` flag. No LTS, no other Node versions.
- **pnpm 11.14.0** (pinned via the repo's `packageManager` field).

## Install and build

```bash
git clone https://github.com/kemalelmizan/adaptive-mcp
cd adaptive-mcp
pnpm install
pnpm -r run build
```

## See the adaptation loop in one command

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

const memory = new MemoryStore();                                   // SQLite SSOT
const telemetry = new TelemetryRecorder({ store: new MemoryBackedTelemetryStore(memory) });
const evaluator = new Evaluator({ memory });
const extension = new ExtensionController({ memory, yamlPath: "tools-metadata.yaml" });

for (let i = 0; i < 20; i++) {
  telemetry.complete({ toolName: "deploy_service", serverName: "demo" }, { durationMs: 900 });
}
evaluator.evaluateAll();   // SSOT stats → insights → SSOT
extension.sync();          // SSOT → tools-metadata.yaml (and the MCP resource text)
console.log(extension.resourceText());
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
pnpm scenario:ssot       # SSOT is the source of truth; YAML is derived
pnpm scenario:insights   # telemetry → evaluation → insights
pnpm scenario:annotation # human annotation vs. learned insight
pnpm scenario:adaptive   # full stack: routing + orchestration + approval + thin-client
```

## Install the published packages

The five published libraries are available on npm under the
[`@adaptivemcp` organization](https://www.npmjs.com/org/adaptivemcp):

```bash
npm i @adaptivemcp/spec @adaptivemcp/memory @adaptivemcp/telemetry \
      @adaptivemcp/evaluation @adaptivemcp/extension
```

See the [Packages](/packages) page for the current published versions and
per-package responsibilities.

## Build, test, and lint

```bash
pnpm install
pnpm -r run build      # compile all packages + examples
pnpm test              # run the Vitest suite (unit + integration)
pnpm lint              # ESLint
```

`node:sqlite` is loaded via a Vitest alias shim (`vitest.sqlite-shim.mjs`)
because Vite 5.x does not recognize the builtin as external; at runtime Node 26
resolves it natively.
