import Link from "next/link";

export default function TrustPage() {
  return (
    <div style={{ padding: "var(--space-xl) 0" }}>
      <div className="container animate-in">
        <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
          
          <div style={{ display: "inline-block", background: "rgba(255, 179, 0, 0.1)", padding: "16px", borderRadius: "50%", marginBottom: "var(--space-md)" }}>
            <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="var(--color-brand-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              <path d="M9 12l2 2 4-4"></path>
            </svg>
          </div>

          <h1 style={{ fontSize: "var(--text-3xl)", marginBottom: "var(--space-md)" }}>Official Trust & Registration</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-lg)", marginBottom: "var(--space-lg)" }}>
            Golden Hive Prints is fully registered as a legitimate corporate entity to assure you of absolute security, compliance, and guaranteed service delivery.
          </p>

          <article className="card" style={{ padding: "var(--space-lg)", textAlign: "left" }}>
            
            <div style={{ marginBottom: "var(--space-sm)", display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "12px" }}>
              <span style={{ color: "var(--text-secondary)" }}>Registered Entity:</span>
              <strong style={{ color: "var(--color-brand-primary)", fontSize: "var(--text-lg)" }}>GOLDEN HIVE PRINTS</strong>
            </div>

            <div style={{ marginBottom: "var(--space-sm)", display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "12px" }}>
              <span style={{ color: "var(--text-secondary)" }}>Company Registration:</span>
              <strong style={{ fontSize: "var(--text-lg)" }}>50757A0372025</strong>
            </div>

            <div style={{ marginBottom: "var(--space-sm)", display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "12px" }}>
              <span style={{ color: "var(--text-secondary)" }}>Tax ID Number:</span>
              <strong style={{ fontSize: "var(--text-lg)" }}>2002241562</strong>
            </div>

            <div style={{ marginBottom: "var(--space-sm)", display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "12px" }}>
              <span style={{ color: "var(--text-secondary)" }}>PRAZ Reg Number:</span>
              <strong style={{ fontSize: "var(--text-lg)" }}>PR2638812784</strong>
            </div>

            <div style={{ marginBottom: "var(--space-sm)", display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "12px" }}>
              <span style={{ color: "var(--text-secondary)" }}>Supplier Category:</span>
              <strong style={{ fontSize: "var(--text-lg)" }}>Printing Services (SP006)</strong>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "12px" }}>
              <span style={{ color: "var(--text-secondary)" }}>PRAZ Verification Code:</span>
              <strong style={{ color: "#4caf50", fontSize: "var(--text-lg)" }}>PRAZ-2026-337-YWM-38812</strong>
            </div>

          </article>

          <div style={{ marginTop: "var(--space-xl)" }}>
             <Link href="/order" className="btn btn-primary" style={{ padding: "16px 40px", fontSize: "var(--text-lg)" }}>Place Your Order Now</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
