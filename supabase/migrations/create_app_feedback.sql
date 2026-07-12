-- Create app_feedback table for post-application user feedback
create table if not exists public.app_feedback (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete set null,
  rating integer not null check (rating between 1 and 5),
  helpful_features text[] default '{}',
  note text default '',
  job_title text default '',
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table public.app_feedback enable row level security;

-- Allow authenticated users to insert their own feedback
create policy "Users can insert own feedback"
  on public.app_feedback for insert
  with check (auth.uid() = user_id or user_id is null);

-- Allow authenticated users to view their own feedback
create policy "Users can view own feedback"
  on public.app_feedback for select
  using (auth.uid() = user_id);
