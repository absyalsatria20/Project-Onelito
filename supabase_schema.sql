-- Supabase Database Schema for Project-Onelito 2

create table if not exists periods (
  id text primary key,
  name text not null,
  owner text not null default 'All Owners',
  certificate text not null default 'All Status',
  query text not null default '',
  sort text not null default 'name',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists fish_records (
  id text primary key,
  period_id text not null references periods(id) on delete cascade,
  name text not null,
  owner text not null,
  price_jpy numeric default 0,
  rate numeric default 0,
  price_idr numeric default 0,
  dealer_fee_pct numeric default 0,
  dealer_fee_idr numeric default 0,
  shipping_cost numeric default 0,
  total numeric default 0,
  certificate boolean default false,
  terms text default '',
  image text default '',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists profiles (
  id text primary key,
  username text not null default 'adelia',
  title text not null default 'Workspace Administrator',
  avatar text default '',
  password_hash text not null default 'adelia',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table periods enable row level security;
alter table fish_records enable row level security;
alter table profiles enable row level security;

-- Policies for public access (idempotent drop & create)
drop policy if exists "Allow public read periods" on periods;
create policy "Allow public read periods" on periods for select using (true);

drop policy if exists "Allow public insert periods" on periods;
create policy "Allow public insert periods" on periods for insert with check (true);

drop policy if exists "Allow public update periods" on periods;
create policy "Allow public update periods" on periods for update using (true);

drop policy if exists "Allow public delete periods" on periods;
create policy "Allow public delete periods" on periods for delete using (true);

drop policy if exists "Allow public read fish_records" on fish_records;
create policy "Allow public read fish_records" on fish_records for select using (true);

drop policy if exists "Allow public insert fish_records" on fish_records;
create policy "Allow public insert fish_records" on fish_records for insert with check (true);

drop policy if exists "Allow public update fish_records" on fish_records;
create policy "Allow public update fish_records" on fish_records for update using (true);

drop policy if exists "Allow public delete fish_records" on fish_records;
create policy "Allow public delete fish_records" on fish_records for delete using (true);

drop policy if exists "Allow public read profiles" on profiles;
create policy "Allow public read profiles" on profiles for select using (true);

drop policy if exists "Allow public insert profiles" on profiles;
create policy "Allow public insert profiles" on profiles for insert with check (true);

drop policy if exists "Allow public update profiles" on profiles;
create policy "Allow public update profiles" on profiles for update using (true);

drop policy if exists "Allow public delete profiles" on profiles;
create policy "Allow public delete profiles" on profiles for delete using (true);
