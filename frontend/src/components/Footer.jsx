import { Link } from "react-router-dom";
import { IconShield } from "./icons";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="f-grid">
          <div>
            <img src="/logo.png" alt="OwnStakeX" className="logo-img" style={{ marginBottom: 14 }} />
            <p style={{ color: "var(--muted)", fontSize: 14, maxWidth: 320 }}>
              Own a stake in real opportunities — curated real estate, yachts, hospitality and operating businesses.
            </p>
            <p style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, fontSize: 13.5, color: "var(--muted)" }}>
              <IconShield size={16} /> Capital at risk. Educational content, not financial advice.
            </p>
          </div>
          <div>
            <h5>Platform</h5>
            <Link to="/projects">Projects</Link>
            <Link to="/how-it-works">How it works</Link>
            <Link to="/reporting">Reporting</Link>
            <Link to="/blog">Blog</Link>
          </div>
          <div>
            <h5>Company</h5>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/submit-project">Submit a project</Link>
            <Link to="/faqs">FAQs</Link>
            <Link to="/legal">Legal</Link>
            <Link to="/legal#fees">Fee schedule</Link>
          </div>
          <div>
            <h5>Account</h5>
            <Link to="/login">Log in</Link>
            <Link to="/investor">Investor dashboard</Link>
            <Link to="/admin">Admin dashboard</Link>
          </div>
        </div>
        <div className="f-bottom">
          <span>OwnStakeX.com is owned by Bridging Investment LLC, Dubai, UAE.</span>
          <span>© 2026 OwnStakeX. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
