-- ═══════════════════════════════════════════════════════════════════════════════
-- Golden Hive Prints - Migration 001: Core Schema
-- ═══════════════════════════════════════════════════════════════════════════════
-- Architecture: Private schema (golden_hive) is never exposed directly.
-- All access is via SECURITY DEFINER public RPCs called by Edge Functions.
-- Supabase Auth is NOT used for staff. Custom user table with bcrypt hashes.
-- ═══════════════════════════════════════════════════════════════════════════════

-- ─── Private Schema ───────────────────────────────────────────────────────────
create schema if not exists golden_hive;

-- Lock down private schema completely
revoke usage on schema golden_hive from anon, authenticated;
revoke all on all tables in schema golden_hive from anon, authenticated;

-- ─── Extensions ───────────────────────────────────────────────────────────────
create extension if not exists "pgcrypto";   -- gen_random_uuid(), crypt(), gen_salt()
create extension if not exists "pg_stat_statements";

-- ─── ENUMS ────────────────────────────────────────────────────────────────────
create type golden_hive.user_role as enum (
  'super_admin',  -- Owner-level access to everything
  'admin',        -- Manage orders, staff, quotes
  'staff'         -- Execute production jobs, update status
);

create type golden_hive.order_status as enum (
  'NEW',
  'QUOTING',
  'AWAITING_PAYMENT',
  'IN_PRODUCTION',
  'READY',
  'DELIVERED',
  'CANCELLED'
);

create type golden_hive.payment_status as enum (
  'UNPAID',
  'PARTIAL',
  'PAID',
  'REFUNDED'
);

create type golden_hive.file_kind as enum (
  'ARTWORK',
  'PROOF',
  'PAYMENT_PROOF',
  'OTHER'
);

create type golden_hive.order_source as enum (
  'web',
  'whatsapp',
  'walkin',
  'admin'
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- USERS (Staff) - Bypasses Supabase Auth entirely
-- ═══════════════════════════════════════════════════════════════════════════════
create table golden_hive.users (
  id              uuid primary key default gen_random_uuid(),
  username        text not null unique,
  password_hash   text not null,                           -- bcrypt via pgcrypto
  full_name       text,
  phone           text,
  role            golden_hive.user_role not null default 'staff',
  is_active       boolean not null default true,
  must_change_pw  boolean not null default true,           -- forced on first login
  recovery_email  text,
  last_login_at   timestamptz,
  created_by      uuid references golden_hive.users(id) on delete set null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- SERVICE CATALOG — drives the order builder UI
-- ═══════════════════════════════════════════════════════════════════════════════
create table golden_hive.service_catalog (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  category    text not null,            -- Stationery, Clothing, Merchandise
  description text,
  base_price  numeric(10,2),
  is_active   boolean not null default true,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- CUSTOMERS — reusable profiles; snapshot is always stored on order too
-- ═══════════════════════════════════════════════════════════════════════════════
create table golden_hive.customers (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  phone       text,
  email       text,
  company     text,
  notes       text,
  order_count int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- ORDERS — central business object
-- ═══════════════════════════════════════════════════════════════════════════════
create table golden_hive.orders (
  id                uuid primary key default gen_random_uuid(),
  tracking_number   text unique not null,         -- Human-readable GH-XXXXXX
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),

  -- Status lifecycle
  status            golden_hive.order_status not null default 'NEW',
  payment_status    golden_hive.payment_status not null default 'UNPAID',
  source            golden_hive.order_source not null default 'web',

  -- Customer snapshot (immutable at time of order)
  customer_id       uuid references golden_hive.customers(id) on delete set null,
  customer_snapshot jsonb not null,               -- {name, phone, email, company}

  -- Service & job details
  service_id        uuid references golden_hive.service_catalog(id) on delete set null,
  service_name      text not null,                -- denormalized for display
  specs             jsonb not null default '{}',  -- size, qty, paper, etc.
  design_needed     boolean not null default false,

  -- Staff management
  assigned_to       uuid references golden_hive.users(id) on delete set null,
  priority          int not null default 0,       -- 0=normal, 1=urgent, 2=rush
  deadline_at       timestamptz,

  -- Financials
  quoted_amount     numeric(10,2),
  final_amount      numeric(10,2),
  deposit_paid      numeric(10,2) default 0,

  -- Notes
  internal_notes    text,                         -- Staff-only, never shown to customer
  public_notes      text,                         -- Can be shown to customer

  -- Tags & metadata
  tags              text[] default '{}',
  version           int not null default 1        -- Optimistic concurrency
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- ORDER FILES — artwork, proofs, payment receipts
-- ═══════════════════════════════════════════════════════════════════════════════
create table golden_hive.order_files (
  id              uuid primary key default gen_random_uuid(),
  order_id        uuid not null references golden_hive.orders(id) on delete cascade,
  kind            golden_hive.file_kind not null default 'ARTWORK',
  storage_path    text not null,
  original_name   text not null,
  mime_type       text,
  size_bytes      bigint,
  checksum_sha256 text,
  uploaded_by     text not null default 'public',  -- user id or 'public'
  created_at      timestamptz not null default now()
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- ORDER STATUS HISTORY — who changed what and when
-- ═══════════════════════════════════════════════════════════════════════════════
create table golden_hive.order_status_history (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references golden_hive.orders(id) on delete cascade,
  changed_by  uuid references golden_hive.users(id) on delete set null,  -- null = system/public
  old_status  golden_hive.order_status,
  new_status  golden_hive.order_status not null,
  note        text,
  created_at  timestamptz not null default now()
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- AUDIT LOG — security-sensitive actions only
-- ═══════════════════════════════════════════════════════════════════════════════
create table golden_hive.audit_log (
  id          uuid primary key default gen_random_uuid(),
  actor_id    uuid,                   -- null = anonymous public action
  actor_role  text,
  action      text not null,          -- ORDER_SUBMITTED, STATUS_CHANGED, USER_CREATED, etc.
  entity      text,                   -- 'orders', 'users', 'files'
  entity_id   uuid,
  metadata    jsonb default '{}',
  ip_address  text,
  created_at  timestamptz not null default now()
);

-- ─── Indexes ──────────────────────────────────────────────────────────────────
create index idx_orders_status          on golden_hive.orders(status);
create index idx_orders_tracking        on golden_hive.orders(tracking_number);
create index idx_orders_assigned        on golden_hive.orders(assigned_to);
create index idx_orders_created         on golden_hive.orders(created_at desc);
create index idx_order_files_order_id   on golden_hive.order_files(order_id);
create index idx_status_history_order   on golden_hive.order_status_history(order_id);
create index idx_audit_log_entity       on golden_hive.audit_log(entity, entity_id);

-- ─── Auto-update updated_at ───────────────────────────────────────────────────
create or replace function golden_hive.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_orders_updated_at
  before update on golden_hive.orders
  for each row execute function golden_hive.set_updated_at();

create trigger trg_users_updated_at
  before update on golden_hive.users
  for each row execute function golden_hive.set_updated_at();

create trigger trg_customers_updated_at
  before update on golden_hive.customers
  for each row execute function golden_hive.set_updated_at();

-- ─── Auto-generate tracking number ────────────────────────────────────────────
create sequence if not exists golden_hive.order_seq start 1000 increment 1;

create or replace function golden_hive.generate_tracking_number()
returns trigger language plpgsql as $$
begin
  new.tracking_number = 'GH-' || lpad(nextval('golden_hive.order_seq')::text, 6, '0');
  return new;
end;
$$;

create trigger trg_orders_tracking_number
  before insert on golden_hive.orders
  for each row when (new.tracking_number is null or new.tracking_number = '')
  execute function golden_hive.generate_tracking_number();

-- ─── Log order status changes automatically ───────────────────────────────────
create or replace function golden_hive.log_order_status_change()
returns trigger language plpgsql as $$
begin
  if old.status is distinct from new.status then
    insert into golden_hive.order_status_history(order_id, old_status, new_status)
    values (new.id, old.status, new.status);
  end if;
  return new;
end;
$$;

create trigger trg_orders_status_history
  after update on golden_hive.orders
  for each row execute function golden_hive.log_order_status_change();
