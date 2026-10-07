import { useEffect, useState } from "react";
import client from "../api/client";
import { DEMO_ADMIN, DEMO_PROJECTS } from "../data/demo";
import { useAuth } from "../context/AuthContext";
import { formatAED } from "../components/ProjectCard";
import {
  IconChart, IconUsers, IconDoc, IconAlert, IconCheck, IconClose, IconUpload, IconShield,
} from "../components/icons";

const TABS = [
  { id: "overview", label: "Overview", icon: IconChart },
  { id: "projects", label: "Projects", icon: IconChart },
  { id: "documents", label: "Document library", icon: IconDoc },
  { id: "investors", label: "Investors", icon: IconUsers },
  { id: "announcements", label: "Announcements", icon: IconDoc },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState("overview");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [ov, pj, dc, iv, an] = await Promise.all([
          client.get("/admin/overview"),
          client.get("/admin/projects"),
          client.get("/admin/documents"),
          client.get("/admin/investors"),
          client.get("/admin/announcements"),
        ]);
        if (alive) setData({
          overview: ov.data.data || ov.data,
          projects: pj.data.data || pj.data,
          documents: dc.data.data || dc.data,
          investors: iv.data.data || iv.data,
          announcements: an.data.data || an.data,
        });
      } catch (err) {
        if (alive) {
          if (!err.response) {
            setData({ ...DEMO_ADMIN, projects: DEMO_PROJECTS.map((p) => ({ ...p, media: [], documents: [] })) });
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

  return (
    <div className="page">
      <div className="container">
        <div className="page-head" style={{ marginBottom: 30 }}>
          <h1>Admin console</h1>
          <p>Signed in as {user?.name} — manage projects, media, documents and investors.</p>
        </div>
        {error && <div className="alert error"><IconAlert size={18} /> {error}</div>}
        {!data ? (
          <div className="empty"><span className="spinner" /> Loading admin console…</div>
        ) : (
          <div className="dash">
            <aside className="dash-side" aria-label="Admin sections">
              {TABS.map((t) => (
                <button key={t.id} className={tab === t.id ? "on" : ""} onClick={() => setTab(t.id)}>
                  <t.icon size={17} /> {t.label}
                </button>
              ))}
            </aside>
            <div className="dash-main">
              {tab === "overview" && <Overview data={data.overview} />}
              {tab === "projects" && <ProjectsTab projects={data.projects} setData={setData} refresh={refreshProjects} />}
              {tab === "documents" && <LibraryTab docs={data.documents} setData={setData} />}
              {tab === "investors" && <InvestorsTab rows={data.investors} />}
              {tab === "announcements" && <AnnouncementsTab rows={data.announcements} setData={setData} />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Overview({ data }) {
  const cards = [
    { k: "Registered users", v: data.users?.toLocaleString?.() || data.users },
    { k: "Projects", v: data.projects },
    { k: "Total raised", v: formatAED(data.total_raised) },
    { k: "Pending KYC", v: data.pending_kyc },
  ];
  return (
    <div className="stat-grid">
      {cards.map((c) => (
        <div className="stat-card" key={c.k}><div className="k">{c.k}</div><div className="v">{c.v}</div></div>
      ))}
    </div>
  );
}

/* ---------------- Projects: media + document management ---------------- */
function ProjectsTab({ projects, setData, refresh }) {
  const [editing, setEditing] = useState(null); // project being edited
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
        // demo fallback: update local state
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
        // offline demo: persist locally
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800 }}>Projects</h2>
        <button className="btn btn-primary btn-sm" onClick={() => setEditing({ id: null })}>+ New project</button>
      </div>
      {notice && (
        <div className={`alert ${notice.startsWith("ok:") ? "ok" : "error"}`} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {notice.startsWith("ok:") ? <IconCheck size={18} /> : <IconAlert size={18} />} {notice.slice(3)}
          <button onClick={() => setNotice("")} style={{ marginLeft: "auto", background: "none", border: 0, cursor: "pointer" }} aria-label="Dismiss"><IconClose size={16} /></button>
        </div>
      )}
      <div className="panel" style={{ padding: 0, overflow: "hidden" }}>
        <table className="tbl">
          <thead><tr><th>Project</th><th>Category</th><th>Status</th><th>Raised</th><th>Media</th><th></th></tr></thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id}>
                <td><b>{p.name}</b><div style={{ fontSize: 12.5, color: "var(--dim)" }}>{p.location}</div></td>
                <td>{p.category}</td>
                <td><span className={`badge ${p.status === "funding" ? "ok" : "mut"}`}>{p.status}</span></td>
                <td>{formatAED(p.raised_amount)}</td>
                <td style={{ fontSize: 13, color: "var(--muted)" }}>{(p.media || []).length} photos · {(p.documents || []).length} docs</td>
                <td style={{ textAlign: "right" }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => setEditing(p)}>Manage</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editing !== null && (
        <ProjectEditor
          project={editing.id ? editing : null}
          saving={saving}
          onSave={saveProject}
          onClose={() => setEditing(null)}
        />
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
        // demo fallback: local object URL (lost on refresh — honest about it)
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
    <div className="panel" style={{ borderColor: "var(--orange)", marginTop: 20 }}>
      <div className="panel-head">
        <h3>{project ? "Manage project" : "New project"}</h3>
        <button className="btn btn-ghost btn-sm" onClick={onClose}><IconClose size={15} /> Close</button>
      </div>
      <form onSubmit={submit}>
        <div className="detail-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div className="field"><label>Project name</label><input value={form.name} onChange={set("name")} required /></div>
          <div className="field"><label>Tagline</label><input value={form.tagline} onChange={set("tagline")} /></div>
          <div className="field"><label>Category</label>
            <select value={form.category} onChange={set("category")}>
              <option>Real Estate</option><option>Yachts</option><option>Hospitality</option><option>Businesses</option>
            </select>
          </div>
          <div className="field"><label>Location</label><input value={form.location} onChange={set("location")} /></div>
          <div className="field"><label>Status</label>
            <select value={form.status} onChange={set("status")}>
              <option value="draft">Draft</option><option value="funding">Funding</option>
              <option value="funded">Funded</option><option value="coming_soon">Coming soon</option>
            </select>
          </div>
          <div className="field"><label>Target amount (AED)</label><input type="number" min="0" value={form.target_amount} onChange={set("target_amount")} /></div>
          <div className="field"><label>Min. investment (AED)</label><input type="number" min="0" value={form.min_investment} onChange={set("min_investment")} /></div>
          <div className="field"><label>Target yield (e.g. 7.2%)</label><input value={form.expected_yield} onChange={set("expected_yield")} placeholder="7.2%" /></div>
        </div>
        <div className="field"><label>Description</label><textarea rows={4} value={form.description} onChange={set("description")} /></div>

        <h4 style={{ margin: "22px 0 8px" }}>Media — photos & videos</h4>
        <div className="media-grid">
          {media.map((m) => (
            <div className="media-thumb" key={m.id}>
              {m.kind === "video"
                ? <video src={m.url} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <img src={m.url} alt={m.name || "Project media"} />}
              <button type="button" onClick={() => removeMedia(m.id)} aria-label="Remove media">×</button>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
          <input
            placeholder="Paste image/video URL then Add"
            value={newMediaUrl}
            onChange={(e) => setNewMediaUrl(e.target.value)}
            style={{ flex: 1, minWidth: 200, border: "1px solid var(--line2)", borderRadius: 12, padding: "10px 14px", fontSize: 14 }}
          />
          <button type="button" className="btn btn-ghost btn-sm" onClick={addMediaUrl}>Add URL</button>
          <label className="btn btn-ghost btn-sm" style={{ cursor: "pointer" }}>
            <IconUpload size={15} /> Upload
            <input type="file" accept="image/*,video/*" onChange={uploadMedia} style={{ display: "none" }} />
          </label>
        </div>
        <p className="hint" style={{ fontSize: 12.5, color: "var(--dim)", marginTop: 6 }}>Uploads go to the API when online; offline demo uploads are temporary.</p>

        <h4 style={{ margin: "22px 0 8px" }}>Documents</h4>
        {docs.map((d) => (
          <div className="doc-row" key={d.id}>
            <div className="grow"><b>{d.name}</b><div className="dm">{d.type || "PDF"}</div></div>
            <button type="button" className="btn btn-ghost btn-sm" style={{ color: "#b91c1c" }} onClick={() => removeDoc(d.id)}>Remove</button>
          </div>
        ))}
        <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
          <input placeholder="Document name" value={newDoc.name} onChange={(e) => setNewDoc((s) => ({ ...s, name: e.target.value }))}
            style={{ flex: 1, minWidth: 160, border: "1px solid var(--line2)", borderRadius: 12, padding: "10px 14px", fontSize: 14 }} />
          <input placeholder="File URL (https://…)" value={newDoc.url} onChange={(e) => setNewDoc((s) => ({ ...s, url: e.target.value }))}
            style={{ flex: 2, minWidth: 200, border: "1px solid var(--line2)", borderRadius: 12, padding: "10px 14px", fontSize: 14 }} />
          <button type="button" className="btn btn-ghost btn-sm" onClick={addDoc}>Add document</button>
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 26 }}>
          <button type="submit" className="btn btn-primary" disabled={saving} style={{ flex: 1 }}>
            {saving ? <><span className="spinner" /> Saving…</> : "Save project"}
          </button>
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

/* ---------------- Document library ---------------- */
function LibraryTab({ docs, setData }) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);

  const add = async () => {
    if (!name.trim() || !url.trim()) return;
    setBusy(true);
    try {
      const { data } = await client.post("/admin/documents", { name: name.trim(), url: url.trim() });
      setData((d) => ({ ...d, documents: [...d.documents, data.data || data] }));
    } catch (err) {
      if (!err.response) {
        setData((d) => ({ ...d, documents: [...d.documents, { id: "d" + Date.now(), name: name.trim(), url: url.trim(), type: "PDF", size: "—", updated: "just now" }] }));
      }
    } finally {
      setBusy(false); setName(""); setUrl("");
    }
  };

  const remove = async (id) => {
    setData((d) => ({ ...d, documents: d.documents.filter((x) => x.id !== id) }));
    try { await client.delete(`/admin/documents/${id}`); } catch { /* demo */ }
  };

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Document library</h2>
      <p style={{ color: "var(--muted)", fontSize: 14.5, marginBottom: 18 }}>Every brochure, term sheet and report investors can download.</p>
      <div className="panel">
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input placeholder="Document name" value={name} onChange={(e) => setName(e.target.value)}
            style={{ flex: 1, minWidth: 160, border: "1px solid var(--line2)", borderRadius: 12, padding: "10px 14px", fontSize: 14 }} />
          <input placeholder="File URL (https://…)" value={url} onChange={(e) => setUrl(e.target.value)}
            style={{ flex: 2, minWidth: 200, border: "1px solid var(--line2)", borderRadius: 12, padding: "10px 14px", fontSize: 14 }} />
          <button className="btn btn-primary btn-sm" onClick={add} disabled={busy}>
            {busy ? <span className="spinner" /> : <><IconUpload size={15} /> Add</>}
          </button>
        </div>
      </div>
      <div className="panel" style={{ padding: 0, overflow: "hidden" }}>
        <table className="tbl">
          <thead><tr><th>Name</th><th>Type</th><th>Size</th><th>Updated</th><th></th></tr></thead>
          <tbody>
            {docs.map((d) => (
              <tr key={d.id}>
                <td><b>{d.name}</b></td><td>{d.type}</td><td>{d.size}</td><td>{d.updated}</td>
                <td style={{ textAlign: "right" }}>
                  <button className="btn btn-ghost btn-sm" style={{ color: "#b91c1c" }} onClick={() => remove(d.id)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------------- Investors ---------------- */
function InvestorsTab({ rows }) {
  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 18 }}>Investors</h2>
      <div className="panel" style={{ padding: 0, overflow: "hidden" }}>
        <table className="tbl">
          <thead><tr><th>Name</th><th>Email</th><th>Invested</th><th>KYC</th><th>Joined</th></tr></thead>
          <tbody>
            {rows.map((u) => (
              <tr key={u.id}>
                <td><b>{u.name}</b></td><td>{u.email}</td><td>{formatAED(u.invested)}</td>
                <td><span className={`badge ${u.kyc === "verified" ? "ok" : "warn"}`}>{u.kyc}</span></td>
                <td>{u.joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ fontSize: 13, color: "var(--dim)", marginTop: 12, display: "flex", gap: 8, alignItems: "center" }}>
        <IconShield size={15} /> KYC reviews and payouts require maker–checker approval in production.
      </p>
    </div>
  );
}

/* ---------------- Announcements ---------------- */
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
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 18 }}>Announcements</h2>
      <div className="panel">
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input placeholder="Announcement title" value={title} onChange={(e) => setTitle(e.target.value)}
            style={{ flex: 2, minWidth: 200, border: "1px solid var(--line2)", borderRadius: 12, padding: "10px 14px", fontSize: 14 }} />
          <select value={audience} onChange={(e) => setAudience(e.target.value)}
            style={{ border: "1px solid var(--line2)", borderRadius: 12, padding: "10px 14px", fontSize: 14, background: "#fff" }}>
            <option>All investors</option><option>Verified only</option><option>Internal</option>
          </select>
          <button className="btn btn-primary btn-sm" onClick={publish}>Publish</button>
        </div>
      </div>
      {rows.map((a) => (
        <div className="doc-row" key={a.id}>
          <div className="grow"><b>{a.title}</b><div className="dm">{a.audience} · {a.date}</div></div>
          <span className="badge ok">Published</span>
        </div>
      ))}
    </div>
  );
}
