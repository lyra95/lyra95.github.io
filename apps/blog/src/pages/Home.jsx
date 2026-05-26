import PostCard from '../components/PostCard'
import { posts } from '../data/posts'
import { Link } from 'react-router-dom'
import { allTags } from '../data/posts'

export default function Home() {
  return (
    <div className="container">
      <div className="hero">
        <h1>Recent Posts</h1>
        <div className="tags" style={{ justifyContent: 'center' }}>
          {allTags.map(tag => (
            <Link key={tag} to={`/tag/${tag}`} className="tag">{tag}</Link>
          ))}
        </div>
      </div>

      <p className="section-title">Recent Posts</p>
      <div className="posts-grid">
        {posts.map(post => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  )
}
