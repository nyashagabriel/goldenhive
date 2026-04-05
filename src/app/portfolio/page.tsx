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
    <div style={{ padding: "var(--space-xl) 0" }}>
      <div className="container animate-in">
        <header style={{ marginBottom: "var(--space-xl)", maxWidth: "800px" }}>
          <h1 style={{ fontSize: "var(--text-3xl)", marginBottom: "var(--space-sm)" }}>Identity Portfolio</h1>
          <p style={{ fontSize: "var(--text-lg)", color: "var(--text-secondary)" }}>
            From your logo to your shop branding, Golden Hive Prints is here to make your business stand out from day one. Don't just start a company, build a brand that lasts.
          </p>
        </header>

        <div className="bento-grid">
          {artworks.map((art, i) => (
            <article 
              key={i} 
              className={`card ${i === 0 || i === 1 ? 'col-span-half' : 'col-span-half'}`} 
              style={{ overflow: "hidden", position: "relative", padding: 0, minHeight: "450px", border: "1px solid var(--border-subtle)" }}
            >
              <Image 
                src={`/assets/${art.img}`} 
                alt={art.title} 
                fill 
                style={{ objectFit: "cover", backgroundColor: "var(--bg-secondary)" }} 
              />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "var(--space-md)", background: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)", color: "#ffffff" }}>
                <h3 style={{ fontSize: "var(--text-xl)", margin: "0 0 var(--space-xs) 0", color: "var(--color-brand-primary)" }}>{art.title}</h3>
                <p style={{ margin: 0, fontSize: "var(--text-base)", color: "#e4e4e7" }}>{art.desc}</p>
              </div>
            </article>
          ))}
        </div>

        <div style={{ marginTop: "var(--space-xl)", padding: "var(--space-lg)", borderRadius: "var(--radius-lg)", background: "var(--bg-secondary)", textAlign: "center", border: "1px solid var(--border-subtle)" }}>
          <h2 style={{ fontSize: "var(--text-2xl)" }}>Ready to amplify your message?</h2>
          <p style={{ margin: "var(--space-sm) 0 var(--space-lg) 0", color: "var(--text-secondary)", fontSize: "var(--text-lg)" }}>
            Let us elevate your brand and turn ideas into powerful visuals that drive results.
          </p>
          <Link href="/order" className="btn btn-primary" style={{ padding: "16px 32px", fontSize: "var(--text-lg)" }}>
            Start Your Project
          </Link>
        </div>
      </div>
    </div>
  );
}
