// Recursively loads every .mdx file under src/posts/.
//
// File layout → URL slug:
//   src/posts/my-post.mdx                        →  /post/my-post
//   src/posts/General Relativity/spacetime.mdx   →  /post/general-relativity/spacetime
//
// The folder name (original casing) becomes the topic displayed in the sidebar.

const modules = import.meta.glob('../posts/**/*.mdx', { eager: true })

function folderToSlug(name) {
  return name.toLowerCase().replace(/\s+/g, '-')
}

// Drafts are visible during `vite dev` so they can be previewed,
// and stripped from production builds.
const showDrafts = import.meta.env.DEV

export const posts = Object.entries(modules)
  .map(([path, mod]) => {
    // path looks like: ../posts/General Relativity/spacetime.mdx
    const relative = path.replace(/^\.\.\/posts\//, '')   // "General Relativity/spacetime.mdx"
    const parts    = relative.split('/')
    const filename = parts.at(-1).replace(/\.mdx$/, '')   // "spacetime"

    const topic    = parts.length > 1 ? parts[0] : null   // "General Relativity" or null
    const slug     = topic
      ? `${folderToSlug(topic)}/${filename}`               // "general-relativity/spacetime"
      : filename                                           // "my-post"

    const meta = mod.metadata ?? {}
    return {
      slug,
      topic,                   // original folder name, e.g. "General Relativity"
      title:    meta.title    ?? filename,
      excerpt:  meta.excerpt  ?? '',
      date:     meta.date     ?? '',
      tags:     meta.tags     ?? [],
      draft:    meta.draft    ?? false,
      Component: mod.default,
    }
  })
  .filter(p => showDrafts || !p.draft)
  .sort((a, b) => new Date(b.date) - new Date(a.date))

// ── Sidebar ordering ──────────────────────────────────────────────
// Drop an `index.md` in any folder under src/posts/ (including src/posts/
// itself) to control sidebar order. List the entries as markdown links — the
// link order wins, the link text is just for humans. Posts and subfolders can
// be mixed freely; a link is treated as a folder if its target has no `.mdx`
// extension, otherwise as a post:
//
//   - [Foundations](Foundations/)            ← a folder
//   - [Euler's Identity](eulers-identity.mdx) ← a post
//
// Listed entries come first in that order; anything not listed follows in the
// default order (folders alphabetical, posts date-descending).
const orderModules = {
  ...import.meta.glob('../posts/index.md',    { query: '?raw', import: 'default', eager: true }),
  ...import.meta.glob('../posts/**/index.md', { query: '?raw', import: 'default', eager: true }),
}

// Pull the link targets out of an index.md, in order, as bare names
// (no leading ./, no extension, no trailing slash or /index).
function parseOrder(markdown) {
  return [...markdown.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)].map(m =>
    m[1].trim()
      .replace(/^\.?\//, '')       // strip leading ./ or /
      .replace(/\.mdx?$/, '')      // strip .md / .mdx extension
      .replace(/\/(index)?$/, '')  // strip trailing slash or /index
  )
}

// topic name → ordered list of names. '' is the root posts/ folder.
const topicOrder = Object.fromEntries(
  Object.entries(orderModules).map(([path, raw]) => {
    const rel   = path.replace(/^\.\.\/posts\//, '')   // "General Relativity/index.md" | "index.md"
    const topic = rel.includes('/') ? rel.slice(0, rel.indexOf('/')) : ''
    return [topic, parseOrder(raw)]
  })
)

// Reorder a topic's posts to match its index.md. We rebuild the slug each
// listed filename would produce (same rule as the loader above) and match by
// slug, so posts themselves never need to be picked apart. Unlisted posts keep
// their date-descending order.
function applyOrder(list, topic) {
  const order = topicOrder[topic ?? '']
  if (!order) return list
  const slugFor = name => (topic ? `${folderToSlug(topic)}/${name}` : name)
  const listed  = order
    .map(name => list.find(p => p.slug === slugFor(name)))
    .filter(Boolean)
  const rest = list.filter(p => !listed.includes(p))
  return [...listed, ...rest]
}

export function getPost(slug) {
  return posts.find(p => p.slug === slug) ?? null
}

export function getPostsByTag(tag) {
  return posts.filter(p => p.tags.includes(tag))
}

// All unique folder-based topics, in alphabetical order
export const topics = [...new Set(
  posts.map(p => p.topic).filter(Boolean)
)].sort()

// Posts grouped by topic, each ordered by its folder's index.md
export const postsByTopic = Object.fromEntries(
  topics.map(topic => [topic, applyOrder(posts.filter(p => p.topic === topic), topic)])
)

// ── Unified sidebar tree ──────────────────────────────────────────
// One ordered list of top-level entries (folders + root posts intermixed),
// driven by src/posts/index.md. Each entry is either:
//   { type: 'topic', topic, posts }   — a collapsible folder
//   { type: 'post',  post }           — a standalone root-level post
// A name in index.md resolves to a topic if it matches a folder, otherwise to
// a root post. Anything not listed is appended (folders alpha, posts by date).
export const sidebarEntries = (() => {
  const order      = topicOrder[''] ?? []
  const topicSet   = new Set(topics)
  const rootPosts  = applyOrder(posts.filter(p => p.topic === null), null)
  const rootBySlug = new Map(rootPosts.map(p => [p.slug, p]))

  const entries  = []
  const seenTopic = new Set()
  const seenPost  = new Set()

  for (const name of order) {
    if (topicSet.has(name)) {
      entries.push({ type: 'topic', topic: name, posts: postsByTopic[name] })
      seenTopic.add(name)
    } else if (rootBySlug.has(name)) {
      entries.push({ type: 'post', post: rootBySlug.get(name) })
      seenPost.add(name)
    }
    // unrecognised name → stale entry, skip
  }

  // Append whatever index.md didn't mention, keeping the default order.
  for (const topic of topics) {
    if (!seenTopic.has(topic)) entries.push({ type: 'topic', topic, posts: postsByTopic[topic] })
  }
  for (const post of rootPosts) {
    if (!seenPost.has(post.slug)) entries.push({ type: 'post', post })
  }
  return entries
})()

// Flat reading order — every post in sidebar order (folder posts inlined where
// the folder sits). Drives prev/next navigation on a post page.
export const orderedPosts = sidebarEntries.flatMap(e =>
  e.type === 'topic' ? e.posts : [e.post]
)

// Previous / next post in reading order (null at the ends).
export function getAdjacentPosts(slug) {
  const i = orderedPosts.findIndex(p => p.slug === slug)
  if (i === -1) return { prev: null, next: null }
  return {
    prev: i > 0 ? orderedPosts[i - 1] : null,
    next: i < orderedPosts.length - 1 ? orderedPosts[i + 1] : null,
  }
}

export const allTags = [...new Set(posts.flatMap(p => p.tags))].sort()
