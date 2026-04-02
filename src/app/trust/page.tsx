import Link from "next/link";

export default function TrustPage() {
  return (
    <div className="container animate-fade-in" style={{ paddingTop: "var(--spacing-xl)", paddingBottom: "var(--spacing-xl)" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
        
        <div style={{ display: "inline-block", background: "rgba(255, 179, 0, 0.1)", padding: "16px", borderRadius: "50%", marginBottom: "var(--spacing-md)" }}>
          <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            <path d="M9 12l2 2 4-4"></path>
          </svg>
        </div>

        <h1 style={{ fontSize: "2.5rem", marginBottom: "var(--spacing-md)" }}>Official Trust & Registration</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.2rem", marginBottom: "var(--spacing-lg)" }}>
          Golden Hive Prints is fully registered as a legitimate corporate entity to assure you of absolute security, compliance, and guaranteed service delivery.
        </p>

        <div className="glass-panel" style={{ padding: "var(--spacing-lg)", textAlign: "left" }}>
          
          <div style={{ marginBottom: "var(--spacing-sm)", display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-color)", paddingBottom: "8px" }}>
            <span style={{ color: "var(--text-muted)" }}>Registered Entity:</span>
            <strong style={{ color: "var(--color-primary)" }}>GOLDEN HIVE PRINTS</strong>
          </div>

          <div style={{ marginBottom: "var(--spacing-sm)", display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-color)", paddingBottom: "8px" }}>
            <span style={{ color: "var(--text-muted)" }}>Company Registration:</span>
            <strong>50757A0372025</strong>
          </div>

          <div style={{ marginBottom: "var(--spacing-sm)", display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-color)", paddingBottom: "8px" }}>
            <span style={{ color: "var(--text-muted)" }}>Tax ID Number:</span>
            <strong>2002241562</strong>
          </div>

          <div style={{ marginBottom: "var(--spacing-sm)", display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-color)", paddingBottom: "8px" }}>
            <span style={{ color: "var(--text-muted)" }}>PRAZ Reg Number:</span>
            <strong>PR2638812784</strong>
          </div>

          <div style={{ marginBottom: "var(--spacing-sm)", display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-color)", paddingBottom: "8px" }}>
            <span style={{ color: "var(--text-muted)" }}>Supplier Category:</span>
            <strong>Printing Services (SP006)</strong>
          </div>

          <div style={{ marginBottom: "var(--spacing-sm)", display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-color)", paddingBottom: "8px" }}>
            <span style={{ color: "var(--text-muted)" }}>Organization Type:</span>
            <strong>Micro Enterprise (ME)</strong>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "var(--text-muted)" }}>PRAZ Verification Code:</span>
            <strong style={{ color: "#4caf50" }}>PRAZ-2026-337-YWM-38812</strong>
          </div>

        </div>

        <div style={{ marginTop: "var(--spacing-xl)" }}>
           <Link href="/order" className="btn btn-primary" style={{ padding: "16px 32px" }}>Place Your Order Now</Link>
        </div>
      </div>
    </div>
  );
}
