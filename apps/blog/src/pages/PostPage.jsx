import { useParams, Link, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { getPost, getAdjacentPosts } from '../data/posts'

export default function PostPage() {
  const slug = useParams()['*']
  const post = getPost(slug)
  const { prev, next } = getAdjacentPosts(slug)

  useEffect(() => {
    window.scrollTo(0, 0)
    if (post) document.title = `${post.title} | MathBlog`
    return () => { document.title = 'MathBlog' }
  }, [post])

  if (!post) return <Navigate to="/" replace />

  const { Component } = post

  return (
    <div className="post-page">
      <Link to="/" className="back-link">← Back to all posts</Link>

      <header className="post-header">
        <h1>{post.title}</h1>
        <div className="post-meta">
          <div className="post-author">
            <div className="avatar">M</div>
            <span>MathBlog</span>
          </div>
          <span className="dot">·</span>
          <span>{post.date}</span>
          <span className="dot">·</span>
        </div>
        <div className="tags">
          {post.tags.map(tag => (
            <Link key={tag} to={`/tag/${tag}`} className="tag">{tag}</Link>
          ))}
        </div>
      </header>

      <article className="article-body">
        <Component />
      </article>

      <nav className="post-nav">
        {prev ? (
          <Link to={`/post/${prev.slug}`} className="post-nav-link post-nav-prev">
            <span className="post-nav-dir">← Previous</span>
            <span className="post-nav-title">{prev.title}</span>
          </Link>
        ) : <span />}
        {next ? (
          <Link to={`/post/${next.slug}`} className="post-nav-link post-nav-next">
            <span className="post-nav-dir">Next →</span>
            <span className="post-nav-title">{next.title}</span>
          </Link>
        ) : <span />}
      </nav>
    </div>
  )
}
