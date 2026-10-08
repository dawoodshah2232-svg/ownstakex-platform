import { useEffect, useState } from "react";
import client from "../api/client";
import { DEMO_INVESTOR } from "../data/demo";
import { useAuth } from "../context/AuthContext";
import { IconDoc, IconWallet, IconChart, IconUsers, IconAlert, IconShield, IconCheck } from "../components/icons";
import CertificateModal from "../components/CertificateModal";
import { daysUntil, daysLeftLabel, formatCloseDate } from "../utils/deadlines";

const TABS = [
  { id: "overview", label: "Overview", icon: IconChart },
  { id: "reservations", label: "Reservations", icon: IconUsers },
  { id: "payments", label: "Payments", icon: IconWallet },
  { id: "investments", label: "Investments", icon: IconChart },
  { id: "ownership", label: "Ownership", icon: IconShield },
  { id: "statements", label: "Statements", icon: IconDoc },
  { id: "voting", label: "Board & voting", icon: IconCheck },
  { id: "documents", label: "Documents", icon: IconDoc },
  { id: "profile", label: "Profile", icon: IconUsers },
];

const DEFAULT_CERT_DISCLAIMER = "This portal certificate evidences a recorded position. Legal issuance sits in the project company register. Ownership % is of total project equity. Capital at risk — this certificate is not a redemption valuation.";

const fmt = (n) => "AED " + Number(n || 0).toLocaleString("en-US");

const shortDate = (value) => (value ? String(value).slice(0, 10) : "");

const normalizeDashboard = (payload) => {
  const investments = payload.investments || [];
  const reservations = payload.reservations || [];
  const payments = payload.recent_payments || payload.payments || [];
  const documents = payload.documents || [];
  const portfolio = payload.portfolio || {};

  return {
    overview: {
      total_invested: portfolio.total_invested || 0,
      active_stakes: portfolio.active_investments || investments.length,
      lifetime_earnings: portfolio.lifetime_earnings || 0,
      pending_reservations: reservations.filter((r) => r.status !== "confirmed").length,
    },
    reservations: reservations.map((r) => ({
      id: r.id,
      project: r.project?.name || r.project_name || "Project",
      units: r.units,
      amount: r.amount ?? ((Number(r.units) || 0) * (Number(r.unit_price) || 0)),
      status: r.status,
      date: shortDate(r.created_at),
    })),
    payments: payments.map((p) => ({
      id: p.reference || p.id,
      date: shortDate(p.created_at),
      amount: p.amount,
      method: p.method || "bank transfer",
      status: p.status,
    })),
    investments: investments.map((i) => ({
      project: i.project?.name || i.project_name || "Project",
      stake: `${i.units || 0} unit${Number(i.units) === 1 ? "" : "s"}`,
      invested: i.amount,
      current_value: i.current_value || i.amount,
      earnings: i.earnings || 0,
    })),
    documents: documents.map((d) => ({
      name: d.title || d.name,
      type: d.category || d.mime || "Document",
      date: shortDate(d.created_at),
      url: d.file_url || d.url,
    })),
  };
};

const rowsOf = (payload) => {
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload)) return payload;
  return [];
};

const fmtPct = (v) => (v === "" || v == null ? "—" : String(v).includes("%") ? v : `${v}%`);

const normalizeOwnership = (o) => ({
  id: o.id,
  certId: o.certificate?.id || o.cert_id || o.id,
  project_name: o.project?.name || o.project_name || "Project",
  project_code: o.project?.code || o.project_code || "",
  units: o.units || 0,
  amount: o.amount || 0,
  ownership_pct: o.ownership_pct ?? o.ownership ?? "",
  acquired: shortDate(o.acquired_at || o.acquired),
  cert_no: o.certificate?.cert_no || o.cert_no || "",
});

const normalizeStatement = (s) => ({
  id: s.id,
  project_name: s.project_name || s.project || "All holdings",
  period: s.period || "",
  version: s.version ?? 1,
  correction_of_id: s.correction_of_id || null,
  date: shortDate(s.created_at),
});

const normalizePoll = (p) => ({
  id: p.id,
  project_code: p.project_code || "",
  project_name: p.project_name || p.project?.name || "",
  question: p.question || p.title || "",
  options: Array.isArray(p.options) ? p.options : [],
  closes_at: p.closes_at || p.closes || "",
  my_vote: p.my_vote ?? null,
  votes: Array.isArray(p.votes) ? p.votes : null,
});

export default function InvestorDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState("overview");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [crm, setCrm] = useState({ ownership: undefined, statements: undefined, polls: undefined });
  const [cert, setCert] = useState(null);
  const [certLoading, setCertLoading] = useState(null);
  const [voting, setVoting] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data } = await client.get("/investor/dashboard");
        if (!alive) return;
        setData(normalizeDashboard(data.data || data));
        // Advanced CRM endpoints — best effort, fetched independently of the main dashboard
        const [o, s, p] = await Promise.all([
          client.get("/my/ownership").then(({ data }) => rowsOf(data).map(normalizeOwnership)).catch(() => null),
          client.get("/my/statements").then(({ data }) => rowsOf(data).map(normalizeStatement)).catch(() => null),
          client.get("/polls").then(({ data }) => rowsOf(data).map(normalizePoll)).catch(() => null),
        ]);
        if (alive) setCrm({ ownership: o, statements: s, polls: p });
      } catch (err) {
        if (alive) {
          if (!err.response) {
            // offline demo — CRM tabs run on the demo dataset
            setData(DEMO_INVESTOR);
            setCrm({
              ownership: (DEMO_INVESTOR.ownership || []).map(normalizeOwnership),
              statements: (DEMO_INVESTOR.statements || []).map(normalizeStatement),
              polls: (DEMO_INVESTOR.polls || []).map(normalizePoll),
            });
          }
          else if (err.response.status === 401) setError("Please log in again. Your session has expired.");
          else if (err.response.status === 403) setError("This account does not have investor dashboard access.");
          else setError("Could not load your dashboard. Please refresh the page or try again shortly.");
        }
      }
    })();
    return () => { alive = false; };
  }, []);

  const ownershipRows = crm.ownership ?? [];
  const statementRows = crm.statements ?? [];
  const pollRows = crm.polls ?? [];

  const openCertificate = async (row) => {
    const certId = row.certId || row.id;
    setCertLoading(row.id);
    const fallback = {
      holder_name: user?.name || "",
      investor_label: "",
      project_name: row.project_name,
      project_code: row.project_code,
      units: row.units,
      ownership_pct: row.ownership_pct,
      cert_no: row.cert_no,
      acquired_date: row.acquired,
      issued_at: "",
      register_ref: row.project_code ? `REG-${row.project_code}-2026` : "",
      disclaimer: DEFAULT_CERT_DISCLAIMER,
    };
    try {
      if (certId) {
        const { data } = await client.get(`/my/certificates/${certId}`);
        const c = data?.data || data || {};
        setCert({
          holder_name: c.holder_name || fallback.holder_name,
          investor_label: c.investor_label || "",
          project_name: c.project_name || fallback.project_name,
          project_code: c.project_code || fallback.project_code,
          units: c.units ?? fallback.units,
          ownership_pct: c.ownership_pct ?? fallback.ownership_pct,
          cert_no: c.cert_no || fallback.cert_no,
          acquired_date: shortDate(c.acquired_date) || fallback.acquired_date,
          issued_at: shortDate(c.issued_at) || fallback.issued_at,
          register_ref: c.register_ref || fallback.register_ref,
          disclaimer: c.disclaimer || DEFAULT_CERT_DISCLAIMER,
        });
      } else {
        setCert(fallback);
      }
    } catch {
      setCert(fallback); // graceful: certificate built from the holding row
    } finally {
      setCertLoading(null);
    }
  };

  const castVote = async (pollId, optionIndex) => {
    const key = `${pollId}:${optionIndex}`;
    setVoting(key);
    const applyVote = (updater) =>
      setCrm((c) => ({ ...c, polls: (c.polls || []).map((p) => (p.id === pollId ? updater(p) : p)) }));
    try {
      const { data } = await client.post(`/polls/${pollId}/vote`, { option_index: optionIndex });
      const updated = data?.data || data;
      if (updated && typeof updated === "object" && (updated.my_vote != null || updated.votes)) {
        applyVote(() => normalizePoll({ ...updated, id: pollId }));
      } else {
        throw new Error("no poll payload");
      }
    } catch {
      // offline/demo: record the vote locally with incremented counts
      applyVote((p) => {
        const votes = Array.isArray(p.votes) ? [...p.votes] : p.options.map(() => 0);
        votes[optionIndex] = (Number(votes[optionIndex]) || 0) + 1;
        return { ...p, my_vote: optionIndex, votes };
      });
    } finally {
      setVoting(null);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-head" style={{ marginBottom: 30 }}>
          <h1>Welcome, {user?.name?.split(" ")[0] || "investor"}</h1>
          <p>Your stakes, reservations and documents in one place.</p>
        </div>
        {error && <div className="alert error"><IconAlert size={18} /> {error}</div>}
        {!data && !error ? (
          <div className="empty"><span className="spinner" /> Loading your dashboard…</div>
        ) : data ? (
          <div className="dash">
            <aside className="dash-side" aria-label="Dashboard sections">
              {TABS.map((t) => (
                <button key={t.id} className={tab === t.id ? "on" : ""} onClick={() => setTab(t.id)}>
                  <t.icon size={17} /> {t.label}
                </button>
              ))}
            </aside>
            <div className="dash-main">
              {tab === "overview" && <Overview data={data.overview} />}
              {tab === "reservations" && <Reservations rows={data.reservations} />}
              {tab === "payments" && <Payments rows={data.payments} />}
              {tab === "investments" && <Investments rows={data.investments} />}
              {tab === "ownership" && (
                <OwnershipTab
                  rows={ownershipRows}
                  loading={crm.ownership === undefined}
                  onCertificate={openCertificate}
                  certLoading={certLoading}
                />
              )}
              {tab === "statements" && (
                <StatementsTab rows={statementRows} loading={crm.statements === undefined} />
              )}
              {tab === "voting" && (
                <VotingTab rows={pollRows} loading={crm.polls === undefined} onVote={castVote} voting={voting} />
              )}
              {tab === "documents" && <Documents rows={data.documents} />}
              {tab === "profile" && <Profile user={user} />}
            </div>
          </div>
        ) : (
          <div className="empty">Dashboard data is not available right now.</div>
        )}
      </div>
      {cert && <CertificateModal cert={cert} onClose={() => setCert(null)} />}
    </div>
  );
}

function Overview({ data }) {
  const cards = [
    { k: "Total invested", v: fmt(data.total_invested) },
    { k: "Active stakes", v: data.active_stakes },
    { k: "Lifetime earnings", v: fmt(data.lifetime_earnings) },
    { k: "Pending reservations", v: data.pending_reservations },
  ];
  return (
    <>
      <div className="stat-grid">
        {cards.map((c) => (
          <div className="stat-card" key={c.k}><div className="k">{c.k}</div><div className="v">{c.v}</div></div>
        ))}
      </div>
      <div className="alert info"><IconShield size={18} /><span>Capital at risk. Values shown are estimates based on the latest available data.</span></div>
    </>
  );
}

function Reservations({ rows }) {
  return (
    <div className="panel">
      <div className="panel-head"><h3>Reservations</h3><span className="badge mut">{rows.length}</span></div>
      <table className="tbl">
        <thead><tr><th>ID</th><th>Project</th><th>Units</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td><b>{r.id}</b></td><td>{r.project}</td><td>{r.units}</td><td>{fmt(r.amount)}</td>
              <td><span className={`badge ${r.status === "confirmed" ? "ok" : "warn"}`}>{r.status}</span></td>
              <td>{r.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Payments({ rows }) {
  return (
    <div className="panel">
      <div className="panel-head"><h3>Payments</h3></div>
      <table className="tbl">
        <thead><tr><th>ID</th><th>Date</th><th>Amount</th><th>Method</th><th>Status</th></tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td><b>{r.id}</b></td><td>{r.date}</td><td>{fmt(r.amount)}</td><td>{r.method}</td>
              <td><span className={`badge ${r.status === "completed" ? "ok" : "warn"}`}>{r.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Investments({ rows }) {
  return (
    <div className="panel">
      <div className="panel-head"><h3>My investments</h3></div>
      <table className="tbl">
        <thead><tr><th>Project</th><th>Stake</th><th>Invested</th><th>Current value</th><th>Earnings</th></tr></thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td><b>{r.project}</b></td><td>{r.stake}</td><td>{fmt(r.invested)}</td>
              <td>{fmt(r.current_value)}</td><td style={{ color: "var(--orange-deep)", fontWeight: 700 }}>{fmt(r.earnings)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ fontSize: 13, color: "var(--dim)", marginTop: 14 }}>Capital at risk. Current values are estimates, not guarantees.</p>
    </div>
  );
}

function OwnershipTab({ rows, loading, onCertificate, certLoading }) {
  return (
    <div className="panel">
      <div className="panel-head"><h3>Ownership</h3><span className="badge mut">{rows.length}</span></div>
      {loading ? (
        <div className="empty"><span className="spinner" /> Loading holdings…</div>
      ) : rows.length === 0 ? (
        <div className="empty">No holdings yet. Your ownership certificates will appear here once investments are issued.</div>
      ) : (
        <table className="tbl">
          <thead><tr><th>Project</th><th>Units</th><th>Ownership</th><th>Acquired</th><th>Certificate</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td><b>{r.project_name}</b>{r.project_code && <div className="dm">{r.project_code}</div>}</td>
                <td>{r.units}</td>
                <td>{fmtPct(r.ownership_pct)}</td>
                <td>{r.acquired || "—"}</td>
                <td>
                  <button className="btn btn-ghost btn-sm" disabled={certLoading === r.id} onClick={() => onCertificate(r)}>
                    {certLoading === r.id ? <><span className="spinner" /> Loading…</> : "Certificate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <p style={{ fontSize: 13, color: "var(--dim)", marginTop: 14 }}>
        Ownership % is of total project equity. A portal certificate evidences a recorded position — legal issuance sits in the company register.
      </p>
    </div>
  );
}

function StatementsTab({ rows, loading }) {
  const versionLabel = (s) => {
    let label = `v${s.version}`;
    if (s.correction_of_id) {
      const corrected = rows.find((r) => String(r.id) === String(s.correction_of_id));
      label += corrected ? ` — corrects v${corrected.version}` : " — corrects an earlier statement";
    }
    return label;
  };
  return (
    <div className="panel">
      <div className="panel-head"><h3>Statements</h3><span className="badge mut">{rows.length}</span></div>
      {loading ? (
        <div className="empty"><span className="spinner" /> Loading statements…</div>
      ) : rows.length === 0 ? (
        <div className="empty">No statements yet. Monthly statements appear here after each reporting period.</div>
      ) : (
        <table className="tbl">
          <thead><tr><th>Period</th><th>Project</th><th>Version</th><th>Published</th></tr></thead>
          <tbody>
            {rows.map((s) => (
              <tr key={s.id}>
                <td><b>{s.period || "—"}</b></td>
                <td>{s.project_name}</td>
                <td><span className={`badge ${s.correction_of_id ? "warn" : "ok"}`}>{versionLabel(s)}</span></td>
                <td>{s.date || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <p style={{ fontSize: 13, color: "var(--dim)", marginTop: 14 }}>
        Corrections create a new version — published statements are never edited.
      </p>
    </div>
  );
}

function VotingTab({ rows, loading, onVote, voting }) {
  return (
    <div>
      <p style={{ color: "var(--dim)", fontSize: 14, marginBottom: 18 }}>
        Investor votes are enabled only where the governing documents grant the right.
      </p>
      {loading ? (
        <div className="panel"><div className="empty"><span className="spinner" /> Loading polls…</div></div>
      ) : rows.length === 0 ? (
        <div className="panel"><div className="empty">No polls at the moment. Open votes will appear here.</div></div>
      ) : (
        rows.map((p) => <PollCard key={p.id} poll={p} onVote={onVote} voting={voting} />)
      )}
    </div>
  );
}

function PollCard({ poll, onVote, voting }) {
  const days = poll.closes_at ? daysUntil(poll.closes_at) : null;
  const closed = days != null && days < 0;
  const total = (poll.votes || []).reduce((a, b) => a + (Number(b) || 0), 0);
  const showResults = (poll.my_vote != null || closed) && Array.isArray(poll.votes);

  return (
    <div className="poll-card">
      <div className="poll-meta">
        <span className={`badge ${closed ? "mut" : "info"}`}>{closed ? "Closed" : "Open"}</span>
        {poll.project_name && (
          <span>{poll.project_name}{poll.project_code ? ` · ${poll.project_code}` : ""}</span>
        )}
        {poll.closes_at && (
          <span>Closes {formatCloseDate(poll.closes_at)}{days != null && days >= 0 ? ` · ${daysLeftLabel(days)}` : ""}</span>
        )}
      </div>
      <div className="poll-q">{poll.question}</div>
      {poll.my_vote != null && poll.options[poll.my_vote] && (
        <div className="poll-voted"><IconCheck size={16} /> You voted: {poll.options[poll.my_vote]}</div>
      )}
      {showResults ? (
        <div>
          {poll.options.map((opt, i) => {
            const count = Number(poll.votes[i]) || 0;
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            return (
              <div className="poll-result" key={i}>
                <div className="bar-row">
                  <span>{opt}{poll.my_vote === i ? " — your vote" : ""}</span>
                  <b>{count} ({pct}%)</b>
                </div>
                <div className="bar o"><i style={{ width: pct + "%" }} /></div>
              </div>
            );
          })}
        </div>
      ) : !closed && poll.options.length > 0 ? (
        <div className="poll-opts">
          {poll.options.map((opt, i) => (
            <button
              key={i}
              className="btn btn-ghost btn-sm"
              disabled={voting === `${poll.id}:${i}`}
              onClick={() => onVote(poll.id, i)}
            >
              {voting === `${poll.id}:${i}` ? <><span className="spinner" /> Recording…</> : opt}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function Documents({ rows }) {
  return (
    <div className="panel">
      <div className="panel-head"><h3>Documents</h3></div>
      {rows.map((d, i) => (
        <div className="doc-row" key={i}>
          <span style={{ color: "var(--orange)" }}><IconDoc size={20} /></span>
          <div className="grow"><b>{d.name}</b><div className="dm">{d.type} · {d.date}</div></div>
          <button className="btn btn-ghost btn-sm">Download</button>
        </div>
      ))}
    </div>
  );
}

function Profile({ user }) {
  return (
    <div className="panel" style={{ maxWidth: 560 }}>
      <div className="panel-head"><h3>Profile</h3><span className="badge ok">Verified</span></div>
      <div className="field"><label>Name</label><input defaultValue={user?.name || ""} /></div>
      <div className="field"><label>Email</label><input defaultValue={user?.email || ""} disabled /></div>
      <div className="field"><label>Phone</label><input placeholder="+971 …" /></div>
      <button className="btn btn-primary">Save changes</button>
    </div>
  );
}
