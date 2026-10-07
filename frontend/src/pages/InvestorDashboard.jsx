import { useEffect, useState } from "react";
import client from "../api/client";
import { DEMO_INVESTOR } from "../data/demo";
import { useAuth } from "../context/AuthContext";
import { IconDoc, IconWallet, IconChart, IconUsers, IconAlert, IconShield } from "../components/icons";

const TABS = [
  { id: "overview", label: "Overview", icon: IconChart },
  { id: "reservations", label: "Reservations", icon: IconUsers },
  { id: "payments", label: "Payments", icon: IconWallet },
  { id: "investments", label: "Investments", icon: IconChart },
  { id: "documents", label: "Documents", icon: IconDoc },
  { id: "profile", label: "Profile", icon: IconUsers },
];

const fmt = (n) => "AED " + Number(n || 0).toLocaleString("en-US");

export default function InvestorDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState("overview");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [ov, rs, py, iv, dc] = await Promise.all([
          client.get("/investor/overview"),
          client.get("/investor/reservations"),
          client.get("/investor/payments"),
          client.get("/investor/investments"),
          client.get("/investor/documents"),
        ]);
        if (alive) setData({
          overview: ov.data.data || ov.data,
          reservations: rs.data.data || rs.data,
          payments: py.data.data || py.data,
          investments: iv.data.data || iv.data,
          documents: dc.data.data || dc.data,
        });
      } catch (err) {
        if (alive) {
          if (!err.response) setData(DEMO_INVESTOR); // offline demo
          else setError("Could not load your dashboard.");
        }
      }
    })();
    return () => { alive = false; };
  }, []);

  return (
    <div className="page">
      <div className="container">
        <div className="page-head" style={{ marginBottom: 30 }}>
          <h1>Welcome, {user?.name?.split(" ")[0] || "investor"}</h1>
          <p>Your stakes, reservations and documents in one place.</p>
        </div>
        {error && <div className="alert error"><IconAlert size={18} /> {error}</div>}
        {!data ? (
          <div className="empty"><span className="spinner" /> Loading your dashboard…</div>
        ) : (
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
              {tab === "documents" && <Documents rows={data.documents} />}
              {tab === "profile" && <Profile user={user} />}
            </div>
          </div>
        )}
      </div>
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
