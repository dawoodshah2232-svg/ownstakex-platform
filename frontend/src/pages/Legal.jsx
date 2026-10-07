import Reveal from "../components/Reveal";

const SECTIONS = [
  {
    h: "Terms of use",
    body: [
      "OwnStakeX.com is owned by Bridging Investment LLC, Dubai, UAE. By using this platform you agree to these terms.",
      "Content on this platform is educational and informational. It is not financial advice, and nothing here constitutes an offer to sell or a solicitation to buy any security.",
      "You must be of legal age in your jurisdiction and pass our verification checks before investing.",
    ],
  },
  {
    h: "Risk disclosure",
    body: [
      "All investments carry risk. The value of your stake can go down as well as up, and you may get back less than you invest.",
      "Fractional stakes may be illiquid: resale depends on finding a buyer, and lock-in periods may apply per project.",
      "Projected yields shown on project pages are targets based on stated assumptions, not guarantees.",
      "Never invest money you cannot afford to lose. Consider seeking independent financial advice.",
    ],
  },
  {
    h: "Privacy",
    body: [
      "We collect only the data needed to operate your account and meet compliance obligations: identity documents, contact details and transaction records.",
      "Your data is stored securely and never sold. Verification is handled by regulated providers.",
      "You may request a copy or deletion of your personal data at any time via the contact page.",
    ],
  },
  {
    h: "Complaints",
    body: [
      "If something goes wrong, contact us first — most issues are resolved within 5 business days.",
      "Unresolved complaints can be escalated to the relevant authority in the UAE.",
    ],
  },
];

export default function Legal() {
  return (
    <div className="page">
      <div className="container">
        <div className="page-head">
          <h1>Legal</h1>
          <p>The fine print, in plain language. Last updated October 2026.</p>
        </div>
        <div className="prose">
          {SECTIONS.map((s, i) => (
            <Reveal key={i}>
              <h2>{s.h}</h2>
              {s.body.map((p, j) => <p key={j}>{p}</p>)}
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
