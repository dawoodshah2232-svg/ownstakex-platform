import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";
import {
  DEMO_ADMIN, DEMO_PROJECTS, DEMO_TREASURY, DEMO_AUDIT,
} from "../data/demo";
import { useAuth } from "../context/AuthContext";
import { formatAED } from "../components/ProjectCard";
import {
  IconChart, IconBuilding, IconDoc, IconAlert, IconCheck, IconClose,
  IconUpload, IconShield, IconUsers, IconWallet, IconMail, IconMenu, IconLogout,
} from "../components/icons";

/* ---------------- nav definition ---------------- */
const NAV = [
  { sec: "COMMAND" },
  { id: "overview", label: "Overview", icon: IconChart },
  { sec: "OPERATIONS" },
  { id: "projects", label: "Projects", icon: IconBuilding },
  { id: "campaigns", label: "Campaigns", icon: IconAlert },
  { id: "treasury", label: "Treasury", icon: IconWallet },
  { id: "investors", label: "Investors", icon: IconUsers },
  { id: "compliance", label: "Compliance & KYC", icon: IconShield },
  { id: "documents", label: "Documents", icon: IconDoc },
  { sec: "SYSTEM" },
  { id: "announcements", label: "Announcements", icon: IconMail },
  { id: "audit", label: "Audit log", icon: IconCheck },
];

const TITLES = {
  overview: ["Overview", "Platform health at a glance."],
  projects: ["Projects", "Create, edit and publish investment projects — media and documents included."],
  campaigns: ["Campaigns", "Live funding progress across all projects."],
  treasury: ["Treasury", "Money in, money out — every dirham accounted for."],
  investors: ["Investors", "Registered investors and their KYC standing."],
  compliance: ["Compliance & KYC", "Review identity checks before anyone can invest."],
  documents: ["Document library", "Every brochure, term sheet and report investors can download."],
  announcements: ["Announcements", "Broadcast updates to investors."],
  audit: ["Audit log", "Immutable record of admin actions."],
};

const statusBadge = (s) => {
  const m = { funding: "green", funded: "orange", draft: "gray", coming_soon: "blue", active: "green", pending: "amber" };
  return m[s] || "gray";
};

/* ---------------- shared UI atoms ---------------- */
function StatCard({ icon: Icon, value, label, tint }) {
  const tints = {
    orange: { bg: "#ffedd5", fg: "#ea580c" },
    blue: { bg: "#dbeafe", fg: "#1d4ed8" },
    green: { bg: "#dcfce7", fg: "#15803d" },
    violet: { bg: "#ede9fe", fg: "#6d28d9" },
    amber: { bg: "#fef3c7", fg: "#b45309" },
  };
  const t = tints[tint] || tints.orange;
  return (
    <div className="adm-stat">
      <div className="adm-tile" style={{ background: t.bg, color: t.fg }}><Icon size={22} /></div>
      <div><div className="adm-stat-v">{value}</div><div className="adm-stat-l">{label}</div></div>
    </div>
  );
}

function Panel({ title, sub, children, style }) {
  return (
    <div className="adm-panel" style={style}>
      {title && <h3>{title}</h3>}
      {sub && <div className="adm-psub">{sub}</div>}
      {children}
    </div>
  );
}

function Badge({ variant, children }) {
  return <span className={`adm-badge ${variant || "gray"}`}>{children}</span>;
}

function Btn({ variant, children, ...rest }) {
  return <button className={`adm-btn ${variant || "secondary"}`} {...rest}>{children}</button>;
}

function Field({ label, children }) {
  return (
    <div className="adm-field">
      <label>{label}</label>
      {children}
    </div>
  );
}

function Modal({ onClose, children, label }) {
  return (
    <div className="adm-modal-overlay" role="dialog" aria-label={label || "Dialog"}>
      <div className="adm-modal">
        <button className="adm-modal-x" onClick={onClose} aria-label="Close"><IconClose size={15} /></button>
        {children}
      </div>
    </div>
  );
}

function PageHead({ tab }) {
  const [t, s] = TITLES[tab] || ["", ""];
  return (
    <div style={{ marginBottom: 4 }}>
      <h1 className="adm-h1">{t}</h1>
      <p className="adm-sub">{s}</p>
    </div>
  );
}

function Notice({ notice, clear }) {
  if (!notice) return null;
  const ok = notice.startsWith("ok:");
  return (
    <div className={`adm-alert ${ok ? "ok" : "err"}`}>
      {ok ? <IconCheck size={18} /> : <IconAlert size={18} />}
      <span style={{ flex: 1 }}>{notice.slice(3)}</span>
      <button onClick={clear} style={{ background: "none", border: 0, cursor: "pointer", color: "inherit" }} aria-label="Dismiss">
        <IconClose size={15} />
      </button>
    </div>
  );
}

/* ================= main dashboard ================= */
export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("overview");
  const [drawer, setDrawer] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    const tryGet = async (path) => {
      try {
        const { data } = await client.get(path);
        return data.data || data;
      } catch { return null; }
    };
    (async () => {
      try {
        const [ov, pj, dc, iv, an] = await Promise.all([
          client.get("/admin/overview"),
          client.get("/admin/projects"),
          client.get("/admin/documents"),
          client.get("/admin/investors"),
          client.get("/admin/announcements"),
        ]);
        if (!alive) return;
        const [campaigns, treasury, audit] = await Promise.all([
          tryGet("/admin/campaigns"),
          tryGet("/admin/treasury"),
          tryGet("/admin/audit-log"),
        ]);
        if (alive) setData({
          overview: ov.data.data || ov.data,
          projects: pj.data.data || pj.data,
          documents: dc.data.data || dc.data,
          investors: iv.data.data || iv.data,
          announcements: an.data.data || an.data,
          campaigns: campaigns || null,
          treasury: treasury || null,
          audit: audit || null,
        });
      } catch (err) {
        if (alive) {
          if (!err.response) {
            setData({
              ...DEMO_ADMIN,
              projects: DEMO_PROJECTS.map((p) => ({ ...p, media: [], documents: [] })),
              campaigns: null, treasury: null, audit: null,
            });
          } else setError("Could not load admin data.");
        }
      }
    })();
    return () => { alive = false; };
  }, []);

  const refreshProjects = async () => {
    try {
      const { data } = await client.get("/admin/projects");
      setData((d) => ({ ...d, projects: data.data || data }));
    } catch { /* demo: local state already updated */ }
  };

  const doLogout = async () => {
    await logout();
    navigate("/login");
  };

  const displayName = user?.name || "S. Iqbal";
  const initials = displayName.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  const goTab = (id) => { setTab(id); setDrawer(false); window.scrollTo({ top: 0 }); };

  return (
    <div className="adm">
      {/* ---------- sidebar ---------- */}
      {drawer && <button className="adm-backdrop" onClick={() => setDrawer(false)} aria-label="Close menu" />}
      <aside className={`adm-side${drawer ? " open" : ""}`} aria-label="Admin sections">
        <div className="adm-brand">
          <span className="adm-logo-box"><img src="/logo.png" alt="OwnStakeX" /></span>
          <small>Command Center</small>
        </div>
        <nav style={{ flex: 1, overflowY: "auto" }}>
          {NAV.map((n, i) => n.sec ? (
            <div className="adm-sec" key={"s" + i}>{n.sec}</div>
          ) : (
            <button key={n.id} className={`adm-nav${tab === n.id ? " on" : ""}`} onClick={() => goTab(n.id)}>
              <n.icon size={16} /> {n.label}
            </button>
          ))}
        </nav>
        <div className="adm-foot">
          <span className="adm-demo-badge">DEMO DATA</span>
          <button className="adm-logout" onClick={doLogout}><IconLogout size={15} /> Logout</button>
        </div>
      </aside>

      {/* ---------- main column ---------- */}
      <div className="adm-main">
        <div className="adm-top">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button className="adm-burger" onClick={() => setDrawer(true)} aria-label="Open menu"><IconMenu size={20} /></button>
            <span className="adm-top-title">Admin CRM</span>
          </div>
          <div className="adm-user">
            <div className="adm-user-meta"><b>{displayName}</b><span>System admin</span></div>
            <div className="adm-avatar">{initials}</div>
          </div>
        </div>

        <div className="adm-content">
          <PageHead tab={tab} />
          {error && <div className="adm-alert err" style={{ marginTop: 16 }}><IconAlert size={18} /> {error}</div>}
          {!data ? (
            <div className="adm-empty"><span className="adm-spinner" /> Loading command center…</div>
          ) : (
            <div style={{ marginTop: 4 }}>
              {tab === "overview" && <Overview data={data} goTab={goTab} />}
              {tab === "projects" && <ProjectsTab projects={data.projects} setData={setData} refresh={refreshProjects} />}
              {tab === "campaigns" && <CampaignsTab projects={data.projects} />}
              {tab === "treasury" && <TreasuryTab data={data.treasury || DEMO_TREASURY} />}
              {tab === "investors" && <InvestorsTab rows={data.investors} />}
              {tab === "compliance" && <ComplianceTab rows={data.investors} setData={setData} />}
              {tab === "documents" && <LibraryTab docs={data.documents?.length ? data.documents : (DEMO_ADMIN.library || [])} setData={setData} />}
              {tab === "announcements" && <AnnouncementsTab rows={data.announcements} setData={setData} />}
              {tab === "audit" && <AuditTab rows={data.audit || DEMO_AUDIT} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================= Overview ================= */
function Overview({ data, goTab }) {
  const ov = data.overview || {};
  const investors = data.investors || [];
  const projects = data.projects || [];
  const pendingKyc = investors.filter((u) => u.kyc === "pending");
  const audit = data.audit || DEMO_AUDIT;
  const slow = projects.filter((p) => {
    const t = Number(p.target_amount) || 0;
    return t > 0 && (Number(p.raised_amount) || 0) / t < 0.75 && p.status === "funding";
  });

  return (
    <div>
      <div className="adm-stats">
        <StatCard icon={IconUsers} tint="blue" value={(ov.users || 0).toLocaleString()} label="Registered users" />
        <StatCard icon={IconBuilding} tint="orange" value={ov.projects ?? projects.length} label="Projects" />
        <StatCard icon={IconWallet} tint="green" value={formatAED(ov.total_raised || 0)} label="Total raised" />
        <StatCard icon={IconShield} tint="amber" value={ov.pending_kyc ?? pendingKyc.length} label="Pending KYC" />
      </div>
      <div className="adm-grid-2">
        <Panel title="Recent activity" sub="Latest platform events">
          {audit.slice(0, 4).map((a) => (
            <div key={a.id} className="adm-doc-row">
              <div style={{ flex: 1 }}>
                <b style={{ fontSize: 14 }}>{a.action}</b>
                <div style={{ fontSize: 12.5, color: "#6b7280" }}>{a.detail} · {a.time}</div>
              </div>
            </div>
          ))}
        </Panel>
        <Panel title="Needs attention" sub="Items requiring an admin decision">
          {pendingKyc.length === 0 && slow.length === 0 && (
            <p style={{ fontSize: 14, color: "#6b7280" }}>All clear — nothing waiting on you.</p>
          )}
          {pendingKyc.slice(0, 3).map((u) => (
            <div key={u.id} className="adm-doc-row">
              <div style={{ flex: 1 }}>
                <b style={{ fontSize: 14 }}>{u.name}</b>
                <div style={{ fontSize: 12.5, color: "#6b7280" }}>KYC application awaiting review</div>
              </div>
              <Badge variant="amber">KYC</Badge>
              <Btn variant="secondary" onClick={() => goTab("compliance")}>Review</Btn>
            </div>
          ))}
          {slow.map((p) => (
            <div key={p.id} className="adm-doc-row">
              <div style={{ flex: 1 }}>
                <b style={{ fontSize: 14 }}>{p.name}</b>
                <div style={{ fontSize: 12.5, color: "#6b7280" }}>Funding below 75% of target</div>
              </div>
              <Badge variant="orange">Campaign</Badge>
              <Btn variant="secondary" onClick={() => goTab("campaigns")}>View</Btn>
            </div>
          ))}
        </Panel>
      </div>
    </div>
  );
}

/* ================= Projects (media + document management) ================= */
function ProjectsTab({ projects, setData, refresh }) {
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  const saveProject = async (payload) => {
    setSaving(true);
    setNotice("");
    try {
      if (editing?.id && !String(editing.id).startsWith("demo")) {
        const { data } = await client.put(`/admin/projects/${editing.id}`, payload);
        setData((d) => ({ ...d, projects: d.projects.map((p) => (p.id === editing.id ? (data.data || data) : p)) }));
      } else if (editing?.id) {
        setData((d) => ({ ...d, projects: d.projects.map((p) => (p.id === editing.id ? { ...p, ...payload } : p)) }));
      } else {
        const { data } = await client.post("/admin/projects", payload);
        setData((d) => ({ ...d, projects: [...d.projects, data.data || data] }));
      }
      setNotice("ok:Project saved.");
      setEditing(null);
      refresh();
    } catch (err) {
      if (!err.response && editing) {
        setData((d) => {
          if (editing.id) return { ...d, projects: d.projects.map((p) => (p.id === editing.id ? { ...p, ...payload } : p)) };
          return { ...d, projects: [...d.projects, { ...payload, id: "demo-" + Date.now(), slug: payload.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") }] };
        });
        setNotice("ok:Saved locally (demo mode — API offline).");
        setEditing(null);
      } else {
        setNotice("err:" + (err.response?.data?.message || "Save failed."));
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", margin: "16px 0" }}>
        <Btn variant="primary" onClick={() => setEditing({ id: null })}>+ New project</Btn>
      </div>
      <Notice notice={notice} clear={() => setNotice("")} />
      <Panel>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead><tr><th>Project</th><th>Category</th><th>Status</th><th>Raised</th><th>Media</th><th></th></tr></thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id}>
                  <td><b>{p.name}</b><div style={{ fontSize: 12.5, color: "#6b7280" }}>{p.location}</div></td>
                  <td>{p.category}</td>
                  <td><Badge variant={statusBadge(p.status)}>{p.status?.replace(/_/g, " ")}</Badge></td>
                  <td>{formatAED(p.raised_amount)}</td>
                  <td style={{ fontSize: 13, color: "#6b7280" }}>{(p.media || []).length} photos · {(p.documents || []).length} docs</td>
                  <td style={{ textAlign: "right" }}>
                    <Btn variant="secondary" onClick={() => setEditing(p)}>Manage</Btn>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
      {editing !== null && (
        <Modal onClose={() => setEditing(null)} label="Project editor">
          <ProjectEditor
            project={editing.id ? editing : null}
            saving={saving}
            onSave={saveProject}
            onClose={() => setEditing(null)}
          />
        </Modal>
      )}
    </div>
  );
}

function ProjectEditor({ project, saving, onSave, onClose }) {
  const [form, setForm] = useState({
    name: project?.name || "",
    tagline: project?.tagline || "",
    category: project?.category || "Real Estate",
    location: project?.location || "",
    status: project?.status || "draft",
    target_amount: project?.target_amount || "",
    min_investment: project?.min_investment || "",
    expected_yield: project?.expected_yield || "",
    description: project?.description || "",
  });
  const [media, setMedia] = useState(project?.media || []);
  const [docs, setDocs] = useState(project?.documents || []);
  const [newMediaUrl, setNewMediaUrl] = useState("");
  const [newDoc, setNewDoc] = useState({ name: "", url: "" });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const addMediaUrl = () => {
    if (!newMediaUrl.trim()) return;
    setMedia((m) => [...m, { id: "m" + Date.now(), url: newMediaUrl.trim(), kind: "image" }]);
    setNewMediaUrl("");
  };

  const uploadMedia = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    fd.append("project_id", project?.id || "new");
    try {
      const { data } = await client.post("/admin/media", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setMedia((m) => [...m, data.data || data]);
    } catch (err) {
      if (!err.response) {
        setMedia((m) => [...m, { id: "m" + Date.now(), url: URL.createObjectURL(file), kind: file.type.startsWith("video") ? "video" : "image", name: file.name, local: true }]);
      }
    }
    e.target.value = "";
  };

  const removeMedia = async (id) => {
    setMedia((m) => m.filter((x) => x.id !== id));
    try { await client.delete(`/admin/media/${id}`); } catch { /* demo */ }
  };

  const addDoc = () => {
    if (!newDoc.name.trim() || !newDoc.url.trim()) return;
    setDocs((d) => [...d, { id: "d" + Date.now(), name: newDoc.name.trim(), url: newDoc.url.trim(), type: "PDF" }]);
    setNewDoc({ name: "", url: "" });
  };

  const removeDoc = (id) => setDocs((d) => d.filter((x) => x.id !== id));

  const submit = (e) => {
    e.preventDefault();
    onSave({ ...form, target_amount: Number(form.target_amount) || 0, min_investment: Number(form.min_investment) || 0, media, documents: docs });
  };

  return (
    <div>
      <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>{project ? "Manage project" : "New project"}</h3>
      <p style={{ fontSize: 13.5, color: "#6b7280", marginBottom: 20 }}>Changes publish to the live site on save.</p>
      <form onSubmit={submit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 14px" }} className="adm-form-grid">
          <Field label="Project name"><input className="adm-input" value={form.name} onChange={set("name")} required /></Field>
          <Field label="Tagline"><input className="adm-input" value={form.tagline} onChange={set("tagline")} /></Field>
          <Field label="Category">
            <select className="adm-select" value={form.category} onChange={set("category")}>
              <option>Real Estate</option><option>Yachts</option><option>Hospitality</option><option>Businesses</option>
            </select>
          </Field>
          <Field label="Location"><input className="adm-input" value={form.location} onChange={set("location")} /></Field>
          <Field label="Status">
            <select className="adm-select" value={form.status} onChange={set("status")}>
              <option value="draft">Draft</option><option value="funding">Funding</option>
              <option value="funded">Funded</option><option value="coming_soon">Coming soon</option>
            </select>
          </Field>
          <Field label="Target amount (AED)"><input className="adm-input" type="number" min="0" value={form.target_amount} onChange={set("target_amount")} /></Field>
          <Field label="Min. investment (AED)"><input className="adm-input" type="number" min="0" value={form.min_investment} onChange={set("min_investment")} /></Field>
          <Field label="Target yield (e.g. 7.2%)"><input className="adm-input" value={form.expected_yield} onChange={set("expected_yield")} placeholder="7.2%" /></Field>
        </div>
        <Field label="Description"><textarea className="adm-textarea" rows={4} value={form.description} onChange={set("description")} /></Field>

        <h4 style={{ fontSize: 15, fontWeight: 800, margin: "22px 0 4px" }}>Media — photos & videos</h4>
        <p style={{ fontSize: 12.5, color: "#6b7280", marginBottom: 6 }}>Uploads go to the API when online; offline demo uploads are temporary.</p>
        <div className="adm-media-grid">
          {media.map((m) => (
            <div className="adm-media-thumb" key={m.id}>
              {m.kind === "video"
                ? <video src={m.url} />
                : <img src={m.url} alt={m.name || "Project media"} />}
              <button type="button" onClick={() => removeMedia(m.id)} aria-label="Remove media"><IconClose size={12} /></button>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
          <input className="adm-input" placeholder="Paste image/video URL then Add" value={newMediaUrl}
            onChange={(e) => setNewMediaUrl(e.target.value)} style={{ flex: 1, minWidth: 200 }} />
          <Btn type="button" onClick={addMediaUrl}>Add URL</Btn>
          <label className="adm-btn secondary" style={{ cursor: "pointer" }}>
            <IconUpload size={15} /> Upload
            <input type="file" accept="image/*,video/*" onChange={uploadMedia} style={{ display: "none" }} />
          </label>
        </div>

        <h4 style={{ fontSize: 15, fontWeight: 800, margin: "22px 0 4px" }}>Documents</h4>
        {docs.map((d) => (
          <div className="adm-doc-row" key={d.id}>
            <div style={{ flex: 1 }}><b style={{ fontSize: 14 }}>{d.name}</b><div style={{ fontSize: 12.5, color: "#6b7280" }}>{d.type || "PDF"}</div></div>
            <Btn type="button" variant="danger-ghost" onClick={() => removeDoc(d.id)}>Remove</Btn>
          </div>
        ))}
        <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
          <input className="adm-input" placeholder="Document name" value={newDoc.name}
            onChange={(e) => setNewDoc((s) => ({ ...s, name: e.target.value }))} style={{ flex: 1, minWidth: 160 }} />
          <input className="adm-input" placeholder="File URL (https://…)" value={newDoc.url}
            onChange={(e) => setNewDoc((s) => ({ ...s, url: e.target.value }))} style={{ flex: 2, minWidth: 200 }} />
          <Btn type="button" onClick={addDoc}>Add document</Btn>
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 26 }}>
          <Btn type="submit" variant="primary" disabled={saving} style={{ flex: 1 }}>
            {saving ? <><span className="adm-spinner" /> Saving…</> : "Save project"}
          </Btn>
          <Btn type="button" onClick={onClose}>Cancel</Btn>
        </div>
      </form>
    </div>
  );
}

/* ================= Campaigns ================= */
function CampaignsTab({ projects }) {
  return (
    <div>
      <div style={{ margin: "16px 0" }} />
      <Panel>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead><tr><th>Campaign</th><th>Progress</th><th>Investors</th><th>Raised</th><th>Status</th></tr></thead>
            <tbody>
              {projects.map((p) => {
                const t = Number(p.target_amount) || 0;
                const r = Number(p.raised_amount) || 0;
                const pct = t > 0 ? Math.min(100, Math.round((r / t) * 100)) : 0;
                return (
                  <tr key={p.id}>
                    <td><b>{p.name}</b><div style={{ fontSize: 12.5, color: "#6b7280" }}>{p.location}</div></td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div className="adm-progress" style={{ flex: 1 }}><i style={{ width: pct + "%" }} /></div>
                        <b style={{ fontSize: 13 }}>{pct}%</b>
                      </div>
                    </td>
                    <td>{p.investors_count ?? "—"}</td>
                    <td>{formatAED(r)} <span style={{ color: "#9ca3af", fontSize: 12.5 }}>/ {formatAED(t)}</span></td>
                    <td><Badge variant={statusBadge(p.status)}>{p.status?.replace(/_/g, " ")}</Badge></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
      <p style={{ fontSize: 12.5, color: "#6b7280", marginTop: 12 }}>Capital at risk. Figures shown are live campaign totals.</p>
    </div>
  );
}

/* ================= Treasury ================= */
function TreasuryTab({ data }) {
  return (
    <div>
      <div className="adm-stats" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        <StatCard icon={IconWallet} tint="green" value={formatAED(data.total_raised)} label="Total raised" />
        <StatCard icon={IconAlert} tint="amber" value={formatAED(data.pending_payouts)} label="Pending payouts" />
        <StatCard icon={IconCheck} tint="blue" value={formatAED(data.paid_out)} label="Paid out to investors" />
      </div>
      <Panel title="Recent transactions" sub="Deposits, distributions and refunds">
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead><tr><th>ID</th><th>Date</th><th>Type</th><th>Project</th><th>Amount</th><th>Status</th></tr></thead>
            <tbody>
              {(data.transactions || []).map((t) => (
                <tr key={t.id}>
                  <td><b>{t.id}</b></td><td>{t.date}</td><td>{t.type}</td><td>{t.project}</td>
                  <td><b>{formatAED(t.amount)}</b></td>
                  <td><Badge variant={t.status === "completed" ? "green" : "amber"}>{t.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
      <p style={{ fontSize: 12.5, color: "#6b7280", marginTop: 12 }}>Capital at risk. Payouts require maker–checker approval in production.</p>
    </div>
  );
}

/* ================= Investors ================= */
function InvestorsTab({ rows }) {
  return (
    <div>
      <div style={{ margin: "16px 0" }} />
      <Panel>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead><tr><th>Name</th><th>Email</th><th>Invested</th><th>KYC</th><th>Joined</th></tr></thead>
            <tbody>
            {rows.map((u) => (
              <tr key={u.id}>
                <td><b>{u.name}</b></td><td>{u.email}</td><td>{formatAED(u.invested)}</td>
                <td><Badge variant={u.kyc === "verified" ? "green" : u.kyc === "rejected" ? "red" : "amber"}>{u.kyc}</Badge></td>
                <td>{u.joined}</td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </Panel>
      <p style={{ fontSize: 13, color: "#6b7280", marginTop: 12, display: "flex", gap: 8, alignItems: "center" }}>
        <IconShield size={15} /> KYC reviews and payouts require maker–checker approval in production.
      </p>
    </div>
  );
}

/* ================= Compliance & KYC ================= */
function ComplianceTab({ rows, setData }) {
  const [busy, setBusy] = useState(null);
  const pending = rows.filter((u) => u.kyc === "pending");

  const decide = async (id, verdict) => {
    setBusy(id);
    try { await client.put(`/admin/investors/${id}/kyc`, { status: verdict }); } catch { /* demo */ }
    setData((d) => ({ ...d, investors: d.investors.map((u) => (u.id === id ? { ...u, kyc: verdict } : u)) }));
    setBusy(null);
  };

  return (
    <div>
      <div style={{ margin: "16px 0" }} />
      <Panel title="Pending review" sub={`${pending.length} application${pending.length === 1 ? "" : "s"} waiting`}>
        {pending.length === 0 ? (
          <p style={{ fontSize: 14, color: "#6b7280" }}>Queue is clear — every investor is verified.</p>
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead><tr><th>Applicant</th><th>Email</th><th>Joined</th><th style={{ textAlign: "right" }}>Decision</th></tr></thead>
              <tbody>
                {pending.map((u) => (
                  <tr key={u.id}>
                    <td><b>{u.name}</b></td><td>{u.email}</td><td>{u.joined}</td>
                    <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                      <Btn variant="primary" disabled={busy === u.id} onClick={() => decide(u.id, "verified")} style={{ marginRight: 8 }}>
                        {busy === u.id ? <span className="adm-spinner" /> : "Approve"}
                      </Btn>
                      <Btn variant="danger-ghost" disabled={busy === u.id} onClick={() => decide(u.id, "rejected")}>Reject</Btn>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
      <Panel title="Verification checklist" sub="Every approval confirms all of the following" style={{ marginTop: 16 }}>
        {["Government ID verified against selfie", "Proof of address dated within 90 days", "Source-of-funds declaration on file", "Sanctions / PEP screening passed"].map((c) => (
          <div key={c} className="adm-doc-row">
            <span style={{ color: "#15803d" }}><IconCheck size={16} /></span>
            <span style={{ fontSize: 14 }}>{c}</span>
          </div>
        ))}
      </Panel>
    </div>
  );
}

/* ================= Document library ================= */
function LibraryTab({ docs, setData }) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);

  const add = async () => {
    if (!name.trim() || !url.trim()) return;
    setBusy(true);
    try {
      const { data } = await client.post("/admin/documents", { name: name.trim(), url: url.trim() });
      setData((d) => ({ ...d, documents: [...(d.documents || []), data.data || data] }));
    } catch (err) {
      if (!err.response) {
        setData((d) => ({ ...d, documents: [...(d.documents || []), { id: "d" + Date.now(), name: name.trim(), url: url.trim(), type: "PDF", size: "—", updated: "just now" }] }));
      }
    } finally {
      setBusy(false); setName(""); setUrl("");
    }
  };

  const remove = async (id) => {
    setData((d) => ({ ...d, documents: (d.documents || []).filter((x) => x.id !== id) }));
    try { await client.delete(`/admin/documents/${id}`); } catch { /* demo */ }
  };

  return (
    <div>
      <div style={{ margin: "16px 0" }} />
      <Panel title="Add document" sub="Link a hosted file — it becomes downloadable in the investor portal">
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input className="adm-input" placeholder="Document name" value={name} onChange={(e) => setName(e.target.value)} style={{ flex: 1, minWidth: 160 }} />
          <input className="adm-input" placeholder="File URL (https://…)" value={url} onChange={(e) => setUrl(e.target.value)} style={{ flex: 2, minWidth: 200 }} />
          <Btn variant="primary" onClick={add} disabled={busy}>
            {busy ? <span className="adm-spinner" /> : <><IconUpload size={15} /> Add</>}
          </Btn>
        </div>
      </Panel>
      <Panel style={{ marginTop: 16, padding: 0, overflow: "hidden" }}>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead><tr><th>Name</th><th>Type</th><th>Size</th><th>Updated</th><th></th></tr></thead>
            <tbody>
              {(docs || []).map((d) => (
                <tr key={d.id}>
                  <td><b>{d.name}</b></td><td>{d.type}</td><td>{d.size}</td><td>{d.updated}</td>
                  <td style={{ textAlign: "right" }}>
                    <Btn variant="danger-ghost" onClick={() => remove(d.id)}>Remove</Btn>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

/* ================= Announcements ================= */
function AnnouncementsTab({ rows, setData }) {
  const [title, setTitle] = useState("");
  const [audience, setAudience] = useState("All investors");

  const publish = async () => {
    if (!title.trim()) return;
    const item = { id: "a" + Date.now(), title: title.trim(), audience, date: new Date().toISOString().slice(0, 10) };
    try {
      const { data } = await client.post("/admin/announcements", item);
      setData((d) => ({ ...d, announcements: [data.data || data, ...d.announcements] }));
    } catch (err) {
      if (!err.response) setData((d) => ({ ...d, announcements: [item, ...d.announcements] }));
    }
    setTitle("");
  };

  return (
    <div>
      <div style={{ margin: "16px 0" }} />
      <Panel title="New announcement">
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input className="adm-input" placeholder="Announcement title" value={title} onChange={(e) => setTitle(e.target.value)} style={{ flex: 2, minWidth: 200 }} />
          <select className="adm-select" value={audience} onChange={(e) => setAudience(e.target.value)} style={{ flex: 1, minWidth: 150 }}>
            <option>All investors</option><option>Verified only</option><option>Internal</option>
          </select>
          <Btn variant="primary" onClick={publish}>Publish</Btn>
        </div>
      </Panel>
      <Panel style={{ marginTop: 16 }}>
        {(rows || []).map((a) => (
          <div key={a.id} className="adm-doc-row">
            <div style={{ flex: 1 }}><b style={{ fontSize: 14 }}>{a.title}</b><div style={{ fontSize: 12.5, color: "#6b7280" }}>{a.audience} · {a.date}</div></div>
            <Badge variant="green">Published</Badge>
          </div>
        ))}
      </Panel>
    </div>
  );
}

/* ================= Audit log ================= */
function AuditTab({ rows }) {
  return (
    <div>
      <div style={{ margin: "16px 0" }} />
      <Panel>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead><tr><th>Time</th><th>Actor</th><th>Action</th><th>Details</th></tr></thead>
            <tbody>
              {(rows || []).map((a) => (
                <tr key={a.id}>
                  <td style={{ whiteSpace: "nowrap", color: "#6b7280" }}>{a.time}</td>
                  <td><b>{a.actor}</b></td>
                  <td><Badge variant="blue">{a.action}</Badge></td>
                  <td style={{ color: "#4b5563" }}>{a.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
