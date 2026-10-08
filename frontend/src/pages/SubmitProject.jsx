import { useState } from "react";
import client from "../api/client";
import { IconAlert, IconCheck } from "../components/icons";
import Reveal from "../components/Reveal";

const ASSET_TYPES = ["Commercial property", "Hospitality", "Maritime / charter", "Logistics", "Other income asset"];
const EMPTY = { name: "", email: "", company: "", role: "", asset_type: "", funding_aed: "", location: "", description: "", files: "", consent: false };

/** For operators & sponsors: submit a commercial project for independent evaluation (spec v1.1). */
export default function SubmitProject() {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [sentName, setSentName] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    const required = ["name", "email", "company", "asset_type", "funding_aed", "location", "description"];
    if (required.some((k) => !String(form[k]).trim())) { setError("Please complete all required fields marked *."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) { setError("Please enter a valid work email."); return; }
    const funding = Number(String(form.funding_aed).replace(/[^\d.]/g, ""));
    if (!funding) { setError("Enter the funding request in AED, e.g. 2,000,000."); return; }
    if (!form.consent) { setError("Please tick the consent checkbox to submit."); return; }

    setSending(true);
    try {
      await client.post("/project-submissions", { ...form, funding_aed: funding });
      setSentName(form.name.trim().split(" ")[0]);
      setForm(EMPTY);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      const data = err.response?.data;
      setError(data?.errors ? Object.values(data.errors).flat()[0] : data?.message || "Could not send your submission. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-head">
          <div className="kicker">For operators &amp; sponsors</div>
          <h1>Bring us a project worth funding.</h1>
          <p>We evaluate commercial assets independently — economics first, story second. If it passes, we structure it, document it and offer it.</p>
        </div>

        <div className="two-col" style={{ alignItems: "start" }}>
          <Reveal>
            <div className="panel">
              {sentName ? (
                <div className="sp-done">
                  <div className="sp-done-ico"><IconCheck size={28} /></div>
                  <h3>Submission received</h3>
                  <p>Thank you, {sentName}. Our project team will review your submission within 10 business days.</p>
                  <p>Submitting does <b>not</b> create a listing — every project passes independent evaluation before any offer is structured.</p>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => setSentName("")}>Submit another project</button>
                </div>
              ) : (
                <>
                  <h3>Submit for evaluation</h3>
                  <p className="ph-sub">Reviewed by our project team · 10 business days</p>
                  <form onSubmit={submit} noValidate>
                    <div className="sp-grid">
                      <div className="field"><label htmlFor="sName">Your name *</label><input id="sName" value={form.name} onChange={set("name")} placeholder="Full name" autoComplete="name" /></div>
                      <div className="field"><label htmlFor="sEmail">Work email *</label><input id="sEmail" type="email" value={form.email} onChange={set("email")} placeholder="you@company.com" autoComplete="email" /></div>
                      <div className="field"><label htmlFor="sCo">Company *</label><input id="sCo" value={form.company} onChange={set("company")} placeholder="Operating company" autoComplete="organization" /></div>
                      <div className="field"><label htmlFor="sRole">Your role</label><input id="sRole" value={form.role} onChange={set("role")} placeholder="Owner / operator / broker" /></div>
                    </div>
                    <div className="field">
                      <label htmlFor="sType">Asset type *</label>
                      <select id="sType" value={form.asset_type} onChange={set("asset_type")}>
                        <option value="">Select asset type…</option>
                        {ASSET_TYPES.map((t) => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="sp-grid">
                      <div className="field"><label htmlFor="sCap">Funding request (AED) *</label><input id="sCap" inputMode="numeric" value={form.funding_aed} onChange={set("funding_aed")} placeholder="e.g. 2,000,000" /></div>
                      <div className="field"><label htmlFor="sLoc">Location / country *</label><input id="sLoc" value={form.location} onChange={set("location")} placeholder="City, country" /></div>
                    </div>
                    <div className="field"><label htmlFor="sSum">Project description *</label><textarea id="sSum" value={form.description} onChange={set("description")} placeholder="Asset, revenue model, why it suits shared ownership…" /></div>
                    <div className="field">
                      <label htmlFor="sFiles">Supporting files</label>
                      <p className="sp-note">List the documents you can provide (financials, title documents, licences). We will reply with a secure upload link.</p>
                      <input id="sFiles" value={form.files} onChange={set("files")} placeholder="e.g. audited-accounts-2025.pdf, title-deed.pdf" />
                    </div>
                    <div className="field">
                      <label className="sp-consent">
                        <input type="checkbox" checked={form.consent} onChange={set("consent")} />
                        <span>I consent to Bridging Investment LLC reviewing this submission and contacting me about it. I understand that submitting a project does <b>not</b> create a listing — every project goes through independent evaluation before any offer is structured. *</span>
                      </label>
                    </div>
                    {error && <div className="alert error"><IconAlert size={18} /> {error}</div>}
                    <button className="btn btn-primary btn-lg" style={{ width: "100%" }} type="submit" disabled={sending}>
                      {sending ? "Sending…" : "Submit for evaluation →"}
                    </button>
                  </form>
                </>
              )}
            </div>
          </Reveal>

          <div>
            <Reveal delay="d1">
              <div className="panel">
                <h3>What we look for</h3>
                <p className="ph-sub">Evaluation criteria</p>
                <ul className="sp-criteria">
                  <li><b>Real cash flow.</b> Contracted or evidenced revenue — not projections alone.</li>
                  <li><b>Clean title.</b> Verifiable ownership, no undisclosed encumbrances.</li>
                  <li><b>Skin in the game.</b> Sponsor co-investment or meaningful retained risk.</li>
                  <li><b>Operable.</b> A credible operator with a track record we can check.</li>
                  <li><b>Reportable.</b> Books we can reconcile monthly and publish.</li>
                </ul>
              </div>
            </Reveal>
            <Reveal delay="d2">
              <div className="panel">
                <h3>What happens next</h3>
                <p className="ph-sub">The evaluation path</p>
                <div className="timeline">
                  <div className="tl-item o"><b>Initial screen</b><span>10 business days</span></div>
                  <div className="tl-item o"><b>Commercial &amp; legal review</b><span>3–6 weeks</span></div>
                  <div className="tl-item o"><b>Investment committee</b><span>Decision to structure</span></div>
                  <div className="tl-item g"><b>Structuring &amp; offer</b><span>Documents, campaign, launch</span></div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
