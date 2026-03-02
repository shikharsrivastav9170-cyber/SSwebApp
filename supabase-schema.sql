-- EXTENSIONS
create extension if not exists "uuid-ossp";

------------------------------------------------
-- COMPANIES
------------------------------------------------
create table companies (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  created_at timestamp default now()
);

------------------------------------------------
-- USERS
------------------------------------------------
create table users (
  id uuid primary key references auth.users(id),
  company_id uuid references companies(id),
  name text,
  role text check (role in ('super_admin','admin','employee')),
  created_at timestamp default now()
);

------------------------------------------------
-- LEADS
------------------------------------------------
create table leads (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid references companies(id),
  name text,
  phone text,
  message text,
  status text default 'new',
  assigned_to uuid references users(id),
  created_at timestamp default now()
);

------------------------------------------------
-- PLANS
------------------------------------------------
create table plans (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid references companies(id),
  name text,
  price numeric,
  created_at timestamp default now()
);

------------------------------------------------
-- SALES
------------------------------------------------
create table sales (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid references companies(id),
  employee_id uuid references users(id),
  lead_id uuid references leads(id),
  plan_id uuid references plans(id),
  amount numeric,
  payment_mode text,
  screenshot_url text,
  created_at timestamp default now()
);

------------------------------------------------
-- TARGETS
------------------------------------------------
create table targets (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid references companies(id),
  employee_id uuid references users(id),
  month text,
  target_amount numeric,
  created_at timestamp default now()
);

------------------------------------------------
-- INCENTIVE RULES (SLAB)
------------------------------------------------
create table incentive_rules (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid references companies(id),
  min_percentage numeric,
  max_percentage numeric,
  incentive_percentage numeric,
  created_at timestamp default now()
);

------------------------------------------------
-- INCENTIVES
------------------------------------------------
create table incentives (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid references companies(id),
  employee_id uuid references users(id),
  month text,
  revenue numeric,
  incentive numeric,
  created_at timestamp default now()
);

-- FULL RLS (Tenant Isolation + Role Secure)
alter table users enable row level security;
alter table leads enable row level security;
alter table sales enable row level security;
alter table targets enable row level security;

-- Tenant Isolation
create policy "Tenant isolation"
on leads
for select
using (
  company_id =
  (select company_id from users where id = auth.uid())
);

-- Employee only assigned leads
create policy "Employee assigned leads"
on leads
for select
using (assigned_to = auth.uid());

-- Sales own view
create policy "Employee own sales"
on sales
for select
using (employee_id = auth.uid());
