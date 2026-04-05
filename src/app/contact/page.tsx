import Link from "next/link";
import Image from "next/image";

export default function ContactPage() {
  return (
    <div style={{ padding: "var(--space-xl) 0" }}>
      <div className="container animate-in">
        <header style={{ textAlign: "center", marginBottom: "var(--space-xl)" }}>
          <h1 style={{ fontSize: "var(--text-3xl)", marginBottom: "var(--space-sm)" }}>Contact & Address</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-lg)", maxWidth: "600px", margin: "0 auto" }}>
            We are spreading our wings in Africa starting from a humble beginning in Harare, Zimbabwe. 
            Get in touch with us to amplify your message.
          </p>
        </header>

        <div className="bento-grid">
          
          <article className="card col-span-half" style={{ padding: "var(--space-lg)" }}>
            <h2 style={{ marginBottom: "var(--space-md)", fontSize: "var(--text-2xl)" }}>Get In Touch</h2>
            
            <div style={{ marginBottom: "var(--space-md)" }}>
              <h4 style={{ color: "var(--text-secondary)", marginBottom: "4px" }}>Mobile / WhatsApp</h4>
              <p style={{ fontSize: "var(--text-lg)" }}>+263 78 0 032 307</p>
            </div>
            
            <div style={{ marginBottom: "var(--space-md)" }}>
              <h4 style={{ color: "var(--text-secondary)", marginBottom: "4px" }}>Email</h4>
              <p style={{ fontSize: "var(--text-lg)" }}>goldenhiveprints841@gmail.com</p>
            </div>

            <div style={{ marginBottom: "var(--space-md)" }}>
              <h4 style={{ color: "var(--text-secondary)", marginBottom: "4px" }}>Business Address</h4>
              <p style={{ fontSize: "var(--text-lg)" }}>
                103 Chinhoyi Street<br/>
                Vassan Building (Opp. Zuva Serviced Station)<br/>
                Harare, Zimbabwe
              </p>
            </div>

            <div style={{ marginBottom: "var(--space-md)" }}>
              <h4 style={{ color: "var(--text-secondary)", marginBottom: "4px" }}>Registered Office</h4>
              <p style={{ fontSize: "var(--text-lg)" }}>
                379 OTS<br/>
                Sakubva, Mutare
              </p>
            </div>
          </article>

          <article className="card col-span-half" style={{ padding: "var(--space-lg)", display: "flex", flexDirection: "column", background: "var(--color-brand-primary)" }}>
            <h2 style={{ marginBottom: "var(--space-md)", fontSize: "var(--text-2xl)", color: "var(--text-on-brand)" }}>We guarantee your satisfaction</h2>
            <div style={{ position: "relative", flex: 1, minHeight: "250px", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
               <Image src="/assets/logo_full.png" alt="Golden Hive" fill style={{ objectFit: "contain", opacity: 0.15 }} />
               <div style={{ position: "relative", zIndex: 1, fontSize: "var(--text-lg)", fontStyle: "italic", lineHeight: 1.8, paddingTop: "20px", color: "var(--text-on-brand)" }}>
                 "The moment we are assigned to duty, we execute it the 'Golden Hive' way... no job is bigger or smaller than our commitment, consideration and capacity."
               </div>
            </div>
            <div style={{ marginTop: "var(--space-md)" }}>
              <Link href="/order" className="btn btn-outline" style={{ width: "100%", borderColor: "rgba(0,0,0,0.5)", color: "var(--text-on-brand)" }}>Start Processing an Order</Link>
            </div>
          </article>

        </div>
      </div>
    </div>
  );
}
