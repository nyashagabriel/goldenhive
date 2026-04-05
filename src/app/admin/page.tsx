"use client";

import { useState } from "react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Mock data representing Supabase table "orders"
  const orders = [
    { id: "ORD-9912", created: "2026-03-01 10:14", customer: "Apex Christian Academy", service: "Stationery", status: "NEW", specs: "500 Brochures", priority: "High" },
    { id: "ORD-9911", created: "2026-02-28 14:30", customer: "John Doe", service: "Branded Clothing", status: "QUOTING", specs: "15 Custom T-Shirts (Black, Large)", priority: "Normal" },
    { id: "ORD-9910", created: "2026-02-28 09:12", customer: "First Class Private School", service: "Merchandise", status: "IN_PRODUCTION", specs: "100 Branded Mugs", priority: "High" },
  ];

  return (
    <div style={{ padding: "var(--space-lg) 0 var(--space-xl) 0" }}>
      <div className="container animate-in">
        
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)", flexWrap: "wrap", gap: "1rem" }}>
          <h1 style={{ fontSize: "var(--text-2xl)" }}>Operations Dashboard</h1>
          <div style={{ background: "var(--color-brand-primary)", color: "var(--text-on-brand)", padding: "8px 16px", borderRadius: "99px", fontWeight: "bold" }}>
            Admin View
          </div>
        </header>

        <div className="bento-grid" style={{ transition: "all 0.3s ease" }}>
          
          {/* Orders List */}
          <article className={`card ${selectedOrder ? "col-span-half" : "col-span-full"} animate-in`} style={{ padding: "var(--space-lg)" }}>
            <h2 style={{ marginBottom: "var(--space-md)" }}>Recent Jobs</h2>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {orders.map(order => (
                <div 
                  key={order.id} 
                  onClick={() => setSelectedOrder(order)}
                  style={{ 
                    padding: "16px", 
                    border: `1px solid ${selectedOrder?.id === order.id ? "var(--color-brand-primary)" : "var(--border-subtle)"}`, 
                    borderRadius: "var(--radius-md)", 
                    cursor: "pointer",
                    background: selectedOrder?.id === order.id ? "rgba(255,179,0,0.05)" : "var(--bg-primary)",
                    transition: "all 0.2s ease"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <strong style={{ fontSize: "var(--text-lg)" }}>{order.id}</strong>
                    <span style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>{order.created}</span>
                  </div>
                  <div style={{ marginBottom: "12px", color: "var(--text-primary)" }}>
                    {order.customer} <span style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)" }}>• {order.service}</span>
                  </div>
                  
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ 
                      fontSize: "var(--text-xs)", 
                      padding: "6px 12px", 
                      borderRadius: "6px",
                      background: order.status === "NEW" ? "rgba(0,100,255,0.1)" : order.status === "QUOTING" ? "rgba(255,179,0,0.1)" : "rgba(76,175,80,0.1)",
                      color: order.status === "NEW" ? "#0064ff" : order.status === "QUOTING" ? "var(--color-brand-primary)" : "#4caf50",
                      fontWeight: "bold",
                      textTransform: "uppercase"
                    }}>
                      {order.status}
                    </span>
                    {order.priority === "High" && <span style={{ fontSize: "var(--text-xs)", color: "red", fontWeight: "bold", textTransform: "uppercase" }}>Priority</span>}
                  </div>
                </div>
              ))}
            </div>
          </article>

          {/* Order Detail View */}
          {selectedOrder && (
            <article className="card col-span-half animate-in" style={{ padding: "var(--space-lg)", position: "relative" }}>
               <button 
                 onClick={() => setSelectedOrder(null)} 
                 style={{ position: "absolute", top: "24px", right: "24px", color: "var(--text-secondary)", background: "transparent", border: "none", cursor: "pointer", fontSize: "1.5rem" }}
               >✕</button>
               
               <h2 style={{ marginBottom: "var(--space-xs)", color: "var(--color-brand-primary)" }}>{selectedOrder.id}</h2>
               <p style={{ color: "var(--text-secondary)", marginBottom: "var(--space-lg)", fontSize: "var(--text-lg)" }}>{selectedOrder.customer}</p>

               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)", marginBottom: "var(--space-lg)", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "var(--space-lg)" }}>
                  <div>
                    <div style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>Service Type</div>
                    <div style={{ fontWeight: "600", fontSize: "var(--text-base)" }}>{selectedOrder.service}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>Status</div>
                    <div style={{ fontWeight: "600", fontSize: "var(--text-base)" }}>{selectedOrder.status}</div>
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <div style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>Detailed Specifications</div>
                    <div style={{ background: "var(--bg-primary)", border: "1px solid var(--border-subtle)", padding: "16px", borderRadius: "var(--radius-md)", marginTop: "8px" }}>
                      {selectedOrder.specs}
                    </div>
                  </div>
               </div>

               <h3 style={{ marginBottom: "var(--space-md)" }}>Admin Actions</h3>
               <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <button className="btn btn-outline" style={{ justifyContent: "flex-start", width: "100%" }}>Update Status</button>
                  <button className="btn btn-outline" style={{ justifyContent: "flex-start", width: "100%" }}>Assign Quote / Price</button>
                  <button className="btn btn-outline" style={{ justifyContent: "flex-start", width: "100%" }}>Download Artwork</button>
               </div>
            </article>
          )}

        </div>
      </div>
    </div>
  );
}
