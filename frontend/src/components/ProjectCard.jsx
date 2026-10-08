import { Link } from "react-router-dom";
import { IconArrow } from "./icons";

export function formatAED(n) {
  if (n == null || n === "") return "—";
  return "AED " + Number(n).toLocaleString("en-US");
}

/**
 * Unit economics from the API (units / reserved / funded / available_units)
 * with a fallback for the offline demo data (target_amount / raised_amount).
 */
export function projectEconomics(p) {
  if (p.units) {
    const units = Number(p.units) || 0;
    const reserved = Number(p.reserved ?? 0);
    const funded = Number(p.funded ?? 0);
    const available = p.available_units != null ? Number(p.available_units) : Math.max(0, units - reserved - funded);
    const allocated = p.allocated_percent != null
      ? Math.round(Number(p.allocated_percent))
      : units ? Math.round(((reserved + funded) / units) * 100) : 0;
    const fundedPct = units ? Math.round((funded / units) * 100) : 0;
    const minInvestment = p.unit_price ? Number(p.unit_price) * (Number(p.min_units) || 1) : null;
    return { units, reserved, funded, available, allocated: Math.min(100, allocated), fundedPct: Math.min(100, fundedPct), minInvestment, unitPrice: p.unit_price };
  }
  const pct = p.target_amount ? Math.min(100, Math.round((p.raised_amount / p.target_amount) * 100)) : 0;
  return { units: 0, allocated: pct, fundedPct: pct, minInvestment: p.min_investment ?? null, raised: p.raised_amount };
}

/** Kept for existing callers: percentage allocated. */
export function progressPct(p) {
  return projectEconomics(p).allocated;
}

export function projectImage(p) {
  return p.cover_image || p.images?.[0]?.url || p.image || "/hero.jpg";
}

const STATUS_LABELS = { funding: "Funding", coming_soon: "Coming soon", evaluation: "Evaluation", closing: "Closing", operating: "Operating" };

const Pin = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const Tag = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 2H2v10l9.3 9.3a1 1 0 0 0 1.4 0l8.6-8.6a1 1 0 0 0 0-1.4Z" /><circle cx="7" cy="7" r="1.5" />
  </svg>
);

export default function ProjectCard({ project }) {
  const e = projectEconomics(project);
  const statusLabel = STATUS_LABELS[project.status] || project.status;
  return (
    <Link to={`/projects/${project.slug}`} className="p-card">
      <div className="p-img">
        <img src={projectImage(project)} alt={project.name} loading="lazy" />
        <span className={`badge ${project.status === "funding" ? "ok" : "mut"}`}>{statusLabel}</span>
      </div>
      <div className="p-body">
        <h3>{project.name}</h3>
        <div className="p-meta-row">
          <span><Pin /> {project.location}</span>
          <span><Tag /> {project.category}</span>
        </div>
        {e.units ? (
          <div className="p-bars">
            <div className="bar-row"><span>Allocated</span><b style={{ color: "var(--orange2)" }}>{e.allocated}%</b></div>
            <div className="bar o"><i style={{ width: e.allocated + "%" }} /></div>
            <div className="bar-row"><span>Funded</span><b style={{ color: "#059669" }}>{e.fundedPct}%</b></div>
            <div className="bar g"><i style={{ width: e.fundedPct + "%" }} /></div>
            <div className="p-counts">{e.reserved} reserved · {e.funded} funded · {e.available} available</div>
          </div>
        ) : (
          <div className="p-bars">
            <div className="bar-row"><span>{e.allocated}% funded</span><b>{formatAED(e.raised)} raised</b></div>
            <div className="bar o"><i style={{ width: e.allocated + "%" }} /></div>
          </div>
        )}
        <div className="p-meta">
          <span>{e.unitPrice ? <>Unit {formatAED(e.unitPrice)}</> : <>Min. {formatAED(e.minInvestment)}</>}</span>
          <span className="p-go">{project.status === "funding" ? "View & reserve" : "View details"} <IconArrow size={15} /></span>
        </div>
      </div>
    </Link>
  );
}
