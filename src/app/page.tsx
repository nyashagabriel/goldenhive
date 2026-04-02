import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <Image
            src="/hero.png"
            alt="Golden Hive Prints Hero"
            fill
            className={styles.heroImage}
            priority
          />
        </div>
        <div className={`container animate-fade-in`}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Where Your Dreams Become <span>Reality</span>
            </h1>
            <p className={styles.heroDescription}>
              Through the mastery of printing. We are Golden Hive Prints – a multi-dimensional specialist in graphic design and high-quality printing solutions guaranteeing satisfaction for your brand.
            </p>
            <div className={styles.heroActions}>
              <Link href="/order" className="btn btn-primary hover-lift">
                Place an Order
              </Link>
              <Link href="/services" className="btn btn-outline hover-lift">
                Explore Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.servicesSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Our Masteries</h2>
            <p style={{ color: "var(--text-muted)" }}>From stunning graphics to precision printing.</p>
          </div>
          <div className={styles.servicesGrid}>
            <div className={`glass-panel hover-lift ${styles.serviceCard}`}>
              <div className={styles.serviceIcon}>
                {/* SVG placeholder for Stationery */}
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3>Stationery & Books</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Calendars, receipt books, invoices, business cards, flyers, and premium diaries.</p>
            </div>

            <div className={`glass-panel hover-lift ${styles.serviceCard}`}>
              <div className={styles.serviceIcon}>
                {/* SVG placeholder for Clothing */}
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3>Branded Clothing</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>T-shirts, caps, hats, and jackets customized to elevate your brand presence.</p>
            </div>

            <div className={`glass-panel hover-lift ${styles.serviceCard}`}>
              <div className={styles.serviceIcon}>
                {/* SVG placeholder for Merchandise */}
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3>Merchandise & Identity</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Plates, cups, tags, stickers, and comprehensive corporate identity solutions.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
