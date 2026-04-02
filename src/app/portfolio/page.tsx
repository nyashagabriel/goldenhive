import Image from "next/image";
import Link from "next/link";

export default function PortfolioPage() {
  const artworks = [
    { title: "Ready To Launch Your Brand? (Consultancy & Vision)", img: "mock-2.jpg", desc: "You have got the vision, we have the tools." },
    { title: "High Quality Print Materials (Flyers & Receipts)", img: "mock-1.jpg", desc: "Every handshake & receipt leaves an impression." },
    { title: "Social Media Post Design", img: "post-1.jpg", desc: "Digital graphics to amplify your message." },
    { title: "Event Promotional Poster", img: "poster-1.jpg", desc: "Large scale printing." },
  ];

  return (
    <div className="container animate-fade-in" style={{ paddingTop: "var(--spacing-xl)", paddingBottom: "var(--spacing-xl)" }}>
      <div style={{ textAlign: "center", marginBottom: "var(--spacing-xl)" }}>
        <h1 style={{ fontSize: "3rem" }}>Our Identity Portfolio</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.2rem", maxWidth: "700px", margin: "0 auto" }}>
          From your logo to your shop branding, Golden Hive Prints is here to make your business stand out from day one. Don't just start a company, build a brand that lasts.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "var(--spacing-lg)" }}>
        {artworks.map((art, i) => (
          <div key={i} className="hover-lift" style={{ borderRadius: "var(--radius-md)", overflow: "hidden", position: "relative", aspectRatio: "4/3", border: "1px solid var(--border-color)" }}>
            <Image 
              src={`/assets/${art.img}`} 
              alt={art.title} 
              fill 
              style={{ objectFit: "cover", backgroundColor: "#fff" }} 
            />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "var(--spacing-sm)", background: "rgba(0,0,0,0.85)", color: "white" }}>
              <h4 style={{ margin: "0 0 4px 0", color: "var(--color-primary)" }}>{art.title}</h4>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#ccc" }}>{art.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "var(--spacing-xl)", padding: "var(--spacing-lg)", borderRadius: "var(--radius-lg)", background: "var(--surface-color)", textAlign: "center" }}>
        <h2>Ready to amplify your message?</h2>
        <p style={{ margin: "var(--spacing-sm) 0 var(--spacing-lg) 0", color: "var(--text-muted)" }}>
          Let us elevate your brand and turn ideas into powerful visuals that drive results.
        </p>
        <Link href="/order" className="btn btn-primary" style={{ padding: "16px 32px", fontSize: "1.1rem" }}>
          Start Your Project
        </Link>
      </div>
    </div>
  );
}
