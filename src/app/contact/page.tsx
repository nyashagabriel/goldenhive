import Link from "next/link";
import Image from "next/image";

export default function ContactPage() {
  return (
    <div className="container animate-fade-in" style={{ paddingTop: "var(--spacing-xl)", paddingBottom: "var(--spacing-xl)" }}>
      <div style={{ textAlign: "center", marginBottom: "var(--spacing-xl)" }}>
        <h1 style={{ fontSize: "3rem" }}>Contact & Address</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.2rem", maxWidth: "600px", margin: "0 auto" }}>
          We are spreading our wings in Africa starting from a humble beginning in Harare, Zimbabwe. 
          Get in touch with us to amplify your message.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "var(--spacing-lg)" }}>
        
        <div className="glass-panel" style={{ padding: "var(--spacing-lg)" }}>
          <h2 style={{ marginBottom: "var(--spacing-md)" }}>Get In Touch</h2>
          
          <div style={{ marginBottom: "var(--spacing-md)" }}>
            <h4 style={{ color: "var(--text-muted)", marginBottom: "4px" }}>Mobile / WhatsApp</h4>
            <p style={{ fontSize: "1.1rem" }}>+263 78 0 032 307</p>
          </div>
          
          <div style={{ marginBottom: "var(--spacing-md)" }}>
            <h4 style={{ color: "var(--text-muted)", marginBottom: "4px" }}>Email</h4>
            <p style={{ fontSize: "1.1rem" }}>goldenhiveprints841@gmail.com</p>
          </div>

          <div style={{ marginBottom: "var(--spacing-md)" }}>
            <h4 style={{ color: "var(--text-muted)", marginBottom: "4px" }}>Business Address</h4>
            <p style={{ fontSize: "1.1rem" }}>
              103 Chinhoyi Street<br/>
              Vassan Building (Opp. Zuva Serviced Station)<br/>
              Harare, Zimbabwe
            </p>
          </div>

          <div style={{ marginBottom: "var(--spacing-md)" }}>
            <h4 style={{ color: "var(--text-muted)", marginBottom: "4px" }}>Registered Office</h4>
            <p style={{ fontSize: "1.1rem" }}>
              379 OTS<br/>
              Sakubva, Mutare
            </p>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "var(--spacing-lg)", display: "flex", flexDirection: "column" }}>
          <h2 style={{ marginBottom: "var(--spacing-md)" }}>We guarantee your satisfaction</h2>
          <div style={{ position: "relative", flex: 1, minHeight: "250px", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
             <Image src="/assets/logo_full.png" alt="Golden Hive" fill style={{ objectFit: "contain", opacity: 0.15 }} />
             <div style={{ position: "relative", zIndex: 1, fontSize: "1.2rem", fontStyle: "italic", lineHeight: 1.8, paddingTop: "20px" }}>
               "The moment we are assigned to duty, we execute it the 'Golden Hive' way... no job is bigger or smaller than our commitment, consideration and capacity."
             </div>
          </div>
          <div style={{ marginTop: "var(--spacing-md)" }}>
            <Link href="/order" className="btn btn-primary" style={{ width: "100%" }}>Start Processing an Order</Link>
          </div>
        </div>

      </div>
    </div>
  );
}
