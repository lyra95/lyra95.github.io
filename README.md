# MathBlog

A React mathematics blog with MDX posts and KaTeX math rendering, organized as an
npm-workspaces monorepo ("1 solution : n projects"): the root holds only the
workspace config, and each app/package is its own project.

## Getting started

```bash
npm install          # installs all workspaces and links local packages
npm run dev          # runs the blog (delegates to @mathblog/blog)
```

Then open http://localhost:5173

## Build for production

```bash
npm run build
npm run preview
```

Root scripts (`dev`, `build`, `preview`, `lint`, `new`) just delegate to the blog
workspace via `npm run <script> -w @mathblog/blog`.

## Project structure

```
.                          ← solution root (workspaces only, no app code)
  package.json             # workspaces: ["apps/*", "packages/*"] + delegating scripts
  apps/
    blog/                  # @mathblog/blog — the Vite + MDX site
      index.html
      vite.config.js
      scripts/             # new-post.mjs, post-template.mdx
      src/
        posts/             ← write your posts here (.mdx files)
        components/        # Header, Footer, PostCard, MathBlock (KaTeX wrappers), …
        pages/             # Home, PostPage, TagPage
        data/posts.js      # auto-loads src/posts/**/*.mdx via import.meta.glob
        styles/global.css
        main.jsx / App.jsx
  packages/
    diagrams/              # @mathblog/diagrams — three.js diagram components
      package.json
      src/
        index.js           # barrel export
        SphereTangentDiagram.jsx
        TangentSpaceDiagram.jsx
```

Posts import diagrams from the package, not by relative path:

```mdx
import { SphereTangentDiagram } from '@mathblog/diagrams'

<SphereTangentDiagram />
```

The blog consumes `@mathblog/diagrams` as source (no build step) — Vite transforms
the linked workspace package directly, so edits hot-reload.

## Adding a post

Create a new file in `src/posts/` named `your-slug.mdx`. The filename becomes the URL (`/post/your-slug`). No other changes needed — it's picked up automatically.

```mdx
export const metadata = {
  title: 'My Post Title',
  excerpt: 'Short summary shown on the card.',
  date: 'June 1, 2026',
  tags: ['calculus', 'analysis'],
}

Regular **Markdown** prose here.

Inline math: $e^{i\pi} + 1 = 0$

Display math:

$$\int_0^1 x^2\, dx = \frac{1}{3}$$

## Embedding interactive components

Because posts are MDX, you can import and use any React component:

import UnitCircleDiagram from '../components/diagrams/UnitCircleDiagram'

<UnitCircleDiagram />
```

## Sidebar order

Drop an `index.md` in any folder under `src/posts/` to control sidebar order.
List the entries as markdown links — the link order wins, the text is just for
humans. Folders and posts can be mixed freely: a link is treated as a folder
when its target has no `.mdx` extension, otherwise as a post.

`src/posts/index.md` orders the top level (folders + root posts intermixed):

```md
- [General Relativity](General Relativity/)
- [Euler's Identity](eulers-identity.mdx)
- [The Basel Problem](basel-problem.mdx)
```

A folder's own `index.md` (e.g. `src/posts/General Relativity/index.md`) orders
the posts inside it. Anything not listed is appended in the default order
(folders alphabetical, posts newest-first). `index.md` is read for ordering
only — it never appears as a post.

## Math syntax

- **Inline**: `$...$`
- **Display block**: `$$...$$` on its own line
- Powered by KaTeX via `remark-math` + `rehype-katex` — no extra imports needed in posts.

## Tech stack

React · Vite · MDX · React Router · KaTeX · hand-crafted CSS
