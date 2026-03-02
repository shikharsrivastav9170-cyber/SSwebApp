-- Supabase SQL schema for SSWebStudio CRM

-- users table stores employees and admins
create table users (
  id uuid primary key default uuid_generate_v4(),
  email text not null unique,
  name text,
  role text not null check (role in ('super_admin','admin','employee')),
  phone text,
  created_at timestamptz default now()
);

-- leads generated from WhatsApp or manual entry
create table leads (
  id uuid primary key default uuid_generate_v4(),
  name text,
  phone text not null,
  message text,
  source text,
  assigned_to uuid references users(id),
  status text check (status in ('new','connected','follow_up','not_interested','sale_closed')) default 'new',
  created_at timestamptz default now()
);

-- plans catalog
create table plans (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  price numeric not null
);

-- sales record when lead converted
create table sales (
  id uuid primary key default uuid_generate_v4(),
  lead_id uuid references leads(id) on delete set null,
  employee_id uuid references users(id),
  plan_id uuid references plans(id),
  amount numeric,
  payment_mode text,
  payment_receipt text,
  created_at timestamptz default now()
);

-- monthly targets
create table targets (
  id uuid primary key default uuid_generate_v4(),
  employee_id uuid references users(id),
  month date not null,
  amount numeric not null,
  created_at timestamptz default now()
);

-- incentive rules (simple table for future extension)
create table incentives (
  id uuid primary key default uuid_generate_v4(),
  rule_name text,
  percent numeric,
  threshold numeric,
  created_at timestamptz default now()
);

-- example activity log
create table activity_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id),
  action text,
  details jsonb,
  created_at timestamptz default now()
);

-- policies (basic example permitting authenticated users to select their own rows)

-- enable row level security
alter table users enable row level security;
alter table leads enable row level security;

-- employees can only view leads assigned to them
create policy "Employee can view assigned leads"
  on leads for select
  using (assigned_to = auth.uid());

alter table sales enable row level security;
alter table targets enable row level security;

-- policy: users can read their own record
create policy "users_self_select" on users
  for select using (auth.uid() = id);

-- policy: admins can see all users
create policy "users_admin" on users
  for select using (exists (select 1 from users u where u.id = auth.uid() and u.role in ('super_admin','admin')));

-- more policies to be added as needed...
