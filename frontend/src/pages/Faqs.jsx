import { useState } from "react";
import { DEMO_FAQS } from "../data/demo";
import { IconArrow } from "../components/icons";
import Reveal from "../components/Reveal";
import PageHead, { HOME_CRUMB } from "../components/PageHead";

export default function Faqs() {
  const [open, setOpen] = useState(0);
  return (
    <div className="page">
      <PageHead title='FAQs' description='Frequently asked questions about fractional investing on OwnStakeX.' path="/faqs" breadcrumbs={[HOME_CRUMB, { name: "FAQs", path: "/faqs" }]} />
      <div className="container">
        <div className="page-head">
          <h1>Frequently asked questions</h1>
          <p>Straight answers about how OwnStakeX works, what it costs, and what the risks are.</p>
        </div>
        <div style={{ maxWidth: 800 }}>
          {DEMO_FAQS.map((f, i) => (
            <Reveal key={i}>
              <div className="acc">
                <button className="acc-q" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
                  {f.q}
                  <span style={{ color: "var(--orange)", transform: open === i ? "rotate(90deg)" : "none", transition: ".2s", display: "inline-flex" }}>
                    <IconArrow size={18} />
                  </span>
                </button>
                {open === i && <div className="acc-a">{f.a}</div>}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
