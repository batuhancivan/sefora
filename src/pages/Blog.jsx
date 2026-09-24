import { Link } from 'react-router-dom'
import { POSTS } from '../data/blog'

export default function Blog() {
  return (
    <div className="page">
      <div className="container">
        <p className="breadcrumb">
          <Link to="/">Ana Sayfa</Link> / Blog
        </p>
        <h1 className="page-title">Editöryal</h1>
        <p className="page-lead">Koku, stil ve İtalyan parfümeri kültürüne dair notlar.</p>
        <div className="blog-grid">
          {POSTS.map((post) => (
            <article className="blog-card" key={post.slug}>
              <Link to={`/blog/${post.slug}`}>
                <img src={post.image} alt="" />
                <p className="product-meta">
                  {post.date} · {post.read}
                </p>
                <h3>{post.title}</h3>
                <p className="page-lead">{post.excerpt}</p>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
