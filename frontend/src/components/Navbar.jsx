import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { IconLogout } from "./icons";

const LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/projects", label: "Projects" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/about", label: "About" },
  { to: "/blog", label: "Blog" },
  { to: "/faqs", label: "FAQs" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dashboardPath = isAdmin ? "/admin" : "/investor";

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    navigate("/");
  };

  return (
    <>
      <header className={`nav${scrolled ? " scrolled" : ""}`}>
        <div className="container nav-inner">
          <Link to="/" className="logo" aria-label="OwnStakeX home">
            <img src="/logo.png" alt="OwnStakeX" className="logo-img" />
          </Link>
          <nav className="nav-links" aria-label="Primary">
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => (isActive ? "active" : "")}>
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="nav-cta">
            {isAuthenticated ? (
              <>
                <Link to={dashboardPath} className="btn btn-primary btn-sm">Dashboard</Link>
                <button className="btn btn-ghost btn-sm" onClick={handleLogout} title="Log out">
                  <IconLogout size={16} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm">Log in</Link>
                <Link to="/projects" className="btn btn-primary btn-sm">Get started</Link>
              </>
            )}
          </div>
          <button
            className={`burger${open ? " open" : ""}`}
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <span /><span /><span />
          </button>
        </div>
      </header>
      <div className={`mobile-drawer${open ? " open" : ""}`}>
        {LINKS.map((l) => (
          <Link key={l.to} to={l.to} onClick={() => setOpen(false)}>{l.label}</Link>
        ))}
        {isAuthenticated ? (
          <>
            <Link to={dashboardPath} className="btn btn-primary" onClick={() => setOpen(false)}>Dashboard</Link>
            <button className="btn btn-ghost" onClick={handleLogout} style={{ width: "100%", marginTop: 10 }}>Log out</button>
          </>
        ) : (
          <Link to="/login" className="btn btn-primary" onClick={() => setOpen(false)}>Log in</Link>
        )}
      </div>
    </>
  );
}
