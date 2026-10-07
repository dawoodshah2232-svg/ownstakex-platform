import { Link } from "react-router-dom";
import { STEPS } from "../data/demo";
import { IconArrow, IconChart, IconShield } from "../components/icons";
import Reveal from "../components/Reveal";

export default function HowItWorks() {
  return (
    <div className="page">
      <div className="container">
        <div className="page-head">
          <h1>How it works</h1>
          <p>OwnStakeX turns high-value assets into accessible investments — with institutional-grade structure and plain-language transparency.</p>
        </div>

        <Reveal>
          <div className="steps-row" style={{ marginBottom: 70 }}>
            {STEPS.map((s, i) => (
              <span key={s.n} style={{ display: "contents" }}>
                <div className="step-h">
                  <span className="s-ico" style={{ color: "var(--orange)" }}><IconChart size={22} /></span>
                  <div>
                    <div className="s-top"><span className="s-num">{s.n}</span><b>{s.title}</b></div>
                    <p>{s.text}</p>
                  </div>
                </div>
                {i < STEPS.length - 1 && <span className="s-arr"><IconArrow size={20} /></span>}
              </span>
            ))}
          </div>
        </Reveal>

        <div className="grid-3">
          <Reveal>
            <div className="panel">
              <h3>Structured ownership</h3>
              <p className="ph-sub">Every asset sits in a dedicated SPV. Your stake is a real, documented share — not a promise.</p>
            </div>
          </Reveal>
          <Reveal delay="d1">
            <div className="panel">
              <h3>Full document room</h3>
              <p className="ph-sub">Valuations, legal structure, fee schedules and risk disclosures are published before funding opens.</p>
            </div>
          </Reveal>
          <Reveal delay="d2">
            <div className="panel">
              <h3>Aligned economics</h3>
              <p className="ph-sub">We earn when the structure performs as described. Fees are published per project — no hidden carry.</p>
            </div>
          </Reveal>
        </div>

        <div className="alert info" style={{ marginTop: 40 }}>
          <IconShield size={18} />
          <span>Capital at risk. Fractional ownership does not guarantee returns or liquidity. Read each project's documents carefully.</span>
        </div>

        <div style={{ textAlign: "center", marginTop: 40 }}>
          <Link to="/projects" className="btn btn-primary btn-lg">Browse projects <IconArrow size={17} /></Link>
        </div>
      </div>
    </div>
  );
}
