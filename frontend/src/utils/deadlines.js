/* Deadline severity engine — shared client-side bands.
   Severity bands: <0 Expired · <1 Final day · <3 Critical · <7 Urgent ·
   <15 Attention · <=30 Active · else Normal. Mirrors the bridging-investments demo. */

export const SEVERITY_BANDS = [
  { key: "expired", label: "Expired" },
  { key: "final", label: "Final day" },
  { key: "critical", label: "Critical" },
  { key: "urgent", label: "Urgent" },
  { key: "attention", label: "Attention" },
  { key: "active", label: "Active" },
  { key: "normal", label: "Normal" },
];

/** Band for a day-offset. {key,label} */
export function severityOf(days) {
  if (days == null || Number.isNaN(Number(days))) return { key: "normal", label: "Normal" };
  const d = Number(days);
  if (d < 0) return { key: "expired", label: "Expired" };
  if (d < 1) return { key: "final", label: "Final day" };
  if (d < 3) return { key: "critical", label: "Critical" };
  if (d < 7) return { key: "urgent", label: "Urgent" };
  if (d < 15) return { key: "attention", label: "Attention" };
  if (d <= 30) return { key: "active", label: "Active" };
  return { key: "normal", label: "Normal" };
}

/** Whole calendar days from today until a date string. Negative when past. */
export function daysUntil(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return null;
  const now = new Date();
  const a = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const b = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  return Math.round((b - a) / 86400000);
}

/** Short human label for a day-offset: "5d left" / "Closes today" / "Expired 2d ago". */
export function daysLeftLabel(days) {
  if (days == null) return "—";
  if (days < 0) return `Expired ${Math.abs(Math.round(days))}d ago`;
  if (days < 1) return "Closes today";
  return `${Math.round(days)}d left`;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "30 Nov 2026" for a date string; "—" when unparseable. */
export function formatCloseDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return String(dateStr).slice(0, 10);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/* Badge variants per surface. Admin uses .adm-badge, public/portal use .badge. */
export const SEV_ADM_VARIANT = {
  expired: "gray",
  final: "red",
  critical: "red",
  urgent: "orange",
  attention: "amber",
  active: "blue",
  normal: "gray",
};

export const SEV_BADGE_CLASS = {
  expired: "mut",
  final: "err",
  critical: "err",
  urgent: "warn",
  attention: "warn",
  active: "info",
  normal: "mut",
};
