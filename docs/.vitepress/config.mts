import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

// https://vitepress.dev/reference/site-config
export default withMermaid(defineConfig({
  title: "Adaptive MCP",
  description: "Turn MCP usage into learned metadata, so clients adapt instead of guessing.",
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
