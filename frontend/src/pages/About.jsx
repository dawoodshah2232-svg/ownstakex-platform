import { Link } from "react-router-dom";
import { IconArrow, IconShield, IconUsers } from "../components/icons";
import Reveal from "../components/Reveal";
import PageHead, { HOME_CRUMB } from "../components/PageHead";

export default function About() {
  return (
    <div className="page">
      <PageHead title='About' description='OwnStakeX.com is owned by Bridging Investment LLC, Dubai, UAE. Premium real-world assets, made investable for everyone.' path="/about" breadcrumbs={[HOME_CRUMB, { name: "About", path: "/about" }]} />
      <div className="container">
        <div className="page-head">
          <h1>About OwnStakeX</h1>
          <p>OwnStakeX.com is owned by Bridging Investment LLC, Dubai, UAE. We exist to make premium real-world assets investable for everyone — not just institutions.</p>
        </div>
        <div className="prose">
          <Reveal>
            <h2>Why fractional ownership</h2>
            <p className="lede">The best-performing assets have always had the highest barriers to entry. We lower the barrier without lowering the standard.</p>
            <p>A marina apartment, a charter yacht, a boutique hotel — each can generate strong, tangible returns, but each demands capital, expertise and management far beyond most investors. OwnStakeX structures these assets into regulated-style, transparent vehicles where many investors can each own a meaningful stake.</p>
          </Reveal>
          <Reveal>
            <h2>How we're different</h2>
            <ul>
              <li><strong>Curated, not crowded.</strong> We list a small number of opportunities we have underwritten ourselves.</li>
              <li><strong>Documents first.</strong> Valuations, structures and risks are published before a single dirham is accepted.</li>
              <li><strong>Aligned fees.</strong> Our economics are disclosed per project. No hidden carry, no surprises.</li>
            </ul>
          </Reveal>
          <Reveal>
            <h2>Our commitment</h2>
            <p>We will never promise guaranteed returns, because no honest platform can. What we promise is transparency: you'll always know what you own, what it costs, and what the risks are. Capital is at risk on every investment.</p>
          </Reveal>
        </div>
        <div className="grid-3" style={{ marginTop: 50 }}>
          <Reveal>
            <div className="stat-card"><span style={{ color: "var(--orange)" }}><IconUsers size={26} /></span><div className="v" style={{ marginTop: 8 }}>500+</div><div className="k">Registered investors</div></div>
          </Reveal>
          <Reveal delay="d1">
            <div className="stat-card"><span style={{ color: "var(--orange)" }}><IconShield size={26} /></span><div className="v" style={{ marginTop: 8 }}>100%</div><div className="k">Documented opportunities</div></div>
          </Reveal>
          <Reveal delay="d2">
            <div className="stat-card"><div className="v">4</div><div className="k">Asset categories</div></div>
          </Reveal>
        </div>
        <div style={{ textAlign: "center", marginTop: 50 }}>
          <Link to="/contact" className="btn btn-primary btn-lg">Talk to us <IconArrow size={17} /></Link>
        </div>
      </div>
    </div>
  );
}
