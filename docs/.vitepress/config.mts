import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

// https://vitepress.dev/reference/site-config
const SITE_URL = "https://adaptivemcp.dev"

export default withMermaid(defineConfig({
  title: "Adaptive MCP",
  description: "Turn MCP usage into learned metadata, so clients adapt instead of guessing.",
  lang: "en-US",
  cleanUrls: true,
  lastUpdated: true,
  vite: {
    build: {
      chunkSizeWarningLimit: 4000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('mermaid') || id.includes('@mermaid-js')) {
                return 'mermaid'
              }
              if (id.includes('katex') || id.includes('@vscode/markdown-it-katex')) {
                return 'katex'
              }
            }
          }
        }
      }
    }
  },
  head: [
    ["link", { rel: "canonical", href: SITE_URL }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:site_name", content: "Adaptive MCP" }],
    ["meta", { property: "og:title", content: "Adaptive MCP" }],
    ["meta", { property: "og:description", content: "Turn MCP usage into learned metadata, so clients adapt instead of guessing." }],
    ["meta", { property: "og:url", content: SITE_URL }],
    ["meta", { property: "og:image", content: `${SITE_URL}/og-image.png` }],
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    ["meta", { name: "twitter:title", content: "Adaptive MCP" }],
    ["meta", { name: "twitter:description", content: "Turn MCP usage into learned metadata, so clients adapt instead of guessing." }],
    ["meta", { name: "twitter:image", content: `${SITE_URL}/og-image.png` }],
    ["link", { rel: "alternate", type: "text/plain", href: `${SITE_URL}/llms.txt` }],
    ["script", { type: "application/ld+json", innerHTML: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "SoftwareSourceCode",
      "name": "Adaptive MCP",
      "description": "Turn MCP usage into learned metadata, so clients adapt instead of guessing.",
      "url": SITE_URL,
      "codeRepository": "https://github.com/kemalelmizan/adaptive-mcp",
      "license": "https://github.com/kemalelmizan/adaptive-mcp/blob/main/LICENSE"
    }) }]
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Getting Started', link: '/guide/getting-started' },
      { text: 'Architecture', link: '/guide/architecture' },
      { text: 'Packages', link: '/packages' },
      { text: 'Examples', link: '/examples' }
    ],

    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting Started', link: '/guide/getting-started' },
          { text: 'Architecture', link: '/guide/architecture' },
          { text: 'The tools-metadata Extension', link: '/guide/extension' }
        ]
      },
      {
        text: 'Reference',
        items: [
          { text: 'Packages', link: '/packages' },
          { text: 'Examples', link: '/examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/kemalelmizan/adaptive-mcp' }
    ]
  }
}))
