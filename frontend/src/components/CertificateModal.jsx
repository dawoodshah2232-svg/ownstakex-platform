import { useEffect } from "react";
import { IconClose } from "./icons";

/* Formal ownership certificate modal — ivory paper, double gold border.
   Print CSS hides everything except the certificate paper. */
export default function CertificateModal({ cert, onClose }) {
  useEffect(() => {
    document.body.classList.add("cert-printing");
    document.body.style.overflow = "hidden";
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("cert-printing");
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const pct = cert.ownership_pct == null || cert.ownership_pct === ""
    ? "—"
    : String(cert.ownership_pct).includes("%") ? cert.ownership_pct : `${cert.ownership_pct}%`;

  return (
    <div className="cert-overlay" role="dialog" aria-modal="true" aria-label="Certificate of Ownership">
      <div className="cert-box">
        <div className="cert-paper cert-printable">
          <div className="cert-border">
            <img src="/logo.png" alt="OwnStakeX" className="cert-logo" />
            <div className="cert-kicker">OwnStakeX · Bridging Investment LLC</div>
            <h2 className="cert-title">Certificate of Ownership</h2>
            <div className="cert-no">Certificate No. <b>{cert.cert_no || "—"}</b></div>
            <p className="cert-body">This certifies that</p>
            <div className="cert-name">{cert.holder_name || "—"}</div>
            {cert.investor_label && <div className="cert-id">{cert.investor_label}</div>}
            <p className="cert-body">is the recorded holder of</p>
            <div className="cert-holding"><b>{cert.units}</b> units · <b>{pct}</b> ownership</div>
            <p className="cert-body">in</p>
            <div className="cert-project">{cert.project_name || "—"}</div>
            {cert.project_code && <div className="cert-code">{cert.project_code}</div>}
            <div className="cert-meta">
              <div><span>Acquired</span><b>{cert.acquired_date || "—"}</b></div>
              <div><span>Register ref</span><b>{cert.register_ref || "—"}</b></div>
              <div><span>Issued</span><b>{cert.issued_at || "—"}</b></div>
            </div>
            <p className="cert-fine">{cert.disclaimer}</p>
            <div className="cert-sign">
              <div><div className="cert-sigline" /><span>Authorised signatory, Bridging Investment LLC</span></div>
              <div><div className="cert-sigline" /><span>Date</span></div>
            </div>
          </div>
        </div>
        <div className="cert-actions">
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            <IconClose size={15} /> Close
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => window.print()}>
            Print / Save PDF
          </button>
        </div>
      </div>
    </div>
  );
}
