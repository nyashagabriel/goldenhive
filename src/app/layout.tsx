import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-primary",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-secondary",
});

export const metadata: Metadata = {
  title: "Golden Hive Prints | Professional Printing Services",
  description: "A Place Where Your Dreams and Ideas Become Reality Through The Mastery Of Printing. High-quality graphic design and printing solutions in Harare, Zimbabwe.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable}`}>
      <body>
        <header className="navbar">
          <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: "80px" }}>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ position: "relative", width: "120px", height: "40px", overflow: "hidden" }}>
                <Image src="/assets/logo_full.png" alt="Golden Hive Logo" fill style={{ objectFit: "contain" }} priority />
              </div>
            </Link>
            <nav style={{ display: "flex", gap: "24px", fontWeight: "500", alignItems: "center" }}>
              <Link href="/services" className="hover-lift">Services</Link>
              <Link href="/pricing" className="hover-lift">Pricing</Link>
              <Link href="/portfolio" className="hover-lift">Portfolio</Link>
              <Link href="/order" className="btn btn-primary hover-lift" style={{ padding: "8px 24px" }}>Order Now</Link>
            </nav>
          </div>
        </header>
        <main style={{ minHeight: "calc(100vh - 160px)" }}>{children}</main>
        <footer style={{ background: "var(--surface-color)", padding: "var(--spacing-md) 0", marginTop: "auto", borderTop: "1px solid var(--border-color)" }}>
          <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "var(--text-muted)", fontSize: "0.9rem" }}>
            <p>&copy; {new Date().getFullYear()} Golden Hive Prints (Pvt) Ltd. All rights reserved.</p>
            <div style={{ display: "flex", gap: "16px" }}>
              <Link href="/contact" className="hover-lift">Contact Us</Link>
              <Link href="/trust" className="hover-lift" style={{ color: "var(--color-primary)" }}>PRAZ Verification</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
