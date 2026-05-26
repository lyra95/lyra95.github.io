import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { posts, sidebarEntries } from '../data/posts'

export default function Sidebar() {
  // Sidebar lives outside <Routes>, so useParams() is empty here — read the
  // current slug straight from the path: /post/<slug>
  const { pathname } = useLocation()
  const slug = pathname.startsWith('/post/')
    ? decodeURIComponent(pathname.slice('/post/'.length))
    : null

  // Derive which topic the current post belongs to, open it by default
  const activePost  = posts.find(p => p.slug === slug)
  const activeTopic = activePost?.topic ?? null

  const [openTopics, setOpenTopics] = useState(
    () => new Set(activeTopic ? [activeTopic] : [])
  )

  // On navigation, expand the current post's topic (even if it was collapsed).
  // State adjusted during render — React's pattern for state derived from props.
  const [seenTopic, setSeenTopic] = useState(activeTopic)
  if (activeTopic !== seenTopic) {
    setSeenTopic(activeTopic)
    if (activeTopic && !openTopics.has(activeTopic)) {
      setOpenTopics(prev => new Set(prev).add(activeTopic))
    }
  }

  function toggle(topic) {
    setOpenTopics(prev => {
      const next = new Set(prev)
      next.has(topic) ? next.delete(topic) : next.add(topic)
      return next
    })
  }

  return (
    <nav className="sidebar">
      <ul className="sidebar-topics">
        {sidebarEntries.map(entry => {
          // Standalone root-level post
          if (entry.type === 'post') {
            const post = entry.post
            return (
              <li key={post.slug}>
                <Link
                  to={`/post/${post.slug}`}
                  className={`sidebar-post-link sidebar-post-link--root ${slug === post.slug ? 'is-active' : ''}`}
                >
                  {post.title}
                </Link>
              </li>
            )
          }

          // Collapsible folder (topic)
          const { topic, posts: topicPosts } = entry
          const isOpen = openTopics.has(topic)

          return (
            <li key={topic} className="sidebar-topic">
              <button
                className={`sidebar-topic-btn ${isOpen ? 'is-open' : ''}`}
                onClick={() => toggle(topic)}
                aria-expanded={isOpen}
              >
                <span className="sidebar-topic-arrow">▶</span>
                <span className="sidebar-topic-name">{topic}</span>
                <span className="sidebar-topic-count">{topicPosts.length}</span>
              </button>

              {isOpen && (
                <ul className="sidebar-posts">
                  {topicPosts.map(post => (
                    <li key={post.slug}>
                      <Link
                        to={`/post/${post.slug}`}
                        className={`sidebar-post-link ${slug === post.slug ? 'is-active' : ''}`}
                      >
                        {post.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
