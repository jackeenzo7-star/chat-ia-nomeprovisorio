create table bots (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  name text not null,
  personality text default '',
  gender text default '',
  backstory text default '',
  speaking_style text default '',
  meeting_context text default '',
  relationship text default '',
  avatar_url text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table bots enable row level security;

create policy "users can manage own bots"
  on bots for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
