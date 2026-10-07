import { Link } from "react-router-dom";
import { IconPin, IconArrow } from "./icons";

export function formatAED(n) {
  if (n == null) return "—";
  return "AED " + Number(n).toLocaleString("en-US");
}

export function progressPct(p) {
  if (!p.target_amount) return 0;
  return Math.min(100, Math.round((p.raised_amount / p.target_amount) * 100));
}

export default function ProjectCard({ project }) {
  const pct = progressPct(project);
  const statusLabel = project.status === "funding" ? "Funding" : project.status === "coming_soon" ? "Coming soon" : project.status;
  return (
    <Link to={`/projects/${project.slug}`} className="p-card">
      <div className="p-img">
        <img src={project.image || "/hero.jpg"} alt={project.name} loading="lazy" />
        <span className={`badge ${project.status === "funding" ? "ok" : "mut"}`}>{statusLabel}</span>
      </div>
      <div className="p-body">
        <div className="p-cat">{project.category}</div>
        <h3>{project.name}</h3>
        <p className="p-loc"><IconPin size={14} /> {project.location}</p>
        <div className="p-bars">
          <div className="bar-row"><span>{pct}% funded</span><b>{formatAED(project.raised_amount)} raised</b></div>
          <div className="bar o"><i style={{ width: pct + "%" }} /></div>
        </div>
        <div className="p-meta">
          <span>Min. {formatAED(project.min_investment)}</span>
          <span className="p-go">View <IconArrow size={15} /></span>
        </div>
      </div>
    </Link>
  );
}
