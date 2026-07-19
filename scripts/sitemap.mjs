// Generates docs/.vitepress/dist/sitemap.xml from the built pages.
// Run after `vitepress build`. No external deps required.
import { readdirSync, statSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const SITE_URL = "https://adaptivemcp.dev";
const DIST = resolve("docs/.vitepress/dist");

// Pages that exist as top-level routes. VitePress emits index.html per route.
const ROUTES = [
  "/",
  "/guide/getting-started",
  "/guide/architecture",
  "/guide/extension",
  "/packages",
  "/examples"
];

function urlFor(route) {
  // cleanUrls: strip trailing index.html; root stays "/"
  const path = route === "/" ? "/" : route + "/";
  return SITE_URL + path;
}

const today = new Date().toISOString().split("T")[0];

const urls = ROUTES.map(
  (route) =>
    `  <url>\n    <loc>${urlFor(route)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${route === "/" ? "1.0" : "0.8"}</priority>\n  </url>`
).join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

writeFileSync(join(DIST, "sitemap.xml"), xml);
console.log(`sitemap.xml written with ${ROUTES.length} urls`);
