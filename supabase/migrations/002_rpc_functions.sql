-- ═══════════════════════════════════════════════════════════════════════════════
-- Golden Hive Prints - Migration 002: Public RPC Functions
-- ═══════════════════════════════════════════════════════════════════════════════
-- These are SECURITY DEFINER wrappers called exclusively by Edge Functions.
-- The Edge Functions supply a SERVICE_ROLE_KEY — never the browser directly.
-- ═══════════════════════════════════════════════════════════════════════════════

-- ─── PASSWORD UTILITIES ───────────────────────────────────────────────────────

create or replace function public.hash_password(raw_password text)
returns text
language sql
security definer
set search_path = golden_hive, public, pg_temp
as $$
  select crypt(raw_password, gen_salt('bf', 12));
$$;

create or replace function public.login(
  p_username text,
  p_password text,
  p_ip       text default null
)
returns table (
  user_id        uuid,
  username       text,
  full_name      text,
  role           text,
  must_change_pw boolean,
  error          text
)
language plpgsql
security definer
set search_path = golden_hive, public, pg_temp
as $$
declare
  v_user golden_hive.users%rowtype;
begin
  -- Fetch user (avoid separate existence check to prevent timing attacks)
  select * into v_user
  from golden_hive.users u
  where lower(u.username) = lower(p_username)
    and u.is_active = true
  limit 1;

  -- Intentionally identical error path for bad user + bad password
  if v_user.id is null or v_user.password_hash != crypt(p_password, v_user.password_hash) then
    insert into golden_hive.audit_log(action, metadata, ip_address)
    values('LOGIN_FAILED', jsonb_build_object('username', p_username), p_ip);
    return query select null::uuid, null::text, null::text, null::text, null::boolean, 'invalid_credentials'::text;
    return;
  end if;

  -- Update last login
  update golden_hive.users set last_login_at = now() where id = v_user.id;

  insert into golden_hive.audit_log(actor_id, actor_role, action, entity, entity_id, ip_address)
  values(v_user.id, v_user.role::text, 'LOGIN_OK', 'users', v_user.id, p_ip);

  return query select
    v_user.id,
    v_user.username,
    v_user.full_name,
    v_user.role::text,
    v_user.must_change_pw,
    null::text;
end;
$$;

-- ─── AUTH ME ─────────────────────────────────────────────────────────────────

create or replace function public.auth_me(p_user_id uuid)
returns table (
  id             uuid,
  username       text,
  full_name      text,
  role           text,
  is_active      boolean,
  must_change_pw boolean,
  recovery_email text,
  created_at     timestamptz
)
language sql
security definer
set search_path = golden_hive, public, pg_temp
as $$
  select u.id, u.username, u.full_name, u.role::text,
         u.is_active, u.must_change_pw, u.recovery_email, u.created_at
  from golden_hive.users u
  where u.id = p_user_id
  limit 1;
$$;

-- ─── CHANGE PASSWORD ──────────────────────────────────────────────────────────

create or replace function public.change_password(
  p_user_id     uuid,
  p_old_password text,
  p_new_password text
)
returns jsonb
language plpgsql
security definer
set search_path = golden_hive, public, pg_temp
as $$
declare
  v_hash text;
begin
  select password_hash into v_hash
  from golden_hive.users where id = p_user_id;

  if v_hash is null or v_hash != crypt(p_old_password, v_hash) then
    return jsonb_build_object('error', 'invalid_credentials');
  end if;

  update golden_hive.users
  set password_hash = crypt(p_new_password, gen_salt('bf', 12)),
      must_change_pw = false
  where id = p_user_id;

  return jsonb_build_object('ok', true);
end;
$$;

-- ─── CREATE EMPLOYEE (Admin only — enforced in Edge Function) ─────────────────

create or replace function public.create_employee(
  p_username     text,
  p_password_hash text,
  p_full_name    text,
  p_role         text,
  p_phone        text,
  p_created_by   uuid
)
returns table (
  id             uuid,
  username       text,
  full_name      text,
  role           text,
  must_change_pw boolean
)
language plpgsql
security definer
set search_path = golden_hive, public, pg_temp
as $$
begin
  return query
  insert into golden_hive.users (username, password_hash, full_name, role, phone, must_change_pw, created_by)
  values (
    lower(btrim(p_username)),
    p_password_hash,
    btrim(p_full_name),
    p_role::golden_hive.user_role,
    p_phone,
    true,
    p_created_by
  )
  returning users.id, users.username, users.full_name, users.role::text, users.must_change_pw;
end;
$$;

-- ─── LIST EMPLOYEES ───────────────────────────────────────────────────────────

create or replace function public.list_employees()
returns table (
  id           uuid,
  username     text,
  full_name    text,
  role         text,
  phone        text,
  is_active    boolean,
  last_login_at timestamptz,
  created_at   timestamptz
)
language sql
security definer
set search_path = golden_hive, public, pg_temp
as $$
  select u.id, u.username, u.full_name, u.role::text, u.phone,
         u.is_active, u.last_login_at, u.created_at
  from golden_hive.users u
  order by u.created_at desc;
$$;

-- ─── DEACTIVATE EMPLOYEE ──────────────────────────────────────────────────────

create or replace function public.deactivate_employee(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = golden_hive, public, pg_temp
as $$
begin
  update golden_hive.users set is_active = false where id = p_user_id;
  if not found then
    raise exception 'User not found';
  end if;
end;
$$;

-- ─── INSERT AUDIT LOG ─────────────────────────────────────────────────────────

create or replace function public.insert_audit_log(
  p_actor_id   uuid,
  p_actor_role text,
  p_action     text,
  p_entity     text,
  p_entity_id  uuid,
  p_metadata   jsonb,
  p_ip_address text
)
returns void
language plpgsql
security definer
set search_path = golden_hive, public, pg_temp
as $$
begin
  insert into golden_hive.audit_log(actor_id, actor_role, action, entity, entity_id, metadata, ip_address)
  values(p_actor_id, p_actor_role, p_action, p_entity, p_entity_id, p_metadata, p_ip_address);
end;
$$;

-- ─── SUBMIT ORDER (public — called by anonymous customers) ───────────────────

create or replace function public.submit_order(
  p_customer_name    text,
  p_customer_phone   text,
  p_customer_email   text,
  p_customer_company text,
  p_service_name     text,
  p_service_id       uuid,
  p_specs            jsonb,
  p_design_needed    boolean,
  p_source           text
)
returns table (
  order_id        uuid,
  tracking_number text
)
language plpgsql
security definer
set search_path = golden_hive, public, pg_temp
as $$
declare
  v_order_id        uuid;
  v_tracking_number text;
  v_customer_snapshot jsonb;
begin
  v_customer_snapshot := jsonb_build_object(
    'name',    btrim(p_customer_name),
    'phone',   btrim(p_customer_phone),
    'email',   coalesce(btrim(p_customer_email), ''),
    'company', coalesce(btrim(p_customer_company), '')
  );

  insert into golden_hive.orders (
    customer_snapshot,
    service_id,
    service_name,
    specs,
    design_needed,
    source,
    status,
    payment_status,
    tracking_number
  ) values (
    v_customer_snapshot,
    p_service_id,
    btrim(p_service_name),
    p_specs,
    p_design_needed,
    p_source::golden_hive.order_source,
    'NEW',
    'UNPAID',
    ''  -- trigger fills this
  )
  returning id, orders.tracking_number into v_order_id, v_tracking_number;

  -- Audit
  insert into golden_hive.audit_log(action, entity, entity_id, metadata)
  values('ORDER_SUBMITTED', 'orders', v_order_id,
         jsonb_build_object('source', p_source, 'service', p_service_name));

  return query select v_order_id, v_tracking_number;
end;
$$;

-- ─── TRACK ORDER BY UUID ─────────────────────────────────────────────────────
-- Public; returns only safe, sanitised fields — NO internal_notes, NO financials

create or replace function public.track_order(p_order_id uuid)
returns table (
  tracking_number text,
  service_name    text,
  status          text,
  public_notes    text,
  created_at      timestamptz,
  updated_at      timestamptz
)
language sql
security definer
set search_path = golden_hive, public, pg_temp
as $$
  select o.tracking_number, o.service_name, o.status::text,
         o.public_notes, o.created_at, o.updated_at
  from golden_hive.orders o
  where o.id = p_order_id
  limit 1;
$$;

-- ─── ADMIN: LIST ORDERS ───────────────────────────────────────────────────────

create or replace function public.list_orders(
  p_status      text default null,
  p_assigned_to uuid default null
)
returns table (
  id              uuid,
  tracking_number text,
  status          text,
  payment_status  text,
  service_name    text,
  customer        jsonb,
  assigned_to     uuid,
  priority        int,
  deadline_at     timestamptz,
  quoted_amount   numeric,
  created_at      timestamptz,
  updated_at      timestamptz
)
language sql
security definer
set search_path = golden_hive, public, pg_temp
as $$
  select o.id, o.tracking_number, o.status::text, o.payment_status::text,
         o.service_name, o.customer_snapshot as customer,
         o.assigned_to, o.priority, o.deadline_at,
         o.quoted_amount, o.created_at, o.updated_at
  from golden_hive.orders o
  where (p_status is null or o.status::text = p_status)
    and (p_assigned_to is null or o.assigned_to = p_assigned_to)
  order by o.priority desc, o.created_at asc;
$$;

-- ─── ADMIN: GET SINGLE ORDER ──────────────────────────────────────────────────

create or replace function public.get_order(p_order_id uuid)
returns table (
  id              uuid,
  tracking_number text,
  status          text,
  payment_status  text,
  source          text,
  service_name    text,
  specs           jsonb,
  design_needed   boolean,
  customer        jsonb,
  assigned_to     uuid,
  priority        int,
  deadline_at     timestamptz,
  quoted_amount   numeric,
  final_amount    numeric,
  deposit_paid    numeric,
  internal_notes  text,
  public_notes    text,
  tags            text[],
  created_at      timestamptz,
  updated_at      timestamptz
)
language sql
security definer
set search_path = golden_hive, public, pg_temp
as $$
  select o.id, o.tracking_number, o.status::text, o.payment_status::text, o.source::text,
         o.service_name, o.specs, o.design_needed, o.customer_snapshot as customer,
         o.assigned_to, o.priority, o.deadline_at,
         o.quoted_amount, o.final_amount, o.deposit_paid,
         o.internal_notes, o.public_notes, o.tags,
         o.created_at, o.updated_at
  from golden_hive.orders o
  where o.id = p_order_id
  limit 1;
$$;

-- ─── ADMIN: UPDATE ORDER STATUS ───────────────────────────────────────────────

create or replace function public.update_order_status(
  p_order_id      uuid,
  p_status        text,
  p_actor_id      uuid,
  p_note          text default null,
  p_public_notes  text default null,
  p_assigned_to   uuid default null,
  p_quoted_amount numeric default null,
  p_priority      int default null
)
returns table (
  id     uuid,
  status text
)
language plpgsql
security definer
set search_path = golden_hive, public, pg_temp
as $$
begin
  update golden_hive.orders o
  set
    status         = p_status::golden_hive.order_status,
    public_notes   = coalesce(p_public_notes, o.public_notes),
    assigned_to    = coalesce(p_assigned_to, o.assigned_to),
    quoted_amount  = coalesce(p_quoted_amount, o.quoted_amount),
    priority       = coalesce(p_priority, o.priority),
    version        = o.version + 1
  where o.id = p_order_id;

  if not found then
    raise exception 'Order not found';
  end if;

  -- Log the status history change (trigger does this, but add note here too)
  update golden_hive.order_status_history
  set note = p_note
  where order_id = p_order_id
    and new_status = p_status::golden_hive.order_status
    and created_at > now() - interval '5 seconds';

  insert into golden_hive.audit_log(actor_id, actor_role, action, entity, entity_id, metadata)
  select p_actor_id, u.role::text, 'ORDER_STATUS_CHANGED', 'orders', p_order_id,
         jsonb_build_object('new_status', p_status)
  from golden_hive.users u where u.id = p_actor_id;

  return query select p_order_id, p_status;
end;
$$;
