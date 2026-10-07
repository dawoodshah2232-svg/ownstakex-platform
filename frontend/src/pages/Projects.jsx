import { useEffect, useState } from "react";
import client from "../api/client";
import { DEMO_PROJECTS } from "../data/demo";
import ProjectCard from "../components/ProjectCard";
import { IconAlert } from "../components/icons";

export default function Projects() {
  const [projects, setProjects] = useState(null);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    let alive = true;
    client.get("/projects")
      .then(({ data }) => { if (alive) setProjects(Array.isArray(data.data) ? data.data : []); })
      .catch((err) => {
        if (alive) {
          if (!err.response) setProjects(DEMO_PROJECTS); // offline demo fallback
          else { setError("Could not load projects. Please try again."); setProjects([]); }
        }
      });
    return () => { alive = false; };
  }, []);

  const cats = ["All", ...new Set((projects || []).map((p) => p.category).filter(Boolean))];
  const shown = (projects || []).filter((p) => filter === "All" || p.category === filter);

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
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 30 }}>
              {cats.map((c) => (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className={`btn btn-sm ${filter === c ? "btn-primary" : "btn-ghost"}`}
                >
                  {c}
                </button>
              ))}
            </div>
            {shown.length === 0 ? (
              <div className="empty">No projects in this category yet.</div>
            ) : (
              <div className="grid-3">
                {shown.map((p) => <ProjectCard key={p.id || p.slug} project={p} />)}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
