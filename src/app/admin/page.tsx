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
    <div className="container animate-fade-in" style={{ paddingTop: "var(--spacing-lg)", paddingBottom: "var(--spacing-xl)" }}>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--spacing-lg)" }}>
        <h1 style={{ fontSize: "2rem" }}>Staff Operations Dashboard</h1>
        <div style={{ background: "rgba(255,179,0,0.1)", color: "var(--color-primary-dark)", padding: "8px 16px", borderRadius: "var(--radius-full)", fontWeight: "bold" }}>
          Admin View
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: selectedOrder ? "1fr 1fr" : "1fr", gap: "var(--spacing-lg)", transition: "all 0.3s ease" }}>
        
        {/* Orders List */}
        <div className="glass-panel" style={{ padding: "var(--spacing-lg)" }}>
          <h2 style={{ marginBottom: "var(--spacing-md)" }}>Recent Orders</h2>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-sm)" }}>
            {orders.map(order => (
              <div 
                key={order.id} 
                onClick={() => setSelectedOrder(order)}
                style={{ 
                  padding: "var(--spacing-md)", 
                  border: `1px solid ${selectedOrder?.id === order.id ? "var(--color-primary)" : "var(--border-color)"}`, 
                  borderRadius: "var(--radius-md)", 
                  cursor: "pointer",
                  background: selectedOrder?.id === order.id ? "rgba(255,179,0,0.05)" : "var(--bg-color)",
                  transition: "all 0.2s ease"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <strong>{order.id}</strong>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{order.created}</span>
                </div>
                <div style={{ marginBottom: "8px", color: "var(--text-color)" }}>{order.customer} <span style={{ color: "var(--text-muted)" }}>• {order.service}</span></div>
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ 
                    fontSize: "0.75rem", 
                    padding: "4px 8px", 
                    borderRadius: "4px",
                    background: order.status === "NEW" ? "rgba(0,100,255,0.1)" : order.status === "QUOTING" ? "rgba(255,179,0,0.1)" : "rgba(76,175,80,0.1)",
                    color: order.status === "NEW" ? "#0064ff" : order.status === "QUOTING" ? "var(--color-primary-dark)" : "#4caf50",
                    fontWeight: "bold"
                  }}>
                    {order.status}
                  </span>
                  {order.priority === "High" && <span style={{ fontSize: "0.8rem", color: "red", fontWeight: "bold" }}>Priority</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Detail View */}
        {selectedOrder && (
          <div className="glass-panel animate-fade-in" style={{ padding: "var(--spacing-lg)", position: "relative" }}>
             <button 
               onClick={() => setSelectedOrder(null)} 
               style={{ position: "absolute", top: "20px", right: "20px", color: "var(--text-muted)" }}
             >✕</button>
             
             <h2 style={{ marginBottom: "var(--spacing-sm)", color: "var(--color-primary)" }}>{selectedOrder.id}</h2>
             <p style={{ color: "var(--text-muted)", marginBottom: "var(--spacing-lg)" }}>{selectedOrder.customer}</p>

             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-md)", marginBottom: "var(--spacing-lg)", borderBottom: "1px solid var(--border-color)", paddingBottom: "var(--spacing-lg)" }}>
                <div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Service Type</div>
                  <div style={{ fontWeight: "500" }}>{selectedOrder.service}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Status</div>
                  <div style={{ fontWeight: "bold" }}>{selectedOrder.status}</div>
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Detailed Specifications</div>
                  <div style={{ background: "var(--bg-color)", padding: "12px", borderRadius: "var(--radius-sm)", marginTop: "4px" }}>
                    {selectedOrder.specs}
                  </div>
                </div>
             </div>

             <h3 style={{ marginBottom: "var(--spacing-md)" }}>Admin Actions</h3>
             <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-sm)" }}>
                <button className="btn btn-outline" style={{ justifyContent: "flex-start" }}>Update Status</button>
                <button className="btn btn-outline" style={{ justifyContent: "flex-start" }}>Assign Quote / Price</button>
                <button className="btn btn-outline" style={{ justifyContent: "flex-start" }}>Download Artwork (if attached)</button>
             </div>
          </div>
        )}

      </div>
    </div>
  );
}
