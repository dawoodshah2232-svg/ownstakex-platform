import { Link } from "react-router-dom";
import { IconArrow, IconShield } from "../components/icons";
import Reveal from "../components/Reveal";
import PageHead, { HOME_CRUMB } from "../components/PageHead";

const svg = (children) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);

/** The investor journey — spec v1.1, eight steps. */
const JOURNEY = [
  { title: "Explore", icon: svg(<><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>), text: "View permitted project information, risks, capital budget, fees and status. Register interest if the offer is unavailable to you." },
  { title: "Verify", icon: svg(<><path d="M12 2.5 20 6v6c0 5-3.5 8.2-8 9.5C7.5 20.2 4 17 4 12V6z" /><path d="m8.8 12 2.2 2.2 4.2-4.4" /></>), text: "Verify contact details, identity, residence, tax information, funding source and eligibility. Reviews are resolved before you can reserve." },
  { title: "Reserve", icon: svg(<path d="M6 3.5h12v17l-6-4.2-6 4.2z" />), text: "Select quantity, review the current documents and confirm terms. Units are held for you with a visible expiry time, and you receive a reservation reference." },
  { title: "Reach target", icon: svg(<><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.2" fill="currentColor" /></>), text: "When valid commitments cover the offer, it is labelled fully reserved awaiting payment. Finance and compliance approve the funding call." },
  { title: "Pay", icon: svg(<><rect x="2.5" y="6" width="19" height="13" rx="2.5" /><path d="M2.5 10h19" /><path d="M6 15h4" /></>), text: "A unique payment reference and due date are issued. You pay the authorised designated account; uploaded proof remains unverified until reconciliation." },
  { title: "Close", icon: svg(<><path d="M6 2.5h8L19 8v13.5H6z" /><path d="M14 2.5V8h5" /><path d="m9 13.5 2 2 4-4.5" /></>), text: "Funding, eligibility, signed documents, remaining statutory rights and acquisition conditions are confirmed. Then legal closing and ownership issuance." },
  { title: "Operate", icon: svg(<><path d="M5 20v-7M11 20V6M17 20v-11" /><path d="M3 20h18" /></>), text: "Your portal shows issued holdings, the actual start date, monthly reports, approved distribution notices and project updates." },
  { title: "Exit", icon: svg(<><path d="M14 3.5h-8v17h8" /><path d="M14 12h9m-3-3 3 3-3 3" /></>), text: "A permitted transfer, asset sale or winding up — administered under the legal waterfall. The final account is published and net proceeds distributed." },
];

const GOOD_TO_KNOW = [
  { title: "Binding vs non-binding", text: "Exploring and registering interest are non-binding. Confirming a reservation is a commitment to fund within the disclosed window. Ownership arises only from cleared funds and legal issuance." },
  { title: "All-or-nothing closing", text: "Campaigns close only at 100% funding. If the long-stop date passes short of target, the offer is cancelled and collected subscriptions are returned under the refund policy." },
  { title: "Fees, disclosed", text: "1% of capital at closing plus 1% annual administration — shown with amounts, recipients and timing on every project page. No hidden spreads, no surprises." },
];

export default function HowItWorks() {
  return (
    <>
      <PageHead title='How It Works' description='From interest to income in eight steps. How fractional investing works on OwnStakeX — reserve, pay, operate, earn.' path="/how-it-works" breadcrumbs={[HOME_CRUMB, { name: "How It Works", path: "/how-it-works" }]} />
      <section className="hiw-band hiw-page">
        <div className="container">
          <Reveal>
            <div className="hiw-head">
              <div className="kicker hiw-kicker">The investor journey</div>
              <h1>From interest to income,<br />in eight steps.</h1>
              <p>No jargon, no blurred lines. You will always know what is a hold, what is a commitment, and what creates ownership.</p>
            </div>
          </Reveal>
          <div className="hiw-grid g8">
            {JOURNEY.map((s, i) => (
              <Reveal key={s.title} delay={`d${i % 4}`}>
                <div className="hiw-card">
                  <span className="hiw-num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  <span className="hiw-ico" aria-hidden="true">{s.icon}</span>
                  <b>{s.title}</b>
                  <p>{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal>
            <div className="panel three-rules">
              <div className="kicker" style={{ marginBottom: 10 }}>The three rules</div>
              <h3 style={{ marginBottom: 14 }}>What shapes every step above</h3>
              <ol>
                <li><b>A reservation is a hold, not ownership.</b> It reduces available slots; cleared funds and completed legal issuance create ownership.</li>
                <li><b>Full reservation triggers a payment call.</b> Acquisition begins only after funding and all closing conditions are satisfied.</li>
                <li><b>Reports monthly; distributions from real profit only.</b> Paid only from legally distributable profits and available cash after approved costs and reserves. Capital and returns are at risk.</li>
              </ol>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ background: "var(--bg2)" }}>
        <div className="container">
          <Reveal>
            <div className="section-head">
              <div className="kicker">Good to know</div>
              <h2>The fine print, up front.</h2>
            </div>
          </Reveal>
          <div className="grid-3">
            {GOOD_TO_KNOW.map((g, i) => (
              <Reveal key={g.title} delay={i ? `d${i}` : ""}>
                <div className="panel" style={{ marginBottom: 0 }}>
                  <h3>{g.title}</h3>
                  <p className="ph-sub" style={{ marginBottom: 0 }}>{g.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="alert info" style={{ marginTop: 40 }}>
            <IconShield size={18} />
            <span>Capital at risk. Fractional ownership does not guarantee returns or liquidity. Read each project's documents carefully.</span>
          </div>
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <Link to="/projects" className="btn btn-primary btn-lg">Browse projects <IconArrow size={17} /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
