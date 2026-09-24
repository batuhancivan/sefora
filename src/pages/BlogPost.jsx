import { Link, useParams } from 'react-router-dom'
import { getPost } from '../data/blog'
import NotFound from './NotFound'

export default function BlogPost() {
  const { slug } = useParams()
  const post = getPost(slug)
  if (!post) return <NotFound />

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 820 }}>
        <p className="breadcrumb">
          <Link to="/">Ana Sayfa</Link> / <Link to="/blog">Blog</Link> / {post.title}
        </p>
        <p className="product-meta">
          {post.date} · {post.read}
        </p>
        <h1 className="page-title">{post.title}</h1>
        <img src={post.image} alt="" style={{ width: '100%', maxHeight: 420, objectFit: 'cover', marginBottom: '1.5rem' }} />
        <div className="prose">
          {post.content.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </div>
    </div>
  )
}
