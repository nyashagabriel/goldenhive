import Image from "next/image";
import Link from "next/link";

export default function PricingPage() {
  const promos = [
    { title: "Branded Umbrellas", img: "combo-1.jpg", price: "$8 (3 Panels)", bulk: "$7 each for 20+" },
    { title: "Branded Polo T-Shirts", img: "combo-2.jpg", price: "$8", bulk: "$6.50 each for 20+" },
    { title: "Custom Diaries / Notebooks", img: "combo-3.jpg", price: "$15 each", bulk: "$10 each for 10+" },
    { title: "Branded Caps", img: "combo-4.jpg", price: "$2 each", bulk: "Contact us for volume discounts" },
    { title: "Branded Paper Bags", img: "combo-5.jpg", price: "$5 each", bulk: "Brand visibility adds value!" },
  ];

  return (
    <div className="container animate-fade-in" style={{ paddingTop: "var(--spacing-xl)", paddingBottom: "var(--spacing-xl)" }}>
      <div style={{ textAlign: "center", marginBottom: "var(--spacing-xl)" }}>
        <h1 style={{ fontSize: "3rem" }}>Promotional Pricing & Value Offers</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.2rem", maxWidth: "600px", margin: "0 auto" }}>
          Brand visibility adds more value! We offer highly competitive rates for bulk branding to guarantee satisfaction for your business.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "var(--spacing-lg)" }}>
        {promos.map((promo, i) => (
          <div key={i} className="glass-panel hover-lift" style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ position: "relative", width: "100%", paddingBottom: "100%" }}>
              <Image 
                src={`/assets/${promo.img}`} 
                alt={promo.title} 
                fill 
                style={{ objectFit: "contain", backgroundColor: "#fff" }} 
              />
            </div>
            <div style={{ padding: "var(--spacing-md)", textAlign: "center", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "var(--spacing-xs)" }}>{promo.title}</h3>
              <div style={{ marginBottom: "var(--spacing-sm)", color: "var(--color-primary)", fontWeight: "bold", fontSize: "1.2rem" }}>
                {promo.price}
              </div>
              <div style={{ marginBottom: "var(--spacing-md)", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                {promo.bulk}
              </div>
              <Link href={`/order?package=${encodeURIComponent(promo.title)}`} className="btn btn-outline" style={{ width: "100%" }}>
                Select Promoted Item
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: "var(--spacing-xl)", textAlign: "center" }}>
        <h2>Need a Custom Quote?</h2>
        <p style={{ marginBottom: "var(--spacing-md)", color: "var(--text-muted)" }}>We tailor our pricing specifically for your unique requirements beyond these promos.</p>
        <Link href="/order" className="btn btn-primary">Request Custom Quote</Link>
      </div>
    </div>
  );
}
