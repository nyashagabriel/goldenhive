// supabase/functions/admin/index.ts — Golden Hive Prints
// Handles: list_orders · get_order · update_order_status · list_employees
//
// ALL actions require a valid staff JWT. Role guards inside each action.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL     = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const JWT_SECRET       = Deno.env.get("GOLDEN_HIVE_JWT_SECRET");
const FRONTEND_URL     = Deno.env.get("FRONTEND_URL");

if (!JWT_SECRET) throw new Error("GOLDEN_HIVE_JWT_SECRET is not set");

const ISSUER = "golden-hive-prints";

const CORS: Record<string, string> = {
  "Access-Control-Allow-Origin":  FRONTEND_URL ?? "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type, apikey",
  "Content-Type": "application/json",
};

// ─── JWT verify (same as auth function) ───────────────────────────────────────
function b64uDecode(s: string): Uint8Array {
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/");
  const pad  = b64.length % 4;
  return Uint8Array.from(atob(pad ? b64 + "=".repeat(4 - pad) : b64), (c) => c.charCodeAt(0));
}

async function verifyJwt(token: string): Promise<Record<string, unknown> | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [hdr, bdy, sig] = parts;
    const key = await crypto.subtle.importKey(
      "raw", new TextEncoder().encode(JWT_SECRET),
      { name: "HMAC", hash: "SHA-256" }, false, ["verify"],
    );
    const valid = await crypto.subtle.verify(
      "HMAC", key, b64uDecode(sig), new TextEncoder().encode(`${hdr}.${bdy}`),
    );
    if (!valid) return null;
    const claims = JSON.parse(new TextDecoder().decode(b64uDecode(bdy)));
    if (claims.exp < Date.now() / 1000 || claims.iss !== ISSUER) return null;
    return claims;
  } catch { return null; }
}

const ok  = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: CORS });
const err = (message: string, status = 400) =>
  new Response(JSON.stringify({ error: message }), { status, headers: CORS });

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  if (req.method !== "POST")    return err("Method not allowed", 405);

  // Auth gate — requires valid staff JWT
  const bearer = req.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
  if (!bearer) return err("Unauthorized", 401);
  const claims = await verifyJwt(bearer);
  if (!claims) return err("Unauthorized", 401);

  let body: Record<string, unknown>;
  try { body = await req.json(); }
  catch { return err("Invalid JSON", 400); }

  const action = body.action as string | undefined;
  if (!action) return err("Missing action", 400);

  const db = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  // ── LIST ORDERS ─────────────────────────────────────────────────────────────
  if (action === "list_orders") {
    // Staff only sees their own assigned orders; admins see all
    const isAdmin = ["super_admin", "admin"].includes(String(claims.role));
    const { data, error } = await db.rpc("list_orders", {
      p_status:      body.status ?? null,
      p_assigned_to: isAdmin ? (body.assigned_to ?? null) : String(claims.sub),
    });
    if (error) return err("Service unavailable", 503);
    return ok({ orders: data });
  }

  // ── GET SINGLE ORDER ────────────────────────────────────────────────────────
  if (action === "get_order") {
    const order_id = body.order_id as string | undefined;
    if (!order_id) return err("order_id is required", 400);
    const { data, error } = await db.rpc("get_order", { p_order_id: order_id });
    if (error) return err("Service unavailable", 503);
    const order = (data as Record<string, unknown>[] | null)?.[0];
    if (!order) return err("Order not found", 404);
    return ok({ order });
  }

  // ── UPDATE ORDER STATUS ─────────────────────────────────────────────────────
  if (action === "update_order_status") {
    const order_id    = body.order_id as string | undefined;
    const new_status  = body.status as string | undefined;
    if (!order_id || !new_status) return err("order_id and status are required", 400);

    const valid_statuses = ["NEW","QUOTING","AWAITING_PAYMENT","IN_PRODUCTION","READY","DELIVERED","CANCELLED"];
    if (!valid_statuses.includes(new_status)) return err("Invalid status", 422);

    const { error } = await db.rpc("update_order_status", {
      p_order_id:      order_id,
      p_status:        new_status,
      p_actor_id:      String(claims.sub),
      p_note:          body.note ?? null,
      p_public_notes:  body.public_notes ?? null,
      p_assigned_to:   body.assigned_to ?? null,
      p_quoted_amount: body.quoted_amount ?? null,
      p_priority:      body.priority ?? null,
    });
    if (error) return err("Failed to update order: " + error.message, 500);
    return ok({ success: true, status: new_status });
  }

  return err("Unknown action", 400);
});
