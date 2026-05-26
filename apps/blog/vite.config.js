import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import svgr from 'vite-plugin-svgr'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'

// Mark rendered math (KaTeX) and code as translate="no" so browser
// auto-translation (Google Translate etc.) doesn't mangle formulas/code.
// Runs after rehype-katex so the .katex nodes already exist.
function rehypeNoTranslate() {
  return (tree) => {
    const visit = (node) => {
      if (node.type === 'element') {
        const cls = node.properties?.className
        const classes = Array.isArray(cls) ? cls : cls ? [cls] : []
        if (node.tagName === 'code' || node.tagName === 'pre' || classes.includes('katex')) {
          node.properties = { ...node.properties, translate: 'no' }
        }
      }
      node.children?.forEach(visit)
    }
    visit(tree)
  }
}

export default defineConfig({
  base: '/',
  plugins: [
    mdx({
      // Only compile .mdx as components; leave .md alone so sidebar `index.md`
      // order files can be imported as raw text (?raw) instead of MDX.
      mdExtensions: [],
      remarkPlugins: [remarkMath],
      rehypePlugins: [
        // Project-wide KaTeX macros (LaTeX \newcommand equivalent). Available in
        // every post's math. \Forms{q}{V} → the space of (0,q) alternating
        // tensors, Λ^q(V); \displaystyle\textstyle kept to match prior rendering.
        [rehypeKatex, { macros: { '\\Forms': '{\\displaystyle\\textstyle\\bigwedge^{#1}(#2)}' } }],
        rehypeNoTranslate,
      ],
    }),
    react({ include: /\.(jsx|tsx)$/ }),
    // Import SVGs as React components via the `?react` query, e.g.
    //   import Area from './resources/area.svg?react'  →  <Area />
    // Inline SVG inherits page CSS, so `svg text { font-family: var(--font-sans) }`
    // makes diagram labels match the body font. Plain `import x from './x.svg'`
    // still returns a URL for <img src> use.
    svgr(),
  ],
})
