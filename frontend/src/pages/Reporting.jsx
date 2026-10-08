import { Link } from "react-router-dom";
import { IconArrow, IconDoc, IconShield } from "../components/icons";
import Reveal from "../components/Reveal";

/** [line, AED, highlight] — illustrative monthly waterfall (100 equal units). */
const WATERFALL = [
  ["Revenue", "100,000"],
  ["Operating costs (including disclosed management fees)", "(55,000)"],
  ["Depreciation", "(10,000)"],
  ["Finance costs", "(3,000)"],
  ["Tax expense (illustrative)", "(2,000)"],
  ["Net accounting profit", "30,000", true],
  ["Add back: depreciation (non-cash)", "10,000"],
  ["Debt principal repaid", "(8,000)"],
  ["Capital expenditure", "(6,000)"],
  ["Increase in required cash reserve", "(6,000)"],
  ["Cash available for distribution", "20,000", true],
  ["Per unit — 100 equal units", "AED 200", true],
];

const REPORTS = [
  { name: "Q3 2026 Portfolio Performance Report", desc: "Occupancy, yields and distributions across live assets.", date: "Oct 2026" },
  { name: "Q2 2026 Portfolio Performance Report", desc: "Half-year review with audited income statements.", date: "Jul 2026" },
  { name: "Annual Transparency Statement 2025", desc: "Fees earned, conflicts managed, structure changes.", date: "Jan 2026" },
];

export default function Reporting() {
  return (
    <div className="page">
      <div className="container">
        <div className="page-head">
          <h1>Reporting & transparency</h1>
          <p>What we publish, when, and where to find it. If it's not documented here, ask us — that's the standard we hold ourselves to.</p>
        </div>
        <div style={{ maxWidth: 820 }}>
          {REPORTS.map((r, i) => (
            <Reveal key={i}>
              <div className="doc-row">
                <span style={{ color: "var(--orange)" }}><IconDoc size={22} /></span>
                <div className="grow">
                  <b>{r.name}</b>
                  <div className="dm">{r.desc}</div>
                </div>
                <span className="badge mut">{r.date}</span>
                <Link to="/login" className="btn btn-ghost btn-sm">Sign in to download</Link>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="grid-3" style={{ marginTop: 50 }}>
          <Reveal>
            <div className="panel">
              <h3>Quarterly performance</h3>
              <p className="ph-sub">Income, occupancy and expenses per asset, published within 30 days of quarter-end.</p>
            </div>
          </Reveal>
          <Reveal delay="d1">
            <div className="panel">
              <h3>Annual statements</h3>
              <p className="ph-sub">A full accounting of fees, distributions and any conflicts of interest, every January.</p>
            </div>
          </Reveal>
          <Reveal delay="d2">
            <div className="panel">
              <h3>Event-driven notices</h3>
              <p className="ph-sub">Material changes — sales, refinancing, major works — disclosed as they happen.</p>
            </div>
          </Reveal>
        </div>

        {/* Spec v1.1: worked monthly waterfall — a calculation example, not a forecast */}
        <Reveal>
          <div className="panel" style={{ marginTop: 40 }}>
            <div className="waterfall-head">
              <h3 style={{ margin: 0 }}>Illustrative monthly waterfall — worked table</h3>
              <span className="badge warn">Illustrative calculation example — not a return forecast</span>
            </div>
            <p className="ph-sub">Follow every dirham from revenue to your payout</p>
            <div className="table-wrap">
              <table className="waterfall">
                <thead>
                  <tr><th>Waterfall line</th><th>AED</th></tr>
                </thead>
                <tbody>
                  {WATERFALL.map(([line, amount, strong]) => (
                    <tr key={line} className={strong ? "strong" : undefined}>
                      <td>{line}</td>
                      <td className="num">{amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="waterfall-note">
              Assumes all revenue was collected, expenses and tax paid, no other working-capital movements or past losses, and legal
              distribution capacity of at least AED 20,000. Five units would receive AED 1,000. This is a calculation example, not a
              return forecast or a tax-rate statement; no performance fee is assumed here.
            </p>
          </div>
        </Reveal>

        <div className="alert info" style={{ marginTop: 40, maxWidth: 820 }}>
          <IconShield size={18} />
          <span>Reports describe the past. They are not a promise about the future — capital at risk.</span>
        </div>
        <div style={{ marginTop: 30 }}>
          <Link to="/projects" className="btn btn-primary">See live projects <IconArrow size={16} /></Link>
        </div>
      </div>
    </div>
  );
}
