-- Add missing columns (safe if some already exist)
alter table public.profiles
  add column if not exists email text;

alter table public.profiles
  add column if not exists plan text;

alter table public.profiles
  add column if not exists stripe_customer_id text;

alter table public.profiles
  add column if not exists stripe_subscription_id text;

alter table public.profiles
  add column if not exists stripe_subscription_status text;

alter table public.profiles
  add column if not exists updated_at timestamptz;

-- Defaults / constraints
update public.profiles set plan = 'free' where plan is null;
alter table public.profiles alter column plan set default 'free';
alter table public.profiles alter column plan set not null;

update public.profiles set updated_at = now() where updated_at is null;
alter table public.profiles alter column updated_at set default now();
alter table public.profiles alter column updated_at set not null;

create unique index if not exists profiles_stripe_customer_id_key
  on public.profiles (stripe_customer_id);

create index if not exists profiles_stripe_customer_id_idx
  on public.profiles (stripe_customer_id);

alter table public.profiles enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles for select using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

insert into public.profiles (id, email)
select id, email from auth.users
on conflict (id) do nothing;