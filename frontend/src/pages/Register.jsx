import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { IconAlert } from "../components/icons";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    if (form.password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setBusy(true);
    setError("");
    try {
      await register(form.name, form.email, form.password);
      navigate("/investor", { replace: true });
    } catch (err) {
      setError(err.message || "We could not create your account. Please check the form and try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="form-card">
          <img src="/logo.png" alt="OwnStakeX" className="logo-img" style={{ marginBottom: 22 }} />
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-.02em", marginBottom: 8 }}>Create your account</h1>
          <p style={{ color: "var(--muted)", fontSize: 14.5, marginBottom: 24 }}>Start exploring fractional ownership in minutes.</p>
          {error && <div className="alert error"><IconAlert size={18} /> {error}</div>}
          <form onSubmit={submit}>
            <div className="field"><label>Full name</label><input value={form.name} onChange={set("name")} required placeholder="Your name" autoComplete="name" /></div>
            <div className="field"><label>Email</label><input type="email" value={form.email} onChange={set("email")} required placeholder="you@example.com" autoComplete="email" /></div>
            <div className="field"><label>Password</label><input type="password" value={form.password} onChange={set("password")} required placeholder="Min. 8 characters" autoComplete="new-password" /></div>
            <div className="field"><label>Confirm password</label><input type="password" value={form.confirm} onChange={set("confirm")} required placeholder="Repeat password" autoComplete="new-password" /></div>
            <button className="btn btn-primary" style={{ width: "100%" }} disabled={busy}>
              {busy ? <><span className="spinner" /> Creating…</> : "Create account"}
            </button>
          </form>
          <p style={{ fontSize: 12.5, color: "var(--dim)", marginTop: 18, textAlign: "center" }}>
            Capital at risk. By registering you agree to the Terms of Use.
          </p>
          <p style={{ textAlign: "center", marginTop: 14, fontSize: 14.5, color: "var(--muted)" }}>
            Already have an account? <Link to="/login" style={{ color: "var(--orange-deep)", fontWeight: 700 }}>Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
