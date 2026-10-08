import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import client from "../api/client";
import { DEMO_PROJECTS } from "../data/demo";
import { formatAED, progressPct } from "../components/ProjectCard";
import { IconAlert, IconArrow, IconCheck, IconClock, IconDoc, IconPin, IconShield } from "../components/icons";
import { severityOf, daysUntil, daysLeftLabel, formatCloseDate, SEV_BADGE_CLASS } from "../utils/deadlines";
import { useAuth } from "../context/AuthContext";
import PageHead, { HOME_CRUMB } from "../components/PageHead";

export default function ProjectDetail() {
  const { slug } = useParams();
  const { isAuthenticated } = useAuth();
  const [project, setProject] = useState(null);
  const [error, setError] = useState("");
  const [reserving, setReserving] = useState(false);
  const [reserved, setReserved] = useState(false);
  const [units, setUnits] = useState(1);

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
      await client.post(`/projects/${slug}/reservations`, { units });
      setReserved(true);
    } catch (err) {
      if (!err.response) setReserved(true); // demo fallback
    } finally {
      setReserving(false);
    }
  };

  if (error) {
    return (
      <><PageHead title="Project not found" noindex />
      <div className="page"><div className="container">
        <div className="alert error"><IconAlert size={18} /> {error}</div>
        <Link to="/projects" className="btn btn-ghost">Back to projects</Link>
      </div></div></>
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

  // closing deadline + severity (from closing_date, falling back to campaign_ends)
  const closingDate = project.closing_date || project.campaign_ends;
  const daysLeft = closingDate ? daysUntil(closingDate) : null;
  const sev = severityOf(daysLeft ?? 0);

  // unit inventory segments
  const econ = {
    units: Number(project.units) || 0,
    held: Number(project.held_units ?? 0),
    reserved: Number(project.reserved ?? 0),
    funded: Number(project.funded ?? 0),
  };
  const invTotal = econ.units > 0
    ? econ.units
    : econ.held + econ.reserved + econ.funded + (Number(project.available_units) || 0);
  const invAvailable = invTotal > 0 ? Math.max(0, invTotal - econ.held - econ.reserved - econ.funded) : 0;
  const invPct = (n) => (invTotal > 0 ? Math.max(0, Math.min(100, (n / invTotal) * 100)) : 0);

  // 5% now / 95% on funding call, from unit_price × selected units
  const unitPrice = Number(project.unit_price) || (project.min_investment ? Number(project.min_investment) / Math.max(1, Number(project.min_units) || 1) : 0);
  const maxUnits = Number(project.max_units) || (econ.units > 0 ? Math.max(1, invAvailable) : 100);
  const splitTotal = unitPrice * units;
  const splitNow = splitTotal * 0.05;
  const splitLater = splitTotal * 0.95;

  return (
    <div className="page">
      <PageHead
      title={project.name}
      description={project.teaser || project.summary || `Invest in ${project.name} — fractional ownership on OwnStakeX.`}
      path={`/projects/${slug}`}
      breadcrumbs={[HOME_CRUMB, { name: "Projects", path: "/projects" }, { name: project.name, path: `/projects/${slug}` }]}
      />
      <div className="container">
        <Link to="/projects" className="btn btn-ghost btn-sm" style={{ marginBottom: 26 }}>
          <IconArrow size={15} style={{ transform: "rotate(180deg)" }} /> All projects
        </Link>
        <div className="detail-grid">
          <div>
            <div className="p-img" style={{ borderRadius: 20 }}>
              <img src={project.image || "/hero.webp"} alt={project.name} style={{ borderRadius: 20 }} />
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
              {daysLeft != null && (
                <div className="p-deadline">
                  <IconClock size={15} />
                  <span>Closes <b>{formatCloseDate(closingDate)}</b> · {daysLeftLabel(daysLeft)}</span>
                  <span className={`badge ${SEV_BADGE_CLASS[sev.key]}`}>{sev.label}</span>
                </div>
              )}
              <div className="p-bars" style={{ margin: "20px 0" }}>
                <div className="bar-row"><span>{pct}% funded</span><b>{formatAED(project.raised_amount)} of {formatAED(project.target_amount)}</b></div>
                <div className="bar o"><i style={{ width: pct + "%" }} /></div>
              </div>
              {invTotal > 0 && (
                <div className="seg-wrap">
                  <div className="bar-row" style={{ marginBottom: 8 }}>
                    <span style={{ fontSize: 13, color: "var(--muted)" }}>Unit inventory</span>
                    <b style={{ fontSize: 13 }}>{invAvailable} available</b>
                  </div>
                  <div className="seg-bar" role="img" aria-label={`Available ${invAvailable}, held ${econ.held}, reserved ${econ.reserved}, funded ${econ.funded} of ${invTotal} units`}>
                    <i style={{ width: invPct(econ.funded) + "%", background: "#059669" }} />
                    <i style={{ width: invPct(econ.reserved) + "%", background: "#f59e0b" }} />
                    <i style={{ width: invPct(econ.held) + "%", background: "#0284c7" }} />
                  </div>
                  <div className="seg-legend">
                    <span><i className="seg-dot" style={{ background: "#059669" }} /> Funded {econ.funded}</span>
                    <span><i className="seg-dot" style={{ background: "#f59e0b" }} /> Reserved {econ.reserved}</span>
                    <span><i className="seg-dot" style={{ background: "#0284c7" }} /> Held {econ.held}</span>
                    <span><i className="seg-dot" style={{ background: "rgba(14,26,43,.18)" }} /> Available {invAvailable}</span>
                  </div>
                </div>
              )}
              <div className="p-econ" style={{ marginBottom: 18 }}>
                <div>Min. investment<b>{formatAED(project.min_investment)}</b></div>
                <div>Target yield<b style={{ color: "var(--orange-deep)" }}>{project.expected_yield || "—"}</b></div>
              </div>
              {unitPrice > 0 && !reserved && (
                <div className="pay-box">
                  <div className="pay-row">
                    <span>Units</span>
                    <span className="unit-stepper">
                      <button type="button" onClick={() => setUnits((u) => Math.max(1, u - 1))} disabled={units <= 1} aria-label="Fewer units">−</button>
                      <b>{units}</b>
                      <button type="button" onClick={() => setUnits((u) => Math.min(maxUnits, u + 1))} disabled={units >= maxUnits} aria-label="More units">+</button>
                    </span>
                  </div>
                  <div className="pay-row"><span>5% reservation payment now</span><b>{formatAED(Math.round(splitNow))}</b></div>
                  <div className="pay-row"><span>95% balance due on funding call</span><b>{formatAED(Math.round(splitLater))}</b></div>
                  <div className="pay-note">Total {formatAED(Math.round(splitTotal))} for {units} unit{units === 1 ? "" : "s"} · {formatAED(Math.round(unitPrice))} per unit</div>
                </div>
              )}
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
