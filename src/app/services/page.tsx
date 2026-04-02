import Link from "next/link";

export default function ServicesPage() {
  const categories = [
    {
      title: "Printing of Stationery",
      description: "Our high-precision presses handle every stationery need.",
      items: ["Flyers", "Calendars", "Diaries", "Books", "Receipt books, Invoices Books, Quotation books", "Business cards", "Pamphlets", "Newsprints"]
    },
    {
      title: "Printing of Clothing",
      description: "Custom branding that speaks volumes on apparel.",
      items: ["T-shirts and caps", "Hats", "Jackets"]
    },
    {
      title: "Printing of Other Merchandise",
      description: "Take your identity beyond paper and fabric.",
      items: ["Plates and Cups", "Tags", "Stickers"]
    }
  ];

  return (
    <div className="container animate-fade-in" style={{ paddingTop: "var(--spacing-xl)", paddingBottom: "var(--spacing-xl)" }}>
      <div style={{ textAlign: "center", marginBottom: "var(--spacing-xl)" }}>
        <h1 style={{ fontSize: "3rem" }}>Our Services</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.2rem", maxWidth: "700px", margin: "0 auto" }}>
          In pursuit of our Pan African vision, we offer high quality graphic designing and printing services, guaranteeing the elevation of brands and the amplification of your message.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--spacing-lg)", maxWidth: "800px", margin: "0 auto" }}>
        {categories.map((category, i) => (
          <div key={i} className="glass-panel hover-lift" style={{ padding: "var(--spacing-lg)" }}>
            <h2 style={{ color: "var(--color-primary)", marginBottom: "var(--spacing-xs)" }}>{category.title}</h2>
            <p style={{ color: "var(--text-muted)", marginBottom: "var(--spacing-sm)" }}>{category.description}</p>
            
            <ul style={{ listStyleType: "none", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px", marginTop: "var(--spacing-sm)" }}>
              {category.items.map((item, j) => (
                <li key={j} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ color: "var(--color-primary)" }}>✓</span> {item}
                </li>
              ))}
            </ul>
            
            <div style={{ marginTop: "var(--spacing-md)", paddingTop: "var(--spacing-sm)", borderTop: "1px solid var(--border-color)" }}>
                <Link href={`/order?service=${encodeURIComponent(category.title)}`} className="btn btn-outline">
                  Order this Service
                </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
