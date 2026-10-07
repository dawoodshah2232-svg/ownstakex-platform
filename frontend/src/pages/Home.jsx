import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import client from "../api/client";
import { DEMO_PROJECTS, CATEGORIES, STEPS } from "../data/demo";
import { categoryIcon, IconArrow, IconUsers, IconChart, IconShield, IconPlay } from "../components/icons";
import ProjectCard from "../components/ProjectCard";
import Reveal from "../components/Reveal";

const STATS = [
  { icon: <IconUsers size={26} />, value: "500+", label: "Registered investors" },
  { icon: <IconChart size={26} />, value: "25+", label: "Projects listed" },
  { icon: <IconChart size={26} />, value: "4", label: "Asset categories" },
  { icon: <IconShield size={26} />, value: "100%", label: "Transparent reporting" },
];

export default function Home() {
  const [projects, setProjects] = useState(DEMO_PROJECTS);

  useEffect(() => {
    let alive = true;
    client.get("/projects?featured=1&per_page=3")
      .then(({ data }) => { if (alive && Array.isArray(data.data)) setProjects(data.data); })
      .catch(() => { /* demo fallback stays */ });
    return () => { alive = false; };
  }, []);

  return (
    <>
      {/* HERO — full-bleed image, copy overlaid left (matches reference) */}
      <section className="hero-full">
        <div className="hf-bg" aria-hidden="true"><img src="/hero.jpg" alt="" fetchPriority="high" /></div>
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
                  <div className="cat-img"><img src="/hero.jpg" alt={c.name} loading="lazy" /></div>
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

      {/* HOW IT WORKS — 5 steps */}
      <section className="section" style={{ background: "var(--bg2)" }}>
        <div className="container">
          <Reveal>
            <div className="section-head center">
              <div className="kicker" style={{ justifyContent: "center" }}>How it works</div>
              <h2>A smarter way to invest</h2>
              <p>From sign-up to your first distribution in five clear steps.</p>
            </div>
          </Reveal>
          <Reveal>
            <div className="steps-row">
              {STEPS.map((s, i) => (
                <span key={s.n} style={{ display: "contents" }}>
                  <div className="step-h">
                    <span className="s-ico" style={{ color: "var(--orange)" }}><IconChart size={22} /></span>
                    <div>
                      <div className="s-top"><span className="s-num">{s.n}</span><b>{s.title}</b></div>
                      <p>{s.text}</p>
                    </div>
                  </div>
                  {i < STEPS.length - 1 && <span className="s-arr"><IconArrow size={20} /></span>}
                </span>
              ))}
            </div>
          </Reveal>
          <Reveal>
            <div style={{ textAlign: "center", marginTop: 40 }}>
              <Link to="/how-it-works" className="btn btn-ghost">Learn more <IconArrow size={16} /></Link>
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
    </>
  );
}
