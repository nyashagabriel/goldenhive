import Link from "next/link";

export default function ServicesPage() {
  const categories = [
    {
      title: "Printing of Stationery",
      description: "Our high-precision presses handle every stationery need.",
      items: ["Flyers", "Calendars", "Diaries", "Books", "Receipt books, Invoices Books", "Business cards", "Pamphlets", "Newsprints"]
    },
    {
      title: "Printing of Clothing",
      description: "Custom branding that speaks volumes on apparel.",
      items: ["T-shirts and caps", "Hats", "Jackets", "Corporate Uniforms"]
    },
    {
      title: "Printing of Other Merchandise",
      description: "Take your identity beyond paper and fabric.",
      items: ["Plates and Cups", "Tags", "Stickers", "Banners"]
    }
  ];

  return (
    <div style={{ padding: "var(--space-xl) 0" }}>
      <div className="container animate-in">
        <header style={{ textAlign: "center", marginBottom: "var(--space-xl)" }}>
          <h1 style={{ fontSize: "var(--text-3xl)", marginBottom: "var(--space-sm)" }}>Our Services</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-lg)", maxWidth: "700px", margin: "0 auto" }}>
            In pursuit of our Pan African vision, we offer high quality graphic designing and printing services, guaranteeing the elevation of brands and the amplification of your message.
          </p>
        </header>

        <div className="bento-grid">
          {categories.map((category, i) => (
            <article key={i} className="card col-span-12" style={{ padding: "var(--space-lg)" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
                <div>
                  <h2 style={{ color: "var(--color-brand-primary)", marginBottom: "var(--space-xs)", fontSize: "var(--text-2xl)" }}>{category.title}</h2>
                  <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-lg)" }}>{category.description}</p>
                </div>
                
                <ul style={{ listStyleType: "none", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "var(--space-sm)" }}>
                  {category.items.map((item, j) => (
                    <li key={j} style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "var(--text-base)" }}>
                      <span style={{ color: "var(--color-brand-primary)", fontWeight: "bold" }}>✓</span> {item}
                    </li>
                  ))}
                </ul>
                
                <div style={{ marginTop: "var(--space-md)", paddingTop: "var(--space-md)", borderTop: "1px solid var(--border-subtle)" }}>
                    <Link href={`/order?service=${encodeURIComponent(category.title)}`} className="btn btn-outline">
                      Order this Service
                    </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
