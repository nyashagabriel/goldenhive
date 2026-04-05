import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-primary",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-secondary",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Golden Hive Prints | Professional Printing Services",
  description: "A Place Where Your Dreams and Ideas Become Reality Through The Mastery Of Printing. High-quality graphic design and printing solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable}`}>
      <body>
        <a href="#main-content" style={{ position: 'absolute', left: '-10000px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' }}>Skip to main content</a>
        
        <header className="glass-nav">
          <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: "80px" }}>
            <Link href="/" aria-label="Golden Hive Home" style={{ display: "flex", alignItems: "center" }}>
              <div style={{ position: "relative", width: "140px", height: "45px", overflow: "hidden" }}>
                <Image 
                  src="/assets/logo_full.png" 
                  alt="Golden Hive Printers Logo" 
                  fill 
                  style={{ objectFit: "contain" }} 
                  priority 
                />
              </div>
            </Link>
            
            <nav aria-label="Primary Navigation" style={{ display: "flex", gap: "var(--space-md)", fontWeight: "500", alignItems: "center" }}>
              <Link href="/services" style={{ textDecoration: "none", color: "var(--text-primary)", transition: "color 0.2s" }} className="nav-link">Services</Link>
              <Link href="/pricing" style={{ textDecoration: "none", color: "var(--text-primary)", transition: "color 0.2s" }} className="nav-link">Pricing</Link>
              <Link href="/portfolio" style={{ textDecoration: "none", color: "var(--text-primary)", transition: "color 0.2s" }} className="nav-link">Portfolio</Link>
              <Link href="/order" className="btn btn-primary">Start a Project</Link>
            </nav>
          </div>
        </header>

        <main id="main-content" style={{ minHeight: "calc(100vh - 160px)" }}>
          {children}
        </main>

        <footer style={{ background: "var(--bg-secondary)", padding: "var(--space-md) 0", marginTop: "auto", borderTop: "1px solid var(--border-subtle)" }}>
          <div className="container" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", color: "var(--text-secondary)", fontSize: "var(--text-sm)" }}>
            <p>&copy; {new Date().getFullYear()} Golden Hive Prints (Pvt) Ltd. All rights reserved.</p>
            <nav aria-label="Footer Navigation" style={{ display: "flex", gap: "var(--space-sm)" }}>
              <Link href="/contact" style={{ textDecoration: "none", color: "inherit" }}>Contact Us</Link>
              <Link href="/trust" style={{ textDecoration: "none", color: "var(--color-brand-primary)", fontWeight: "600" }}>PRAZ Verification</Link>
              <Link href="/admin" style={{ textDecoration: "none", color: "inherit" }}>Staff Portal</Link>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
