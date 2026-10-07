import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import client from "../api/client";
import { DEMO_PROJECTS } from "../data/demo";
import { formatAED, progressPct } from "../components/ProjectCard";
import { IconAlert, IconArrow, IconCheck, IconDoc, IconPin, IconShield } from "../components/icons";
import { useAuth } from "../context/AuthContext";

export default function ProjectDetail() {
  const { slug } = useParams();
  const { isAuthenticated } = useAuth();
  const [project, setProject] = useState(null);
  const [error, setError] = useState("");
  const [reserving, setReserving] = useState(false);
  const [reserved, setReserved] = useState(false);

  useEffect(() => {
    let alive = true;
    client.get(`/projects/${slug}`)
      .then(({ data }) => { if (alive) setProject(data.data || data); })
      .catch((err) => {
        if (!alive) return;
        if (!err.response) {
          setProject(DEMO_PROJECTS.find((p) => p.slug === slug) || null);
          if (!DEMO_PROJECTS.find((p) => p.slug === slug)) setError("Project not found.");
        } else {
          setError("Could not load this project.");
        }
      });
    return () => { alive = false; };
  }, [slug]);

  const reserve = async () => {
    setReserving(true);
    try {
      await client.post(`/projects/${slug}/reservations`, { units: 1 });
      setReserved(true);
    } catch (err) {
      if (!err.response) setReserved(true); // demo fallback
    } finally {
      setReserving(false);
    }
  };

  if (error) {
    return (
      <div className="page"><div className="container">
        <div className="alert error"><IconAlert size={18} /> {error}</div>
        <Link to="/projects" className="btn btn-ghost">Back to projects</Link>
      </div></div>
    );
  }
  if (!project) {
    return (
      <div className="page"><div className="container empty">
        <span className="spinner" /> Loading project…
      </div></div>
    );
  }

  const pct = progressPct(project);
  const docs = project.documents || [
    { name: "Information memorandum", type: "PDF" },
    { name: "Risk disclosure", type: "PDF" },
    { name: "SPV structure chart", type: "PDF" },
  ];

  return (
    <div className="page">
      <div className="container">
        <Link to="/projects" className="btn btn-ghost btn-sm" style={{ marginBottom: 26 }}>
          <IconArrow size={15} style={{ transform: "rotate(180deg)" }} /> All projects
        </Link>
        <div className="detail-grid">
          <div>
            <div className="p-img" style={{ borderRadius: 20 }}>
              <img src={project.image || "/hero.jpg"} alt={project.name} style={{ borderRadius: 20 }} />
            </div>
            <div className="prose" style={{ marginTop: 30 }}>
              <h2>About this opportunity</h2>
              <p className="lede">{project.tagline}</p>
              <p>{project.description}</p>
              <h2>Key facts</h2>
              <ul>
                <li><strong>Structure:</strong> fractional ownership via a dedicated SPV</li>
                <li><strong>Minimum investment:</strong> {formatAED(project.min_investment)}</li>
                <li><strong>Target raise:</strong> {formatAED(project.target_amount)}</li>
                <li><strong>Investors so far:</strong> {project.investors_count || "—"}</li>
              </ul>
              <div className="alert info" style={{ marginTop: 10 }}>
                <IconShield size={18} />
                <span>Capital at risk. Returns are never guaranteed. Read all documents before investing.</span>
              </div>
            </div>
          </div>
          <div>
            <div className="panel" style={{ position: "sticky", top: 100 }}>
              <div className="p-cat">{project.category}</div>
              <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-.02em", margin: "8px 0" }}>{project.name}</h1>
              <p className="p-loc"><IconPin size={15} /> {project.location}</p>
              <div className="p-bars" style={{ margin: "20px 0" }}>
                <div className="bar-row"><span>{pct}% funded</span><b>{formatAED(project.raised_amount)} of {formatAED(project.target_amount)}</b></div>
                <div className="bar o"><i style={{ width: pct + "%" }} /></div>
              </div>
              <div className="p-econ" style={{ marginBottom: 18 }}>
                <div>Min. investment<b>{formatAED(project.min_investment)}</b></div>
                <div>Target yield<b style={{ color: "var(--orange-deep)" }}>{project.expected_yield || "—"}</b></div>
              </div>
              {reserved ? (
                <div className="alert ok"><IconCheck size={18} /> Reservation received. We'll be in touch with next steps.</div>
              ) : isAuthenticated ? (
                <button className="btn btn-primary" style={{ width: "100%" }} onClick={reserve} disabled={reserving}>
                  {reserving ? <><span className="spinner" /> Reserving…</> : "Reserve my stake"}
                </button>
              ) : (
                <Link to="/login" className="btn btn-primary" style={{ width: "100%" }}>Log in to reserve</Link>
              )}
              <h3 style={{ margin: "26px 0 6px", fontSize: 17 }}>Documents</h3>
              {docs.map((d, i) => (
                <div className="doc-row" key={i}>
                  <span style={{ color: "var(--orange)" }}><IconDoc size={20} /></span>
                  <div className="grow"><b>{d.name}</b><div className="dm">{d.type}</div></div>
                  <button className="btn btn-ghost btn-sm" onClick={() => d.url && window.open(d.url, "_blank")}>View</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
