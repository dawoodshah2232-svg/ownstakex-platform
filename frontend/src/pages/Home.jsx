import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import client from "../api/client";
import { DEMO_PROJECTS, DEMO_POSTS, CATEGORIES } from "../data/demo";
import { categoryIcon, IconArrow, IconUsers, IconChart, IconShield, IconPlay } from "../components/icons";
import ProjectCard from "../components/ProjectCard";
import Reveal from "../components/Reveal";
import PageHead, { HOME_CRUMB } from "../components/PageHead";

const STATS = [
  { icon: <IconUsers size={26} />, value: "500+", label: "Registered investors" },
  { icon: <IconChart size={26} />, value: "25+", label: "Projects listed" },
  { icon: <IconChart size={26} />, value: "4", label: "Asset categories" },
  { icon: <IconShield size={26} />, value: "100%", label: "Transparent reporting" },
];

const svg = (children) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);

/** The investor journey in five steps (homepage How It Works band). */
const HIW_STEPS = [
  { n: "01", title: "Explore", text: "Browse verified opportunities", icon: svg(<><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>) },
  { n: "02", title: "Invest", text: "Select your ownership stake", icon: svg(<><path d="M6 2.5h8L19 8v13.5H6z" /><path d="M14 2.5V8h5" /><path d="M9 12.5h6M9 16h6" /></>) },
  { n: "03", title: "Own", text: "Track performance", icon: svg(<><path d="M5 20v-7M11 20V6M17 20v-11" /><path d="M3 20h18" /></>) },
  { n: "04", title: "Earn", text: "Receive distributions", icon: svg(<><rect x="2.5" y="6" width="19" height="13" rx="2.5" /><path d="M2.5 10h19" /><path d="M6 15h4" /></>) },
  { n: "05", title: "Exit", text: "Sell your stake when eligible", icon: svg(<><path d="M14 3.5h-8v17h8" /><path d="M14 12h9m-3-3 3 3-3 3" /></>) },
];

export default function Home() {
  const [projects, setProjects] = useState(DEMO_PROJECTS);
  const [posts, setPosts] = useState(DEMO_POSTS);

  useEffect(() => {
    let alive = true;
    client.get("/projects?featured=1&per_page=3")
      .then(({ data }) => { if (alive && Array.isArray(data.data)) setProjects(data.data); })
      .catch(() => { /* demo fallback stays */ });
    client.get("/blog")
      .then(({ data }) => { if (alive && Array.isArray(data.data) && data.data.length) setPosts(data.data); })
      .catch(() => { /* demo fallback stays */ });
    return () => { alive = false; };
  }, []);

  return (
    <>
      <PageHead title={undefined} description='Own a stake in real opportunities. Curated fractional investments in real estate, yachts, hospitality and operating businesses — by Bridging Investment LLC, Dubai.' path="/" breadcrumbs={[HOME_CRUMB]} />
      {/* HERO — full-bleed image, copy overlaid left (matches reference) */}
      <section className="hero-full">
        <div className="hf-bg" aria-hidden="true"><img src="/hero.webp" alt="" fetchPriority="high" /></div>
        <div className="hero-veil" aria-hidden="true" />
        <div className="hero-ribbons" aria-hidden="true"><span /><span /><span /></div>
        <div className="container hero-copy">
          <div className="hero-col">
            <Reveal><div className="eyebrow"><span className="dot" /> Invest&nbsp;&nbsp;·&nbsp;&nbsp;Own&nbsp;&nbsp;·&nbsp;&nbsp;Grow Together</div></Reveal>
            <Reveal delay="d1"><h1>Own a Stake in<br /><span className="o">Real Opportunities</span></h1></Reveal>
            <Reveal delay="d2">
              <p className="lead">Access curated investment opportunities across real estate, yachts, hospitality, operating businesses and alternative assets through structured, transparent and secure shared ownership.</p>
            </Reveal>
            <Reveal delay="d3">
              <div className="hero-cta">
                <Link to="/projects" className="btn btn-primary btn-lg">Explore Opportunities <IconArrow size={17} /></Link>
                <Link to="/how-it-works" className="btn btn-ghost btn-lg"><IconPlay size={18} /> How It Works</Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* STATS BAND overlapping hero */}
      <div className="container">
        <Reveal>
          <div className="stats-band stats-overlap">
            {STATS.map((s, i) => (
              <div className="stat-cell" key={i}>
                <span className="stat-ico" style={{ color: "var(--orange)" }}>{s.icon}</span>
                <div><b>{s.value}</b><span>{s.label}</span></div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* CATEGORIES */}
      <section className="section">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <div className="kicker">Asset classes</div>
              <h2>Four ways to own a stake</h2>
              <p>Every category follows the same discipline: verified assets, published documents, pro-rata economics.</p>
            </div>
          </Reveal>
          <div className="grid cols-4">
            {CATEGORIES.map((c, i) => (
              <Reveal key={c.name} delay={i === 1 ? "d1" : i === 2 ? "d2" : i === 3 ? "d3" : ""}>
                <Link to="/projects" className="cat-card">
                  <div className="cat-img"><img src="/hero.webp" alt={c.name} loading="lazy" /></div>
                  <div className="cat-body">
                    <span className="cat-ico" style={{ color: "#fff" }}>{categoryIcon(c.icon, { size: 24 })}</span>
                    <div><h3>{c.name}</h3><p>{c.desc}</p></div>
                    <span className="cat-arrow"><IconArrow size={20} /></span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — premium dark band, 5 glassy cards (spec: homepage redesign) */}
      <section className="hiw-band">
        <div className="container">
          <Reveal>
            <div className="hiw-head">
              <div className="kicker hiw-kicker">How It Works</div>
              <h2>A Smarter Way to Invest</h2>
              <p>We connect investors with premium opportunities through structured, transparent and secure ownership.</p>
            </div>
          </Reveal>
          <div className="hiw-grid">
            {HIW_STEPS.map((s, i) => (
              <Reveal key={s.n} delay={`d${i}`}>
                <div className="hiw-card">
                  <span className="hiw-num" aria-hidden="true">{s.n}</span>
                  <span className="hiw-ico" aria-hidden="true">{s.icon}</span>
                  <b>{s.title}</b>
                  <p>{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="hiw-cta">
              <Link to="/how-it-works" className="btn-ghost-dark">Full journey explained <IconArrow size={16} /></Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section className="section">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <div className="kicker">Live now</div>
              <h2>Featured opportunities</h2>
              <p>A snapshot of what's funding. Capital at risk — returns are never guaranteed.</p>
            </div>
          </Reveal>
          <div className="grid-3">
            {projects.slice(0, 3).map((p) => <ProjectCard key={p.id || p.slug} project={p} />)}
          </div>
          <Reveal>
            <div style={{ textAlign: "center", marginTop: 40 }}>
              <Link to="/projects" className="btn btn-primary">View all projects <IconArrow size={16} /></Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FROM THE BLOG — editorial cards */}
      {posts.length > 0 && (
        <section className="section" style={{ background: "var(--bg2)" }}>
          <div className="container">
            <Reveal>
              <div className="section-head">
                <div className="kicker">From the blog</div>
                <h2>Learn the mechanics.</h2>
                <p>Plain-English education on structure, risk and reporting — the same material our investors read.</p>
              </div>
            </Reveal>
            <div className="grid-3">
              {posts.slice(0, 3).map((p, i) => (
                <Reveal key={p.id || p.slug} delay={`d${i}`}>
                  <Link to={`/blog/${p.slug}`} className="b-card">
                    <div className="b-img"><img src={p.image || p.cover_image || "/hero.webp"} alt="" loading="lazy" /></div>
                    <div className="b-body">
                      {(p.tag || p.category) && <span className="b-pill">{p.tag || p.category}</span>}
                      <h3>{p.title}</h3>
                      <p>{p.excerpt}</p>
                      <div className="b-meta">{[p.date || (p.published_at && new Date(p.published_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })), p.read || p.read_time].filter(Boolean).join(" · ")}</div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
