"use client";

import { useState } from "react";

export default function OrderPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "", phone: "", service: "Stationery", specs: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };

  return (
    <div style={{ padding: "var(--space-xl) 0" }}>
      <div className="container animate-in" style={{ maxWidth: "800px" }}>
        <header style={{ textAlign: "center", marginBottom: "var(--space-xl)" }}>
          <h1 style={{ fontSize: "var(--text-3xl)", marginBottom: "var(--space-sm)" }}>Order Builder</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-lg)" }}>Initiate your production job securely. Step {step} of 2.</p>
        </header>

        <article className="card" style={{ padding: "var(--space-lg)" }}>
          {step === 1 && (
            <form onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
              <div style={{ marginBottom: "var(--space-md)" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>Full Name / Company Name</label>
                <input required type="text" className="form-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Golden Hive" />
              </div>
              <div style={{ marginBottom: "var(--space-md)" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>Phone (WhatsApp Priority)</label>
                <input required type="tel" className="form-input" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+263 78 0 032 307" />
              </div>
              <div style={{ marginBottom: "var(--space-lg)" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>Select Primary Service</label>
                <select className="form-input" value={formData.service} onChange={e => setFormData({...formData, service: e.target.value})}>
                  <option>Stationery & Books</option>
                  <option>Branded Clothing</option>
                  <option>Merchandise (Plates, Mugs, Tags)</option>
                  <option>Custom Graphic Design Combo</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: "100%", fontSize: "var(--text-lg)" }}>Next: Specifications</button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "var(--space-md)" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>Detailed Specifications (Size, Qty, Deadline)</label>
                <textarea required className="form-input" rows={6} value={formData.specs} onChange={e => setFormData({...formData, specs: e.target.value})} placeholder="e.g. 500 A4 flyers, gloss paper..." />
              </div>
              <div style={{ marginBottom: "var(--space-lg)", padding: "var(--space-md)", background: "var(--bg-secondary)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
                <label style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontWeight: "bold" }}>
                  <span>Upload Artwork (.pdf, .jpg)</span>
                  <span style={{ fontSize: "var(--text-sm)", color: "var(--color-brand-primary)" }}>Optional</span>
                </label>
                <input type="file" className="form-input" accept=".pdf,image/*" />
              </div>
              <div style={{ display: "flex", gap: "var(--space-sm)" }}>
                <button type="button" onClick={() => setStep(1)} className="btn btn-outline" style={{ flex: 1 }}>Back</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>Submit Order for Quote</button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div style={{ textAlign: "center", padding: "var(--space-xl) 0" }}>
              <div style={{ display: "inline-block", background: "rgba(76, 175, 80, 0.1)", padding: "20px", borderRadius: "50%", marginBottom: "var(--space-md)" }}>
                 <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="#4caf50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                   <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                   <polyline points="22 4 12 14.01 9 11.01"></polyline>
                 </svg>
              </div>
              <h2 style={{ fontSize: "var(--text-3xl)", marginBottom: "var(--space-sm)" }}>Order Received!</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-lg)" }}>Your ticket is logged. We will review and contact you with a quote.</p>
              <div style={{ marginTop: "var(--space-lg)" }}>
                <button onClick={() => setStep(1)} className="btn btn-outline">Submit Another Project</button>
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
