-- Roles enum + table
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "user_roles readable by self" on public.user_roles
for select to authenticated using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));

-- Auto-assign admin to sharvi's email, otherwise 'user'
create or replace function public.handle_new_user_role()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  if NEW.email = 'sharvibhavsar12@gmail.com' then
    insert into public.user_roles (user_id, role) values (NEW.id, 'admin')
      on conflict (user_id, role) do nothing;
  else
    insert into public.user_roles (user_id, role) values (NEW.id, 'user')
      on conflict (user_id, role) do nothing;
  end if;
  return NEW;
end;
$$;

create trigger on_auth_user_created_role
after insert on auth.users
for each row execute function public.handle_new_user_role();

-- Artworks table
create table public.artworks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  short_description text not null,
  full_description text not null default '',
  section text not null, -- 'traditional' | 'artwork' | 'crafts' | 'architectural' | 'rangoli' | 'best-out-of-waste'
  category text, -- subcategory like 'Pichhwai Paintings'
  image_url text not null,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.artworks enable row level security;

create policy "artworks public read" on public.artworks
for select using (true);

create policy "artworks admin insert" on public.artworks
for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));

create policy "artworks admin update" on public.artworks
for update to authenticated using (public.has_role(auth.uid(), 'admin'));

create policy "artworks admin delete" on public.artworks
for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

create or replace function public.update_updated_at_column()
returns trigger language plpgsql set search_path = public
as $$ begin NEW.updated_at = now(); return NEW; end; $$;

create trigger artworks_updated_at
before update on public.artworks
for each row execute function public.update_updated_at_column();

create index idx_artworks_section on public.artworks(section);
create index idx_artworks_category on public.artworks(category);

-- Storage bucket
insert into storage.buckets (id, name, public) values ('artworks', 'artworks', true);

create policy "artworks public read storage" on storage.objects
for select using (bucket_id = 'artworks');

create policy "artworks admin upload" on storage.objects
for insert to authenticated with check (bucket_id = 'artworks' and public.has_role(auth.uid(), 'admin'));

create policy "artworks admin update storage" on storage.objects
for update to authenticated using (bucket_id = 'artworks' and public.has_role(auth.uid(), 'admin'));

create policy "artworks admin delete storage" on storage.objects
for delete to authenticated using (bucket_id = 'artworks' and public.has_role(auth.uid(), 'admin'));