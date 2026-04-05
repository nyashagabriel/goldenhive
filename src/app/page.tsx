import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      {/* Cinematic Hero Section */}
      <section style={{ 
        position: "relative", 
        width: "100%", 
        minHeight: "85vh", 
        display: "flex", 
        alignItems: "center",
        overflow: "hidden"
      }}>
        <div style={{ position: "absolute", inset: 0, zIndex: -2 }}>
          {/* We use an abstract gradient or the generated AI hero if it was linked properly. We use a sleek abstract premium gradient for now. */}
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(circle at 70% 30%, rgba(255, 179, 0, 0.15) 0%, transparent 40%), radial-gradient(circle at 30% 70%, rgba(255, 255, 255, 0.05) 0%, var(--bg-primary) 70%)",
          }}></div>
        </div>
        
        <div className="container animate-in" style={{ position: "relative", zIndex: 10 }}>
          <div style={{ maxWidth: "800px" }}>
            <span style={{ 
              display: "inline-block", 
              padding: "4px 12px", 
              borderRadius: "99px",
              background: "rgba(255, 179, 0, 0.1)",
              color: "var(--color-brand-primary)",
              fontWeight: "600",
              fontSize: "var(--text-sm)",
              marginBottom: "var(--space-md)",
              border: "1px solid rgba(255,179,0,0.2)"
            }}>
              Premier Design & Printing Agency
            </span>
            <h1 style={{ marginBottom: "var(--space-sm)" }}>
              Where Your Dreams & Ideas Become Reality.
            </h1>
            <p style={{ fontSize: "var(--text-lg)", marginBottom: "var(--space-lg)", maxWidth: "600px", color: "var(--text-secondary)" }}>
              Through the mastery of printing, Golden Hive elevates your brand. We don't just start companies, we build brands that last.
            </p>
            <div style={{ display: "flex", gap: "var(--space-sm)", flexWrap: "wrap" }}>
              <Link href="/order" className="btn btn-primary">Start a Project</Link>
              <Link href="/portfolio" className="btn btn-outline" style={{ background: "var(--bg-glass)" }}>View Our Capabilities</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Mission Banners */}
      <section style={{ padding: "var(--space-xl) 0", background: "var(--bg-secondary)" }}>
        <div className="container bento-grid">
          
          <article className="card col-span-half animate-in delay-1" style={{ display: "flex", flexDirection: "column", justifyContent: "center", minHeight: "400px" }}>
            <h2 style={{ fontSize: "var(--text-xl)", color: "var(--color-brand-primary)" }}>Our Vision</h2>
            <p style={{ fontSize: "var(--text-lg)" }}>
              To be the most preferred printing and graphic designing company of choice in Africa and the world over.
            </p>
          </article>

          <article className="card col-span-half animate-in delay-2" style={{ display: "flex", flexDirection: "column", justifyContent: "center", minHeight: "400px", background: "var(--bg-primary)" }}>
            <h2 style={{ fontSize: "var(--text-xl)" }}>Guaranteed Commitment</h2>
            <p style={{ fontSize: "var(--text-lg)" }}>
              "The moment we are assigned to duty, we execute it the Golden Hive way. No job is bigger or smaller than our true commitment, consideration, and capacity."
            </p>
          </article>
          
        </div>
      </section>

      {/* Service Highlights (Minimalist) */}
      <section style={{ padding: "var(--space-xl) 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "var(--space-lg)", maxWidth: "700px", margin: "0 auto var(--space-lg)" }}>
            <h2>Mastery of Printing</h2>
            <p>High-precision execution across every physical and digital medium.</p>
          </div>
          
          <div className="bento-grid">
            <Link href="/services" className="card col-span-third animate-in delay-1" style={{ textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column" }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ marginBottom: "var(--space-xs)" }}>Corporate Stationery</h3>
                <p style={{ fontSize: "var(--text-sm)" }}>Flyers, Corporate Diaries, Receipt Books, and Premium Business Cards.</p>
              </div>
              <div style={{ marginTop: "var(--space-md)", color: "var(--color-brand-primary)", fontWeight: "bold" }}>Explore &rarr;</div>
            </Link>

            <Link href="/services" className="card col-span-third animate-in delay-2" style={{ textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column" }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ marginBottom: "var(--space-xs)" }}>Apparel Branding</h3>
                <p style={{ fontSize: "var(--text-sm)" }}>Custom T-shirts, Hats, Jackets, and high-durability fabrics.</p>
              </div>
              <div style={{ marginTop: "var(--space-md)", color: "var(--color-brand-primary)", fontWeight: "bold" }}>Explore &rarr;</div>
            </Link>

            <Link href="/services" className="card col-span-third animate-in delay-3" style={{ textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column" }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ marginBottom: "var(--space-xs)" }}>Identity Merchandising</h3>
                <p style={{ fontSize: "var(--text-sm)" }}>Mugs, Plates, Tags, and physical branding that leaves an impression.</p>
              </div>
              <div style={{ marginTop: "var(--space-md)", color: "var(--color-brand-primary)", fontWeight: "bold" }}>Explore &rarr;</div>
            </Link>
          </div>
        </div>
      </section>
      
    </div>
  );
}
