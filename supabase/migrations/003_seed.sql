-- ═══════════════════════════════════════════════════════════════════════════════
-- Golden Hive Prints - Migration 003: Seed Data
-- ═══════════════════════════════════════════════════════════════════════════════

-- ─── Service Catalog ──────────────────────────────────────────────────────────
insert into golden_hive.service_catalog (name, category, description, base_price, sort_order)
values
  -- Stationery
  ('Flyers',                'Stationery', 'High-quality single/double-sided flyers',        2.50,   1),
  ('Business Cards',        'Stationery', 'Premium matte/gloss business cards',             0.50,   2),
  ('Calendars',             'Stationery', 'Branded wall and desk calendars',               15.00,   3),
  ('Corporate Diaries',     'Stationery', 'Custom hardcover diaries with branding',        15.00,   4),
  ('Receipt Books',         'Stationery', 'Custom carbonless receipt/invoice books',        8.00,   5),
  ('Newsprints/Pamphlets',  'Stationery', 'Bulk newspaper-style pamphlets',                 1.50,   6),

  -- Clothing
  ('Branded Polo T-Shirts', 'Clothing',   'Sublimation or vinyl custom branded shirts',    8.00,  10),
  ('Branded Caps',          'Clothing',   'Classic trucker caps with logo embroidery',     2.00,  11),
  ('Branded Umbrellas',     'Clothing',   '3-panel / full-panel branded umbrellas',        8.00,  12),
  ('Jackets & Uniforms',    'Clothing',   'Corporate embroidered jackets and uniforms',   25.00,  13),

  -- Merchandise
  ('Branded Mugs',          'Merchandise','Sublimation printed ceramic mugs',              4.00,  20),
  ('Branded Plates',        'Merchandise','Custom printed plates for awards/gifts',        6.00,  21),
  ('Stickers & Tags',       'Merchandise','Die-cut vinyl stickers and product tags',       1.00,  22),
  ('Branded Paper Bags',    'Merchandise','Printed paper bags for retail/gifting',         5.00,  23),
  ('Banners',               'Merchandise','X-frame, roll-up, and outdoor banners',        20.00,  24),

  -- Design Services
  ('Graphic Design Package','Design',     'Custom logo, brand identity & layout design',  50.00,  30),
  ('Custom Quote',          'Other',      'Tailored pricing for bespoke production runs',  null,  99);

-- ─── Bootstrap Super Admin ────────────────────────────────────────────────────
-- IMPORTANT: Change this password immediately after first run.
-- Password below is: GoldenHive@Admin2026  (bcrypt cost 12)
insert into golden_hive.users (username, password_hash, full_name, role, must_change_pw)
values (
  'golden_admin',
  crypt('GoldenHive@Admin2026', gen_salt('bf', 12)),
  'Golden Hive Super Admin',
  'super_admin',
  true   -- Force password change on first login
);
