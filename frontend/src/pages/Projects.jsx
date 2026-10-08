import { useEffect, useMemo, useRef, useState } from "react";
import client from "../api/client";
import { DEMO_PROJECTS } from "../data/demo";
import { COUNTRIES } from "../data/countries";
import ProjectCard from "../components/ProjectCard";
import { IconAlert } from "../components/icons";

const STATUS_LABELS = { funding: "Funding", evaluation: "Evaluation", closing: "Closing", operating: "Operating", coming_soon: "Coming soon" };

/** Words in a project's location that mean the United Arab Emirates. */
const UAE_WORDS = ["uae", "united arab emirates", "dubai", "abu dhabi", "sharjah", "ajman", "ras al khaimah", "fujairah", "umm al quwain"];
const NAME_TO_CODE = Object.fromEntries(COUNTRIES.map(([code, name]) => [name.toLowerCase(), code]));

/** ISO alpha-2 country of a project: its `country` field, else read from the location. */
function projectCountry(p) {
  const raw = String(p.country || "").trim().toLowerCase();
  if (raw.length === 2) return raw;
  if (raw) return NAME_TO_CODE[raw] || (raw === "uae" ? "ae" : null);
  const parts = String(p.location || "").toLowerCase().split(",").map((s) => s.trim()).filter(Boolean);
  for (const part of parts.reverse()) {
    if (UAE_WORDS.includes(part)) return "ae";
    if (NAME_TO_CODE[part]) return NAME_TO_CODE[part];
  }
  return null;
}

const flagUrl = (code) => `https://flagcdn.com/w40/${code}.png`;
const available = (p) => (p.available_units != null ? Number(p.available_units) : Number(p.units || 0) - Number(p.reserved || 0) - Number(p.funded || 0));
const capitalOf = (p) => Number(p.capital ?? p.target_amount ?? 0);
const ALL = { mode: "all", code: null, name: "" };

export default function Projects() {
  const [projects, setProjects] = useState(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("");
  // Country filter: all | a country with projects | a country we are not in yet (waitlist)
  const [country, setCountry] = useState(ALL);

  useEffect(() => {
    let alive = true;
    client.get("/projects", { params: { per_page: 100 } })
      .then(({ data }) => { if (alive) setProjects(Array.isArray(data.data) ? data.data : []); })
      .catch((err) => {
        if (alive) {
          if (!err.response) setProjects(DEMO_PROJECTS); // offline demo fallback
          else { setError("Could not load projects. Please try again."); setProjects([]); }
        }
      });
    return () => { alive = false; };
  }, []);

  const list = useMemo(() => projects || [], [projects]);
  const categories = [...new Set(list.map((p) => p.category).filter(Boolean))];
  const statuses = [...new Set(list.map((p) => p.status).filter(Boolean))];
  const countryCounts = useMemo(() => {
    const counts = {};
    list.forEach((p) => { const c = projectCountry(p); if (c) counts[c] = (counts[c] || 0) + 1; });
    return counts;
  }, [list]);

  const shown = useMemo(() => {
    const q = search.trim().toLowerCase();
    let L = list.filter((p) =>
      (!category || p.category === category) &&
      (!status || p.status === status) &&
      (!q || `${p.name} ${p.location} ${p.category}`.toLowerCase().includes(q)) &&
      (country.mode !== "country" || projectCountry(p) === country.code));
    if (sort === "avail") L = [...L].sort((a, b) => available(b) - available(a));
    if (sort === "capital") L = [...L].sort((a, b) => capitalOf(b) - capitalOf(a));
    return L;
  }, [list, search, category, status, sort, country]);

  const pickCountry = (code, name) => setCountry(countryCounts[code] ? { mode: "country", code, name } : { mode: "wait", code, name });

  return (
    <div className="page">
      <div className="container">
        <div className="page-head">
          <h1>Investment projects</h1>
          <p>Curated fractional opportunities. Every listing shows its structure, documents and risks before you commit a dirham. Capital at risk.</p>
        </div>
        {error && <div className="alert error"><IconAlert size={18} /> {error}</div>}
        {projects === null ? (
          <div className="empty"><span className="spinner" /> Loading projects…</div>
        ) : (
          <>
            <div className="panel cx-panel">
              <div className="cx-filters">
                <div className="field">
                  <label htmlFor="fSearch">Search</label>
                  <input id="fSearch" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name, location, category…" />
                </div>
                <div className="field">
                  <label htmlFor="fCat">Category</label>
                  <select id="fCat" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">All categories</option>
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="fStatus">Status</label>
                  <select id="fStatus" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="">All statuses</option>
                    {statuses.map((s) => <option key={s} value={s}>{STATUS_LABELS[s] || s}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="fSort">Sort by</label>
                  <select id="fSort" value={sort} onChange={(e) => setSort(e.target.value)}>
                    <option value="">Featured</option>
                    <option value="avail">Most available</option>
                    <option value="capital">Largest capital</option>
                  </select>
                </div>
                {/* key: a new selection (or Back) resets the box to the chosen name */}
                <CountryPicker key={country.name || "all"} counts={countryCounts} value={country} onPick={pickCountry} onClear={() => setCountry(ALL)} />
              </div>
            </div>

            {country.mode === "wait" ? (
              <Waitlist key={country.name} country={country} onBack={() => setCountry(ALL)} />
            ) : (
              <>
                <p className="cx-rescount">{shown.length} {shown.length === 1 ? "project" : "projects"}</p>
                {shown.length === 0 ? (
                  <div className="card cx-empty">
                    <h3>No projects match</h3>
                    <p>Try clearing a filter — or pick your country to be notified when a project launches there.</p>
                  </div>
                ) : (
                  <div className="grid-3">
                    {shown.map((p) => <ProjectCard key={p.id || p.slug} project={p} />)}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/** Type-ahead country search with flags; countries with projects first. */
function CountryPicker({ counts, value, onPick, onClear }) {
  const [text, setText] = useState(value.name || "");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const wrap = useRef(null);

  useEffect(() => {
    const onDoc = (e) => { if (wrap.current && !wrap.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const matches = useMemo(() => {
    const n = text.trim().toLowerCase();
    return COUNTRIES
      .filter(([code, name]) => !n || name.toLowerCase().includes(n) || code === n)
      .sort((a, b) => (counts[a[0]] ? 0 : 1) - (counts[b[0]] ? 0 : 1) || a[1].localeCompare(b[1]))
      .slice(0, 60);
  }, [text, counts]);

  const choose = ([code, name]) => { setOpen(false); setText(name); onPick(code, name); };
  const commit = () => {
    const v = text.trim();
    setOpen(false);
    if (!v) { onClear(); return; }
    const exact = COUNTRIES.find(([code, name]) => name.toLowerCase() === v.toLowerCase() || code === v.toLowerCase());
    if (exact) choose(exact);
    else if (matches[0]) choose(matches[0]);
  };

  return (
    <div className="field">
      <label htmlFor="cxQuery">Country</label>
      <div className="cx-wrap" ref={wrap}>
        <input
          id="cxQuery"
          value={text}
          placeholder="Type a country…"
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
          aria-controls="cxSugg"
          aria-autocomplete="list"
          onFocus={() => setOpen(true)}
          onChange={(e) => { setText(e.target.value); setOpen(true); setActive(-1); if (!e.target.value.trim()) onClear(); }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); setActive((i) => Math.min(i + 1, matches.length - 1)); }
            else if (e.key === "ArrowUp") { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)); }
            else if (e.key === "Enter") { e.preventDefault(); if (open && active >= 0 && matches[active]) choose(matches[active]); else commit(); }
            else if (e.key === "Escape") setOpen(false);
          }}
        />
        {text && (
          <button type="button" className="cx-clear" aria-label="Clear country filter" onClick={() => { setText(""); onClear(); }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        )}
        {open && matches.length > 0 && (
          <div className="cx-sugg" id="cxSugg" role="listbox" aria-label="Country suggestions">
            {matches.map((m, i) => (
              <button
                key={m[0]}
                type="button"
                role="option"
                aria-selected={i === active}
                className={`cx-srow${i === active ? " act" : ""}`}
                onMouseDown={(e) => { e.preventDefault(); choose(m); }}
              >
                <img src={flagUrl(m[0])} alt="" width="22" loading="lazy" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                <span className="nm">{m[1]}</span>
                {counts[m[0]] ? <span className="cx-count">{counts[m[0]]} {counts[m[0]] === 1 ? "project" : "projects"}</span> : null}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/** "We're not in X yet" — leave name + email to be notified (stored by the API). */
function Waitlist({ country, onBack }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const ref = useRef(null);

  // Remounted per country (key), so the form starts empty each time.
  useEffect(() => {
    ref.current?.scrollIntoView?.({ behavior: "smooth", block: "start" });
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    if (name.trim().length < 2) { setErr("Please enter your name."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) { setErr("Please enter a valid email address."); return; }
    setBusy(true);
    try {
      await client.post("/waitlist", { name: name.trim(), email: email.trim(), country: country.name, country_code: country.code || undefined });
      setDone(true);
    } catch (ex) {
      setErr(ex.response?.data?.message || "Could not save — please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card cx-waitlist" ref={ref}>
      {!done ? (
        <>
          <div className="cx-globe">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
          </div>
          <h3>We&rsquo;re not in {country.name} yet.</h3>
          <p className="cx-wtext">We&rsquo;re planning to start business setup in {country.name} soon. Leave your email and we&rsquo;ll notify you the moment a project launches there.</p>
          <form onSubmit={submit} noValidate>
            <div className="field"><label htmlFor="cxWName">Name</label><input id="cxWName" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoComplete="name" /></div>
            <div className="field"><label htmlFor="cxWEmail">Email</label><input id="cxWEmail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" autoComplete="email" /></div>
            {err && <p className="cx-err" role="alert">{err}</p>}
            <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={busy}>{busy ? "Saving…" : "Notify me"}</button>
            <p className="cx-fine">One email per country. We&rsquo;ll only write when a project launches there.</p>
          </form>
        </>
      ) : (
        <>
          <div className="cx-okbadge"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg></div>
          <h3>You&rsquo;re on the list</h3>
          <p className="cx-wtext">We&rsquo;ll email you the moment we launch in <b>{country.name}</b>.</p>
        </>
      )}
      <div style={{ marginTop: 22 }}><button type="button" className="btn btn-ghost btn-sm" onClick={onBack}>&larr; Back to all projects</button></div>
    </div>
  );
}
