// supabase/functions/auth/index.ts — Golden Hive Prints
// Handles: login · me · change_password · create_employee · list_employees · deactivate_employee
//
// Security model:
//   • login is the ONLY unauthenticated action
//   • Every other action requires a valid JWT in Authorization: Bearer <token>
//   • JWT is HS256 signed with GOLDEN_HIVE_JWT_SECRET (server-only env var)
//   • Passwords are NEVER logged or returned — bcrypt is done inside Postgres
//   • Identical error shape for bad user + bad password (prevents enumeration)
//   • Only super_admin or admin roles can create/deactivate employees

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ─── Environment ──────────────────────────────────────────────────────────────
const SUPABASE_URL     = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const JWT_SECRET       = Deno.env.get("GOLDEN_HIVE_JWT_SECRET");
const FRONTEND_URL     = Deno.env.get("FRONTEND_URL");

if (!JWT_SECRET) throw new Error("GOLDEN_HIVE_JWT_SECRET is not set");

const ISSUER = "golden-hive-prints";
const TTL    = 60 * 60 * 24 * 7; // 7 days

// ─── CORS ─────────────────────────────────────────────────────────────────────
const CORS: Record<string, string> = {
  "Access-Control-Allow-Origin":  FRONTEND_URL ?? "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type, apikey",
  "Content-Type": "application/json",
};

// ─── JWT helpers ──────────────────────────────────────────────────────────────
function b64uEncode(buf: ArrayBuffer | string): string {
  const bytes = typeof buf === "string"
    ? new TextEncoder().encode(buf)
    : new Uint8Array(buf);
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function b64uDecode(s: string): Uint8Array {
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/");
  const pad  = b64.length % 4;
  return Uint8Array.from(atob(pad ? b64 + "=".repeat(4 - pad) : b64), (c) => c.charCodeAt(0));
}

async function importHmac(usage: "sign" | "verify"): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(JWT_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    [usage],
  );
}

async function signJwt(payload: Record<string, unknown>): Promise<string> {
  const now    = Math.floor(Date.now() / 1000);
  const claims = { ...payload, iss: ISSUER, iat: now, exp: now + TTL };
  const hdr    = b64uEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const bdy    = b64uEncode(JSON.stringify(claims));
  const msg    = `${hdr}.${bdy}`;
  const key    = await importHmac("sign");
  const sig    = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(msg));
  return `${msg}.${b64uEncode(sig)}`;
}

async function verifyJwt(token: string): Promise<Record<string, unknown> | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [hdr, bdy, sig] = parts;
    const key   = await importHmac("verify");
    const valid = await crypto.subtle.verify(
      "HMAC", key, b64uDecode(sig), new TextEncoder().encode(`${hdr}.${bdy}`),
    );
    if (!valid) return null;
    const claims = JSON.parse(new TextDecoder().decode(b64uDecode(bdy)));
    if (claims.exp < Date.now() / 1000 || claims.iss !== ISSUER) return null;
    return claims;
  } catch {
    return null;
  }
}

// ─── Response helpers ─────────────────────────────────────────────────────────
const ok  = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: CORS });
const err = (message: string, status = 400) =>
  new Response(JSON.stringify({ error: message }), { status, headers: CORS });

// ─── Main handler ─────────────────────────────────────────────────────────────
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  if (req.method !== "POST")    return err("Method not allowed", 405);

  let body: Record<string, unknown>;
  try { body = await req.json(); }
  catch { return err("Invalid JSON", 400); }

  const action = body.action as string | undefined;
  if (!action) return err("Missing action", 400);

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const db = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  // ── LOGIN (public) ──────────────────────────────────────────────────────────
  if (action === "login") {
    const username = (body.username as string | undefined)?.trim().toLowerCase();
    const password = body.password as string | undefined;
    if (!username || !password) return err("Missing credentials", 400);

    const { data, error } = await db.rpc("login", {
      p_username: username,
      p_password: password,
      p_ip: ip,
    });

    if (error) { console.error("[auth/login] rpc:", error.message); return err("Service unavailable", 503); }

    const row = (data as Record<string, unknown>[] | null)?.[0];
    if (!row || row.error) return err("Invalid credentials", 401);

    const token = await signJwt({
      sub:           row.user_id,
      username:      row.username,
      full_name:     row.full_name ?? null,
      role:          row.role,
      must_change_pw: row.must_change_pw ?? false,
    });

    return ok({ token, user: { id: row.user_id, username: row.username, full_name: row.full_name, role: row.role, must_change_pw: row.must_change_pw } });
  }

  // ── Require JWT for all actions below ──────────────────────────────────────
  const bearer = req.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
  if (!bearer) return err("Unauthorized", 401);
  const claims = await verifyJwt(bearer);
  if (!claims) return err("Unauthorized", 401);

  // ── ME ──────────────────────────────────────────────────────────────────────
  if (action === "me") {
    const { data, error } = await db.rpc("auth_me", { p_user_id: String(claims.sub) });
    if (error || !data?.length) return err("Not found", 404);
    return ok({ user: data[0] });
  }

  // ── CHANGE PASSWORD ─────────────────────────────────────────────────────────
  if (action === "change_password") {
    const old_password = body.old_password as string | undefined;
    const new_password = body.new_password as string | undefined;
    if (!old_password || !new_password) return err("Missing passwords", 400);
    if (new_password.length < 8) return err("Password must be at least 8 characters", 422);

    const { data, error } = await db.rpc("change_password", {
      p_user_id: String(claims.sub),
      p_old_password: old_password,
      p_new_password: new_password,
    });

    if (error) return err("Service unavailable", 503);
    if ((data as Record<string, unknown>)?.error) return err((data as Record<string, unknown>).error as string, 400);
    return ok({ message: "Password updated" });
  }

  // ── CREATE EMPLOYEE (admin/super_admin only) ────────────────────────────────
  if (action === "create_employee") {
    if (!["super_admin", "admin"].includes(String(claims.role))) return err("Forbidden", 403);

    const username  = (body.username as string | undefined)?.trim().toLowerCase();
    const password  = body.password as string | undefined;
    const full_name = (body.full_name as string | undefined)?.trim();
    const role      = body.role as string | undefined;
    const phone     = (body.phone as string | undefined)?.trim() || null;

    if (!username || !password || !role) return err("Missing required fields", 400);
    if (password.length < 8) return err("Password must be at least 8 characters", 422);
    if (!["admin", "staff"].includes(role)) return err("Invalid role", 422);
    if (!/^[a-z0-9_]{3,30}$/.test(username)) return err("Username must be 3-30 chars: lowercase letters, numbers, underscores", 422);

    const { data: hashData, error: hashErr } = await db.rpc("hash_password", { raw_password: password });
    if (hashErr) return err("Service unavailable", 503);

    const { data, error } = await db.rpc("create_employee", {
      p_username:      username,
      p_password_hash: String(hashData),
      p_full_name:     full_name || username,
      p_role:          role,
      p_phone:         phone,
      p_created_by:    String(claims.sub),
    });

    if (error) {
      if (error.code === "23505") return err("Username already taken", 409);
      console.error("[auth/create_employee]:", error.message);
      return err("Failed to create employee", 500);
    }

    const user = (data as Record<string, unknown>[] | null)?.[0];
    await db.rpc("insert_audit_log", {
      p_actor_id: String(claims.sub), p_actor_role: String(claims.role),
      p_action: "EMPLOYEE_CREATED", p_entity: "users",
      p_entity_id: (user as Record<string, unknown>)?.id,
      p_metadata: { username, role }, p_ip_address: ip,
    });

    return ok({ user }, 201);
  }

  // ── LIST EMPLOYEES (admin/super_admin only) ─────────────────────────────────
  if (action === "list_employees") {
    if (!["super_admin", "admin"].includes(String(claims.role))) return err("Forbidden", 403);
    const { data, error } = await db.rpc("list_employees");
    if (error) return err("Service unavailable", 503);
    return ok({ employees: data });
  }

  // ── DEACTIVATE EMPLOYEE (super_admin only) ──────────────────────────────────
  if (action === "deactivate_employee") {
    if (claims.role !== "super_admin") return err("Forbidden", 403);
    const user_id = body.user_id as string | undefined;
    if (!user_id) return err("Missing user_id", 400);
    if (user_id === String(claims.sub)) return err("Cannot deactivate your own account", 400);

    const { error } = await db.rpc("deactivate_employee", { p_user_id: user_id });
    if (error) return err("Failed to deactivate", 500);
    return ok({ message: "Employee deactivated" });
  }

  return err("Unknown action", 400);
});
