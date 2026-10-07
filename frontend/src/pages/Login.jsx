import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { IconAlert, IconCheck } from "../components/icons";

export default function Login() {
  const { login, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [demoNote, setDemoNote] = useState(false);
  const [busy, setBusy] = useState(false);

  if (isAuthenticated) {
    navigate(isAdmin ? "/admin" : "/investor", { replace: true });
    return null;
  }

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    setDemoNote(false);
    try {
      const { user, demo } = await login(form.email, form.password);
      if (demo) setDemoNote(true);
      const dest = location.state?.from || (user.role === "admin" ? "/admin" : "/investor");
      navigate(dest, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const fillDemo = (email) => setForm({ email, password: "password" });

  return (
    <div className="page">
      <div className="container">
        <div className="form-card">
          <img src="/logo.png" alt="OwnStakeX" className="logo-img" style={{ marginBottom: 22 }} />
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-.02em", marginBottom: 8 }}>Welcome back</h1>
          <p style={{ color: "var(--muted)", fontSize: 14.5, marginBottom: 24 }}>Log in to manage your stakes and reservations.</p>
          {error && <div className="alert error"><IconAlert size={18} /> {error}</div>}
          {demoNote && <div className="alert ok"><IconCheck size={18} /> Signed in with a demo account (API offline).</div>}
          <form onSubmit={submit}>
            <div className="field">
              <label>Email</label>
              <input type="email" value={form.email} onChange={set("email")} required placeholder="you@example.com" autoComplete="email" />
            </div>
            <div className="field">
              <label>Password</label>
              <input type="password" value={form.password} onChange={set("password")} required placeholder="••••••••" autoComplete="current-password" />
            </div>
            <button className="btn btn-primary" style={{ width: "100%" }} disabled={busy}>
              {busy ? <><span className="spinner" /> Signing in…</> : "Log in"}
            </button>
          </form>
          <div className="alert info" style={{ marginTop: 22, marginBottom: 0 }}>
            <IconAlert size={18} />
            <span>
              <b>Demo accounts</b> (password: <code>password</code>)<br />
              <button onClick={() => fillDemo("investor@ownstakex.com")} style={linkBtn}>investor@ownstakex.com</button><br />
              <button onClick={() => fillDemo("admin@ownstakex.com")} style={linkBtn}>admin@ownstakex.com</button>
            </span>
          </div>
          <p style={{ textAlign: "center", marginTop: 20, fontSize: 14.5, color: "var(--muted)" }}>
            New here? <Link to="/register" style={{ color: "var(--orange-deep)", fontWeight: 700 }}>Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const linkBtn = {
  background: "none", border: 0, padding: 0, cursor: "pointer",
  color: "var(--orange-deep)", fontWeight: 700, fontSize: 14, fontFamily: "inherit",
};
