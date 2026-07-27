import DefaultTheme from "vitepress/theme";
import type { Theme } from "vitepress";
import GraphExplorer from "./GraphExplorer.vue";

/**
 * Extends the default theme to register `<GraphExplorer>` globally, so it
 * can be dropped directly into any Markdown page (see
 * `docs/guide/graph-explorer.md`). This is the site's first custom
 * component — VitePress's standard extension point for this is exactly
 * `enhanceApp` on a theme that extends `DefaultTheme`.
 */
export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component("GraphExplorer", GraphExplorer);
  },
} satisfies Theme;
