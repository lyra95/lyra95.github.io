import { useParams, Link } from 'react-router-dom'
import PostCard from '../components/PostCard'
import { getPostsByTag } from '../data/posts'

export default function TagPage() {
  const { tag } = useParams()
  const posts = getPostsByTag(tag)

  return (
    <div className="container">
      <Link to="/" className="back-link">← All posts</Link>
      <div style={{ marginBottom: '2rem' }}>
        <p className="section-title">Tag</p>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-heading)' }}>
          {tag}
        </h1>
        <p style={{ color: 'var(--color-text-muted)', marginTop: '0.4rem' }}>
          {posts.length} post{posts.length !== 1 ? 's' : ''}
        </p>
      </div>
      {posts.length > 0 ? (
        <div className="posts-grid">
          {posts.map(post => <PostCard key={post.slug} post={post} />)}
        </div>
      ) : (
        <p style={{ color: 'var(--color-text-muted)' }}>No posts found for this tag.</p>
      )}
    </div>
  )
}
