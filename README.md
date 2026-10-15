# adaptivemcp.github.io

Source of **[adaptivemcp.dev](https://adaptivemcp.dev)** — the documentation site
for [Adaptive MCP](https://github.com/kemalelmizan/adaptive-mcp), a learning
layer over MCP primitives.

Built with [VitePress](https://vitepress.dev) plus the
`vitepress-plugin-mermaid` plugin; the Execution Graph Explorer page ships a
small D3 component (`docs/.vitepress/theme/GraphExplorer.vue`).

## Layout

| Path | What it is |
| --- | --- |
| `docs/index.md` | Home page (hero + adaptation-loop overview) |
| `docs/guide/getting-started.md` | Install, run the loop locally, examples |
| `docs/guide/architecture.md` | The event → store → derived YAML loop and design constraints |
| `docs/guide/extension.md` | The `dev.adaptivemcp/tools-metadata` resource (SEP-2133) |
| `docs/guide/graph-explorer.md` | Interactive execution-graph explorer |
| `docs/packages.md` | Published `@adaptivemcp/*` packages (**tables are generated — see below**) |
| `docs/examples.md` | Runnable tour of every package and scenario |
| `docs/public/` | Static assets: `CNAME`, `llms.txt`, `robots.txt`, sample graph JSON |
| `docs/.vitepress/` | Site config, custom theme, `GraphExplorer.vue` |
| `scripts/sitemap.mjs` | Post-build sitemap generator (no external deps) |
| `.github/workflows/deploy.yml` | GitHub Pages deploy on push to `main` |

## Local development

Requires **Node 22+** and **pnpm 11+**.

```bash
pnpm install
pnpm docs:dev       # local dev server with hot reload
pnpm docs:build     # production build to docs/.vitepress/dist
pnpm docs:preview   # preview the production build locally
pnpm docs:sitemap   # generate sitemap.xml (run after docs:build)
```

## Editing rules

- **`docs/packages.md` is partially generated.** The two tables between the
  `<!-- packages:published:... -->` and `<!-- packages:responsibilities:... -->`
  marker comments are regenerated from each package's `package.json` by
  `pnpm docs` (the `docs` script) in the
  [`adaptive-mcp`](https://github.com/kemalelmizan/adaptive-mcp) repo, which
  writes into this repo. Edit the source `package.json` /
  `PUBLISHABLE_PACKAGES` there — not the generated rows. Prose around the
  markers is hand-written here.
- **New pages need a sitemap entry.** `scripts/sitemap.mjs` keeps an explicit
  `ROUTES` list; add new pages there so they appear in `sitemap.xml`.
- **Internal links use `cleanUrls`** (no `.html` suffix); the nav/sidebar
  lives in `docs/.vitepress/config.mts`.

## Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`, which builds the site,
generates the sitemap, and publishes to GitHub Pages. The custom domain
(`adaptivemcp.dev`) is pinned by `docs/public/CNAME`.

## Related repositories

- [`kemalelmizan/adaptive-mcp`](https://github.com/kemalelmizan/adaptive-mcp) — the packages, examples, SEP, and release flow
- [`adaptivemcp/agent`](https://github.com/adaptivemcp/agent) — the product implementation (CLI/TUI agent)
- [`adaptivemcp/qc`](https://github.com/adaptivemcp/qc) — QueryCleaner, a third-party MCP server publishing the `tools-metadata` resource
