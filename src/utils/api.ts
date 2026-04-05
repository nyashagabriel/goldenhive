/**
 * Golden Hive API Client
 * ─────────────────────────────────────────────────────────────────────────────
 * All database interactions flow through our Supabase Edge Functions.
 * The browser NEVER has the service_role key.
 * The anon key is safe to expose — it only lets the browser call our
 * Edge Functions and nothing else (all RLS is locked on private schema).
 *
 * Edge Function base URL pattern:
 *   {SUPABASE_URL}/functions/v1/{function-name}
 */

const SUPABASE_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!SUPABASE_URL || !SUPABASE_ANON) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

const fnUrl = (name: string) => `${SUPABASE_URL}/functions/v1/${name}`;

// ─── Generic caller ───────────────────────────────────────────────────────────
async function callFn(
  fnName: string,
  body: Record<string, unknown>,
  jwt?: string | null,
): Promise<{ data: unknown; error: string | null }> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "apikey":       SUPABASE_ANON,
  };
  if (jwt) headers["Authorization"] = `Bearer ${jwt}`;

  try {
    const res  = await fetch(fnUrl(fnName), { method: "POST", headers, body: JSON.stringify(body) });
    const json = await res.json();
    if (!res.ok) return { data: null, error: json.error ?? `HTTP ${res.status}` };
    return { data: json, error: null };
  } catch (e) {
    return { data: null, error: (e as Error).message };
  }
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────
export const auth = {
  login: (username: string, password: string) =>
    callFn("auth", { action: "login", username, password }),

  me: (jwt: string) =>
    callFn("auth", { action: "me" }, jwt),

  changePassword: (jwt: string, old_password: string, new_password: string) =>
    callFn("auth", { action: "change_password", old_password, new_password }, jwt),

  createEmployee: (jwt: string, payload: {
    username: string; password: string; full_name: string; role: string; phone?: string;
  }) => callFn("auth", { action: "create_employee", ...payload }, jwt),

  listEmployees: (jwt: string) =>
    callFn("auth", { action: "list_employees" }, jwt),

  deactivateEmployee: (jwt: string, user_id: string) =>
    callFn("auth", { action: "deactivate_employee", user_id }, jwt),
};

// ─── ORDERS ───────────────────────────────────────────────────────────────────
export const orders = {
  submit: (payload: {
    customer_name: string;
    customer_phone: string;
    customer_email?: string;
    customer_company?: string;
    service_name: string;
    service_id?: string;
    specs?: Record<string, unknown>;
    design_needed?: boolean;
  }) => callFn("orders", { action: "submit_order", ...payload }),

  track: (order_id: string) =>
    callFn("orders", { action: "track_order", order_id }),
};

// ─── ADMIN ────────────────────────────────────────────────────────────────────
export const admin = {
  listOrders: (jwt: string, filters?: { status?: string; assigned_to?: string }) =>
    callFn("admin", { action: "list_orders", ...filters }, jwt),

  getOrder: (jwt: string, order_id: string) =>
    callFn("admin", { action: "get_order", order_id }, jwt),

  updateOrderStatus: (jwt: string, payload: {
    order_id: string;
    status: string;
    note?: string;
    public_notes?: string;
    assigned_to?: string;
    quoted_amount?: number;
    priority?: number;
  }) => callFn("admin", { action: "update_order_status", ...payload }, jwt),
};

// ─── Session helpers (localStorage — static site safe) ────────────────────────
export const session = {
  save: (token: string, user: unknown) => {
    localStorage.setItem("gh_token", token);
    localStorage.setItem("gh_user", JSON.stringify(user));
  },
  get: () => ({
    token: localStorage.getItem("gh_token"),
    user:  JSON.parse(localStorage.getItem("gh_user") ?? "null"),
  }),
  clear: () => {
    localStorage.removeItem("gh_token");
    localStorage.removeItem("gh_user");
  },
  isValid: () => !!localStorage.getItem("gh_token"),
};
