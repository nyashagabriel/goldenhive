"use client";

import { useState } from "react";

export default function OrderPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "", phone: "", service: "Stationery", specs: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3); // Simulated success
  };

  return (
    <div className="container animate-fade-in" style={{ paddingTop: "var(--spacing-xl)", paddingBottom: "var(--spacing-xl)", maxWidth: "800px" }}>
      <div style={{ textAlign: "center", marginBottom: "var(--spacing-xl)" }}>
        <h1 style={{ fontSize: "2.5rem" }}>Order Builder</h1>
        <p style={{ color: "var(--text-muted)" }}>Initiate your production job securely. Step {step} of 2.</p>
      </div>

      <div className="glass-panel" style={{ padding: "var(--spacing-lg)" }}>
        {step === 1 && (
          <form onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
            <div className="form-group">
              <label className="form-label">Full Name / Company Name</label>
              <input required type="text" className="form-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Golden Hive" />
            </div>
            <div className="form-group">
              <label className="form-label">Phone (WhatsApp Priority)</label>
              <input required type="tel" className="form-input" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+263 78 0 032 307" />
            </div>
            <div className="form-group">
              <label className="form-label">Select Primary Service</label>
              <select className="form-input" value={formData.service} onChange={e => setFormData({...formData, service: e.target.value})}>
                <option>Stationery & Books</option>
                <option>Branded Clothing</option>
                <option>Merchandise (Plates, Mugs, Tags)</option>
                <option>Custom Graphic Design Combo</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "var(--spacing-sm)" }}>Next: Specifications</button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Detailed Specifications (Size, Qty, Deadline)</label>
              <textarea required className="form-input" rows={5} value={formData.specs} onChange={e => setFormData({...formData, specs: e.target.value})} placeholder="e.g. 500 A4 flyers, gloss paper, due by Friday." />
            </div>
            <div className="form-group" style={{ padding: "var(--spacing-md)", background: "var(--bg-color)", borderRadius: "var(--radius-md)" }}>
              <label className="form-label" style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Upload Artwork or Reference (.pdf, .jpg)</span>
                <span style={{ fontSize: "0.8rem", color: "var(--color-primary)" }}>Optional</span>
              </label>
              <input type="file" className="form-input" accept=".pdf,image/*" />
            </div>
            <div style={{ display: "flex", gap: "var(--spacing-sm)", marginTop: "var(--spacing-md)" }}>
              <button type="button" onClick={() => setStep(1)} className="btn btn-outline" style={{ flex: 1 }}>Back</button>
              <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>Submit Order for Quote</button>
            </div>
          </form>
        )}

        {step === 3 && (
          <div style={{ textAlign: "center", padding: "var(--spacing-lg) 0" }}>
            <div style={{ display: "inline-block", background: "rgba(76, 175, 80, 0.1)", padding: "20px", borderRadius: "50%", marginBottom: "var(--spacing-md)" }}>
               <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="#4caf50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                 <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                 <polyline points="22 4 12 14.01 9 11.01"></polyline>
               </svg>
            </div>
            <h2>Order Received Successfully!</h2>
            <p style={{ color: "var(--text-muted)", marginTop: "var(--spacing-sm)" }}>Your job ticket has been initialized. Our team will review the specifications and reach out with a quote shortly on WhatsApp.</p>
            <div style={{ marginTop: "var(--spacing-lg)" }}>
              <button onClick={() => setStep(1)} className="btn btn-outline" style={{ display: "inline-flex" }}>Submit Another Project</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
