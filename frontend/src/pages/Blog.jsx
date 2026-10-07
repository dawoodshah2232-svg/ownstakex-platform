import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import client from "../api/client";
import { DEMO_POSTS } from "../data/demo";
import { IconArrow, IconAlert } from "../components/icons";
import Reveal from "../components/Reveal";

export default function Blog() {
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    client.get("/blog")
      .then(({ data }) => { if (alive) setPosts(Array.isArray(data.data) ? data.data : []); })
      .catch((err) => {
        if (!alive) return;
        if (!err.response) setPosts(DEMO_POSTS);
        else { setError("Could not load articles."); setPosts([]); }
      });
    return () => { alive = false; };
  }, []);

  return (
    <div className="page">
      <div className="container">
        <div className="page-head">
          <h1>Insights</h1>
          <p>Plain-English explainers on fractional ownership, yields, structures and risk. Educational content — not financial advice.</p>
        </div>
        {error && <div className="alert error"><IconAlert size={18} /> {error}</div>}
        {posts === null ? (
          <div className="empty"><span className="spinner" /> Loading articles…</div>
        ) : posts.length === 0 ? (
          <div className="empty">No articles published yet.</div>
        ) : (
          <div className="grid-3">
            {posts.map((p, i) => (
              <Reveal key={p.id || p.slug} delay={i % 3 === 1 ? "d1" : i % 3 === 2 ? "d2" : ""}>
                <Link to={`/blog/${p.slug}`} className="p-card">
                  <div className="p-body">
                    <div className="p-cat">{p.category}</div>
                    <h3>{p.title}</h3>
                    <p style={{ color: "var(--muted)", fontSize: 14.5 }}>{p.excerpt}</p>
                    <div className="blog-meta" style={{ margin: "auto 0 0" }}>
                      <span>{p.published_at}</span><span>·</span><span>{p.read_time}</span>
                    </div>
                    <span className="p-go">Read article <IconArrow size={15} /></span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
