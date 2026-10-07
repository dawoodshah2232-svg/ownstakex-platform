import { useState } from "react";
import client from "../api/client";
import { IconAlert, IconCheck, IconMail, IconPin } from "../components/icons";
import Reveal from "../components/Reveal";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "General enquiry", message: "" });
  const [status, setStatus] = useState({ type: "", text: "" });
  const [sending, setSending] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    setStatus({ type: "", text: "" });
    try {
      await client.post("/contact", form);
      setStatus({ type: "ok", text: "Message sent. We reply within 2 business days." });
      setForm({ name: "", email: "", subject: "General enquiry", message: "" });
    } catch (err) {
      if (!err.response) {
        setStatus({ type: "ok", text: "Message noted (demo mode — the API is offline, so it wasn't actually sent)." });
        setForm({ name: "", email: "", subject: "General enquiry", message: "" });
      } else {
        setStatus({ type: "error", text: err.response?.data?.message || "Something went wrong. Please try again." });
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-head">
          <h1>Contact us</h1>
          <p>Questions about a project, your account, or how OwnStakeX works — we're here.</p>
        </div>
        <div className="detail-grid">
          <Reveal>
            <div className="panel">
              <h3>Send a message</h3>
              <p className="ph-sub">We reply within 2 business days.</p>
              {status.text && (
                <div className={`alert ${status.type}`}>
                  {status.type === "ok" ? <IconCheck size={18} /> : <IconAlert size={18} />} {status.text}
                </div>
              )}
              <form onSubmit={submit}>
                <div className="field"><label>Full name</label><input value={form.name} onChange={set("name")} required placeholder="Your name" /></div>
                <div className="field"><label>Email</label><input type="email" value={form.email} onChange={set("email")} required placeholder="you@example.com" /></div>
                <div className="field">
                  <label>Subject</label>
                  <select value={form.subject} onChange={set("subject")}>
                    <option>General enquiry</option>
                    <option>A project question</option>
                    <option>Account & verification</option>
                    <option>Distributions & payments</option>
                    <option>Partnerships</option>
                  </select>
                </div>
                <div className="field"><label>Message</label><textarea rows={5} value={form.message} onChange={set("message")} required placeholder="How can we help?" /></div>
                <button className="btn btn-primary" style={{ width: "100%" }} disabled={sending}>
                  {sending ? <><span className="spinner" /> Sending…</> : "Send message"}
                </button>
              </form>
            </div>
          </Reveal>
          <Reveal delay="d1">
            <div>
              <div className="panel">
                <h3><IconMail size={18} /> Email</h3>
                <p className="ph-sub">support@ownstakex.com</p>
              </div>
              <div className="panel">
                <h3><IconPin size={18} /> Office</h3>
                <p className="ph-sub">Bridging Investment LLC, Dubai, UAE</p>
              </div>
              <div className="panel">
                <h3>Response times</h3>
                <p className="ph-sub">General enquiries: 2 business days.<br />Distribution queries: 1 business day.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
