import { Link } from 'react-router-dom'

export default function PostCard({ post }) {
  const Card = (
    <div className="post-card">
      <div className="post-card-meta">
        <span>{post.date}</span>
        <span className="dot">·</span>
      </div>
      <h2>{post.title}</h2>
      <p>{post.excerpt}</p>
      <div className="tags">
        {post.tags.map(tag => (
          <Link
            key={tag}
            to={`/tag/${tag}`}
            className="tag"
            onClick={e => e.stopPropagation()}
          >
            {tag}
          </Link>
        ))}
      </div>
    </div>
  )

  return (
    <Link to={`/post/${post.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
      {Card}
    </Link>
  )
}
