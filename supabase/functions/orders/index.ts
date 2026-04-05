// supabase/functions/orders/index.ts — Golden Hive Prints
// Handles: submit_order (public) · track_order (public by UUID)
//
// These two actions are intentionally PUBLIC with no auth requirement.
// Security is enforced by the Postgres SECURITY DEFINER functions themselves.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL     = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const FRONTEND_URL     = Deno.env.get("FRONTEND_URL");

const CORS: Record<string, string> = {
  "Access-Control-Allow-Origin":  FRONTEND_URL ?? "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, apikey",
  "Content-Type": "application/json",
};

const ok  = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: CORS });
const err = (message: string, status = 400) =>
  new Response(JSON.stringify({ error: message }), { status, headers: CORS });

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  if (req.method !== "POST")    return err("Method not allowed", 405);

  let body: Record<string, unknown>;
  try { body = await req.json(); }
  catch { return err("Invalid JSON", 400); }

  const action = body.action as string | undefined;
  if (!action) return err("Missing action", 400);

  const db = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  // ── SUBMIT ORDER (public — no auth required) ────────────────────────────────
  if (action === "submit_order") {
    const name    = (body.customer_name as string | undefined)?.trim();
    const phone   = (body.customer_phone as string | undefined)?.trim();
    const email   = (body.customer_email as string | undefined)?.trim() || "";
    const company = (body.customer_company as string | undefined)?.trim() || "";
    const service_name = (body.service_name as string | undefined)?.trim();
    const service_id   = (body.service_id as string | undefined)?.trim() || null;
    const specs        = (body.specs as Record<string, unknown> | undefined) ?? {};
    const design_needed = Boolean(body.design_needed);

    if (!name || !phone || !service_name) {
      return err("name, phone, and service_name are required", 422);
    }
    if (!/^\+?[0-9\s\-()]{7,20}$/.test(phone)) {
      return err("Invalid phone number format", 422);
    }

    const { data, error } = await db.rpc("submit_order", {
      p_customer_name:    name,
      p_customer_phone:   phone,
      p_customer_email:   email,
      p_customer_company: company,
      p_service_name:     service_name,
      p_service_id:       service_id,
      p_specs:            JSON.stringify(specs),
      p_design_needed:    design_needed,
      p_source:           "web",
    });

    if (error) { console.error("[orders/submit]:", error.message); return err("Failed to submit order", 500); }

    const row = (data as Record<string, unknown>[] | null)?.[0];
    return ok({ order_id: row?.order_id, tracking_number: row?.tracking_number }, 201);
  }

  // ── TRACK ORDER (public, by UUID) ───────────────────────────────────────────
  if (action === "track_order") {
    const order_id = (body.order_id as string | undefined)?.trim();
    if (!order_id) return err("order_id is required", 400);

    // Basic UUID format guard — prevents silly errors and mild abuse
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(order_id)) {
      return err("Invalid order ID format", 400);
    }

    const { data, error } = await db.rpc("track_order", { p_order_id: order_id });
    if (error) { console.error("[orders/track]:", error.message); return err("Service unavailable", 503); }

    const order = (data as Record<string, unknown>[] | null)?.[0];
    if (!order) return err("Order not found", 404);
    return ok({ order });
  }

  return err("Unknown action", 400);
});
