import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import client from "../api/client";
import { DEMO_POSTS } from "../data/demo";
import { IconAlert, IconArrow, IconShield } from "../components/icons";

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    client.get(`/blog/${slug}`)
      .then(({ data }) => { if (alive) setPost(data.data || data); })
      .catch((err) => {
        if (!alive) return;
        const found = DEMO_POSTS.find((p) => p.slug === slug);
        if (!err.response && found) setPost(found);
        else setError("Article not found.");
      });
    return () => { alive = false; };
  }, [slug]);

  if (error) {
    return (
      <div className="page"><div className="container">
        <div className="alert error"><IconAlert size={18} /> {error}</div>
        <Link to="/blog" className="btn btn-ghost">Back to insights</Link>
      </div></div>
    );
  }
  if (!post) {
    return (
      <div className="page"><div className="container empty">
        <span className="spinner" /> Loading article…
      </div></div>
    );
  }

  const paragraphs = Array.isArray(post.body) ? post.body : [post.body || post.content || ""];

  return (
    <div className="page">
      <div className="container">
        <Link to="/blog" className="btn btn-ghost btn-sm" style={{ marginBottom: 26 }}>
          <IconArrow size={15} style={{ transform: "rotate(180deg)" }} /> All articles
        </Link>
        <div className="prose">
          <div className="p-cat">{post.category}</div>
          <h1 style={{ fontSize: "clamp(30px,4.4vw,46px)", fontWeight: 800, letterSpacing: "-.025em", margin: "10px 0" }}>{post.title}</h1>
          <div className="blog-meta"><span>{post.published_at}</span><span>·</span><span>{post.read_time}</span></div>
          <p className="lede">{post.excerpt}</p>
          {paragraphs.map((para, i) => <p key={i}>{para}</p>)}
          <div className="alert info" style={{ marginTop: 30 }}>
            <IconShield size={18} />
            <span>Capital at risk. Educational content, not financial advice.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
