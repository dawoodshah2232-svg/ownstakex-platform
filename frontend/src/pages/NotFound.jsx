import { Link } from "react-router-dom";
import PageHead from "../components/PageHead";

export default function NotFound() {
  return (
    <div className="page">
      <PageHead title="Page not found" noindex />
      <div className="container" style={{ textAlign: "center", padding: "60px 0" }}>
        <div style={{ fontSize: 72, fontWeight: 800, color: "var(--orange)", letterSpacing: "-.04em" }}>404</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: "10px 0" }}>Page not found</h1>
        <p style={{ color: "var(--muted)", marginBottom: 30 }}>The page you're looking for doesn't exist or has moved.</p>
        <Link to="/" className="btn btn-primary">Back to home</Link>
      </div>
    </div>
  );
}
