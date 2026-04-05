import Image from "next/image";
import Link from "next/link";

export default function PricingPage() {
  const promos = [
    { title: "Branded Umbrellas", img: "combo-1.jpg", price: "$8", desc: "(3 Panels)", bulk: "$7 each for 20+" },
    { title: "Branded Polo T-Shirts", img: "combo-2.jpg", price: "$8", desc: "Corporate Fit", bulk: "$6.50 each for 20+" },
    { title: "Custom Diaries", img: "combo-3.jpg", price: "$15", desc: "Premium Hardcover", bulk: "$10 each for 10+" },
    { title: "Branded Caps", img: "combo-4.jpg", price: "$2", desc: "Classic Trucker Fit", bulk: "Contact for volume" },
    { title: "Paper Bags", img: "combo-5.jpg", price: "$5", desc: "Elegance on delivery", bulk: "Brand visibility adds value" },
  ];

  return (
    <div style={{ padding: "var(--space-xl) 0" }}>
      <div className="container animate-in">
        <header style={{ marginBottom: "var(--space-xl)", maxWidth: "800px" }}>
          <h1 style={{ fontSize: "var(--text-3xl)", marginBottom: "var(--space-sm)" }}>Promotional Value</h1>
          <p style={{ fontSize: "var(--text-lg)", color: "var(--text-secondary)" }}>
            Brand visibility adds more value! We offer highly competitive rates for bulk premium branding to guarantee satisfaction for your business.
          </p>
        </header>

        <div className="bento-grid">
          {promos.map((promo, i) => (
            <article 
               key={i} 
               className={`card ${i < 2 ? 'col-span-half' : 'col-span-third'}`} 
               style={{ overflow: "hidden", display: "flex", flexDirection: "column", padding: 0 }}
            >
              <div style={{ position: "relative", width: "100%", paddingBottom: "80%", background: "#ffffff" }}>
                <Image 
                  src={`/assets/${promo.img}`} 
                  alt={promo.title} 
                  fill 
                  style={{ objectFit: "contain" }} 
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div style={{ padding: "var(--space-md)", flex: 1, display: "flex", flexDirection: "column" }}>
                <h3 style={{ fontSize: "var(--text-lg)", marginBottom: "var(--space-xs)" }}>{promo.title}</h3>
                <span style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", marginBottom: "var(--space-sm)" }}>{promo.desc}</span>
                
                <div style={{ marginTop: "auto", borderTop: "1px solid var(--border-subtle)", paddingTop: "var(--space-sm)", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <div>
                    <div style={{ fontSize: "var(--text-2xl)", fontWeight: "bold", fontFamily: "var(--font-primary)", color: "var(--text-primary)", lineHeight: 1 }}>
                      {promo.price}
                    </div>
                    <div style={{ fontSize: "var(--text-xs)", color: "var(--color-brand-primary)", marginTop: "4px", fontWeight: "bold", textTransform: "uppercase" }}>{promo.bulk}</div>
                  </div>
                  <Link href={`/order?package=${encodeURIComponent(promo.title)}`} className="btn btn-primary" aria-label={`Order ${promo.title}`} style={{ padding: "0.5rem 1rem" }}>
                    Order
                  </Link>
                </div>
              </div>
            </article>
          ))}
          
          <article className="card col-span-third" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", minHeight: "300px" }}>
            <h3 style={{ marginBottom: "var(--space-xs)" }}>Bespoke Quote</h3>
            <p style={{ fontSize: "var(--text-sm)", marginBottom: "var(--space-md)" }}>We offer custom pricing tailored strictly to your production scale.</p>
            <Link href="/order" className="btn btn-outline">Request Custom Quote</Link>
          </article>
        </div>
      </div>
    </div>
  );
}
