-- TAKWEEN Phase 3: employee, project, task, and internal collaboration schema.
-- This file is a migration only. Review it before applying it to any database.

create type public.employee_role as enum (
  'super_admin',
  'admin',
  'manager',
  'employee'
);

create type public.project_status as enum (
  'planned',
  'active',
  'on_hold',
  'completed',
  'archived'
);

create type public.task_status as enum (
  'not_started',
  'in_progress',
  'blocked',
  'completed',
  'cancelled'
);

create type public.announcement_status as enum (
  'draft',
  'published',
  'archived'
);

create type public.meeting_request_status as enum (
  'pending',
  'approved',
  'declined',
  'cancelled'
);

create type public.suggestion_status as enum (
  'submitted',
  'under_review',
  'accepted',
  'declined',
  'implemented'
);

create table public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text unique,
  display_name text not null check (char_length(display_name) between 1 and 120),
  phone text check (phone is null or char_length(phone) <= 40),
  avatar_url text check (avatar_url is null or char_length(avatar_url) <= 2048),
  job_title text check (job_title is null or char_length(job_title) <= 120),
  department_id uuid,
  manager_id uuid references public.profiles (user_id) on delete set null,
  role public.employee_role not null default 'employee',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_not_own_manager check (manager_id is distinct from user_id)
);

comment on column public.profiles.role is
  'Canonical employee authorization role. Read by RLS and server-side authorization; never sourced from user-editable auth metadata.';

create table public.departments (
  id uuid primary key default gen_random_uuid(),
  name_en text not null check (char_length(name_en) between 1 and 120),
  name_ar text not null check (char_length(name_ar) between 1 and 120),
  code text not null unique check (code ~ '^[A-Z0-9_-]{2,24}$'),
  description_en text check (description_en is null or char_length(description_en) <= 2000),
  description_ar text check (description_ar is null or char_length(description_ar) <= 2000),
  manager_id uuid references public.profiles (user_id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles
  add constraint profiles_department_id_fkey
  foreign key (department_id) references public.departments (id) on delete set null;

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  department_id uuid references public.departments (id) on delete restrict,
  created_by uuid references public.profiles (user_id) on delete set null,
  name_en text not null check (char_length(name_en) between 1 and 180),
  name_ar text not null check (char_length(name_ar) between 1 and 180),
  description_en text check (description_en is null or char_length(description_en) <= 10000),
  description_ar text check (description_ar is null or char_length(description_ar) <= 10000),
  status public.project_status not null default 'planned',
  starts_at timestamptz,
  due_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint projects_due_after_start check (
    starts_at is null or due_at is null or due_at >= starts_at
  )
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects (id) on delete set null,
  department_id uuid references public.departments (id) on delete restrict,
  assigned_to uuid references public.profiles (user_id) on delete set null,
  assigned_by uuid references public.profiles (user_id) on delete set null,
  title_en text not null check (char_length(title_en) between 1 and 180),
  title_ar text not null check (char_length(title_ar) between 1 and 180),
  description_en text check (description_en is null or char_length(description_en) <= 10000),
  description_ar text check (description_ar is null or char_length(description_ar) <= 10000),
  status public.task_status not null default 'not_started',
  priority smallint not null default 2 check (priority between 1 and 4),
  due_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  department_id uuid references public.departments (id) on delete restrict,
  created_by uuid references public.profiles (user_id) on delete set null,
  title_en text not null check (char_length(title_en) between 1 and 180),
  title_ar text not null check (char_length(title_ar) between 1 and 180),
  body_en text not null check (char_length(body_en) between 1 and 20000),
  body_ar text not null check (char_length(body_ar) between 1 and 20000),
  status public.announcement_status not null default 'draft',
  publish_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint announcements_expiry_after_publish check (
    publish_at is null or expires_at is null or expires_at > publish_at
  )
);

create table public.meetings (
  id uuid primary key default gen_random_uuid(),
  department_id uuid references public.departments (id) on delete restrict,
  organizer_id uuid references public.profiles (user_id) on delete set null,
  title_en text not null check (char_length(title_en) between 1 and 180),
  title_ar text not null check (char_length(title_ar) between 1 and 180),
  description_en text check (description_en is null or char_length(description_en) <= 10000),
  description_ar text check (description_ar is null or char_length(description_ar) <= 10000),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  location text check (location is null or char_length(location) <= 500),
  meeting_url text check (meeting_url is null or char_length(meeting_url) <= 2048),
  is_company_wide boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint meetings_end_after_start check (ends_at > starts_at),
  constraint company_wide_meeting_department check (
    not is_company_wide or department_id is null
  )
);

create table public.meeting_requests (
  id uuid primary key default gen_random_uuid(),
  requested_by uuid not null references public.profiles (user_id) on delete cascade,
  department_id uuid references public.departments (id) on delete restrict,
  reviewed_by uuid references public.profiles (user_id) on delete set null,
  title_en text not null check (char_length(title_en) between 1 and 180),
  title_ar text not null check (char_length(title_ar) between 1 and 180),
  details_en text check (details_en is null or char_length(details_en) <= 10000),
  details_ar text check (details_ar is null or char_length(details_ar) <= 10000),
  requested_starts_at timestamptz not null,
  requested_ends_at timestamptz not null,
  status public.meeting_request_status not null default 'pending',
  review_note text check (review_note is null or char_length(review_note) <= 4000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint meeting_requests_end_after_start check (
    requested_ends_at > requested_starts_at
  )
);

create table public.suggestions (
  id uuid primary key default gen_random_uuid(),
  submitted_by uuid not null references public.profiles (user_id) on delete cascade,
  department_id uuid references public.departments (id) on delete restrict,
  reviewed_by uuid references public.profiles (user_id) on delete set null,
  title text not null check (char_length(title) between 1 and 180),
  body text not null check (char_length(body) between 1 and 12000),
  status public.suggestion_status not null default 'submitted',
  review_note text check (review_note is null or char_length(review_note) <= 4000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references public.profiles (user_id) on delete cascade,
  kind text not null check (kind ~ '^[a-z][a-z0-9_.-]{0,79}$'),
  title_en text not null check (char_length(title_en) between 1 and 180),
  title_ar text not null check (char_length(title_ar) between 1 and 180),
  body_en text check (body_en is null or char_length(body_en) <= 4000),
  body_ar text check (body_ar is null or char_length(body_ar) <= 4000),
  resource_id uuid,
  read_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_department_active_idx
  on public.profiles (department_id, is_active);
create index profiles_manager_active_idx
  on public.profiles (manager_id, is_active);
create index departments_manager_idx
  on public.departments (manager_id);
create index projects_department_status_idx
  on public.projects (department_id, status);
create index projects_created_by_idx
  on public.projects (created_by);
create index tasks_assigned_to_status_due_idx
  on public.tasks (assigned_to, status, due_at);
create index tasks_department_status_idx
  on public.tasks (department_id, status);
create index tasks_project_idx
  on public.tasks (project_id);
create index tasks_assigned_by_idx
  on public.tasks (assigned_by);
create index announcements_department_status_publish_idx
  on public.announcements (department_id, status, publish_at);
create index meetings_department_start_idx
  on public.meetings (department_id, starts_at);
create index meetings_company_wide_start_idx
  on public.meetings (starts_at)
  where is_company_wide;
create index meeting_requests_requester_status_idx
  on public.meeting_requests (requested_by, status, created_at desc);
create index meeting_requests_department_status_idx
  on public.meeting_requests (department_id, status, created_at desc);
create index suggestions_submitter_status_idx
  on public.suggestions (submitted_by, status, created_at desc);
create index suggestions_department_status_idx
  on public.suggestions (department_id, status, created_at desc);
create index notifications_recipient_unread_idx
  on public.notifications (recipient_id, created_at desc)
  where read_at is null;

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create function public.current_employee_role()
returns public.employee_role
language sql
stable
security definer
set search_path = ''
as $$
  select p.role
  from public.profiles as p
  where p.user_id = (select auth.uid())
    and p.is_active
$$;

create function public.is_current_employee_in_department(p_department_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles as p
    where p.user_id = (select auth.uid())
      and p.is_active
      and p.department_id is not distinct from p_department_id
  )
$$;

create function public.can_manage_department(p_department_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select case public.current_employee_role()
    when 'super_admin' then true
    when 'admin' then true
    when 'manager' then p_department_id is not null
      and public.is_current_employee_in_department(p_department_id)
    else false
  end
$$;

create function public.is_active_employee_in_department(
  p_user_id uuid,
  p_department_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles as p
    where p.user_id = p_user_id
      and p.is_active
      and (p_department_id is null or p.department_id = p_department_id)
      and (
        p_user_id = (select auth.uid())
        or public.can_manage_department(p_department_id)
      )
  )
$$;

create function public.project_matches_department(
  p_project_id uuid,
  p_department_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.can_manage_department(p_department_id)
    and exists (
      select 1
      from public.projects as p
      where p.id = p_project_id
        and p.department_id is not distinct from p_department_id
    )
$$;

create function public.guard_profile_sensitive_fields()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if auth.uid() is not null and coalesce(auth.role(), '') <> 'service_role' then
    if new.role is distinct from old.role then
      raise exception 'Employee roles can only be changed by trusted server-side administration'
        using errcode = '42501';
    end if;

    if new.user_id = auth.uid()
      and (
        new.department_id is distinct from old.department_id
        or new.manager_id is distinct from old.manager_id
        or new.job_title is distinct from old.job_title
        or new.is_active is distinct from old.is_active
      )
    then
      raise exception 'Employees cannot change their own administrative profile fields'
        using errcode = '42501';
    end if;
  end if;

  return new;
end;
$$;

create function public.create_employee_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  profile_name text;
begin
  profile_name := nullif(
    pg_catalog.left(
      pg_catalog.btrim(coalesce(new.raw_user_meta_data ->> 'display_name', '')),
      120
    ),
    ''
  );

  insert into public.profiles (user_id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(profile_name, 'Employee')
  )
  on conflict (user_id) do update
  set email = excluded.email;

  return new;
end;
$$;

create function public.update_assigned_task_status(
  p_task_id uuid,
  p_status public.task_status
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  task_department_id uuid;
  task_assignee_id uuid;
begin
  if (select auth.uid()) is null
    or public.current_employee_role() is null
  then
    raise exception 'An active employee session is required'
      using errcode = '42501';
  end if;

  select t.department_id, t.assigned_to
  into task_department_id, task_assignee_id
  from public.tasks as t
  where t.id = p_task_id
  for update;

  if not found then
    raise exception 'Task not found'
      using errcode = 'P0002';
  end if;

  if not public.can_manage_department(task_department_id) then
    if task_assignee_id is distinct from (select auth.uid())
      or p_status not in (
        'in_progress'::public.task_status,
        'blocked'::public.task_status,
        'completed'::public.task_status
      )
    then
      raise exception 'You cannot change this task status'
        using errcode = '42501';
    end if;
  end if;

  update public.tasks
  set status = p_status,
      completed_at = case
        when p_status = 'completed'::public.task_status then now()
        else null
      end
  where id = p_task_id;
end;
$$;

create trigger profiles_guard_sensitive_fields
  before update on public.profiles
  for each row execute function public.guard_profile_sensitive_fields();

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger departments_set_updated_at
  before update on public.departments
  for each row execute function public.set_updated_at();

create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

create trigger tasks_set_updated_at
  before update on public.tasks
  for each row execute function public.set_updated_at();

create trigger announcements_set_updated_at
  before update on public.announcements
  for each row execute function public.set_updated_at();

create trigger meetings_set_updated_at
  before update on public.meetings
  for each row execute function public.set_updated_at();

create trigger meeting_requests_set_updated_at
  before update on public.meeting_requests
  for each row execute function public.set_updated_at();

create trigger suggestions_set_updated_at
  before update on public.suggestions
  for each row execute function public.set_updated_at();

create trigger notifications_set_updated_at
  before update on public.notifications
  for each row execute function public.set_updated_at();

create trigger on_auth_user_created_create_profile
  after insert on auth.users
  for each row execute function public.create_employee_profile();

create trigger auth_user_email_updated_sync_profile
  after update of email on auth.users
  for each row
  when (old.email is distinct from new.email)
  execute function public.create_employee_profile();

-- Backfill Auth accounts that existed before this migration. User-editable
-- metadata may supply a display name only; every new profile defaults to the
-- least-privileged employee role.
insert into public.profiles (user_id, email, display_name)
select
  u.id,
  u.email,
  coalesce(
    nullif(
      pg_catalog.left(
        pg_catalog.btrim(coalesce(u.raw_user_meta_data ->> 'display_name', '')),
        120
      ),
      ''
    ),
    'Employee'
  )
from auth.users as u
on conflict (user_id) do update
set email = excluded.email;

-- A normal authenticated user can never update a profile role. Role assignment
-- is deliberately reserved for trusted server-side Supabase administration.
-- To bootstrap the first super_admin, invite and verify the employee through
-- Supabase Auth, then use the Supabase Dashboard SQL Editor (privileged access,
-- never a browser/service-role key) to update exactly that verified user_id:
--
-- begin;
-- update public.profiles
-- set role = 'super_admin'
-- where user_id = '<verified-auth-user-uuid>'
--   and role = 'employee'
--   and not exists (
--     select 1 from public.profiles
--     where role = 'super_admin'::public.employee_role
--   );
--
-- Confirm exactly one row changed, then commit. Otherwise roll back.
-- commit;
alter table public.profiles enable row level security;
alter table public.departments enable row level security;
alter table public.projects enable row level security;
alter table public.tasks enable row level security;
alter table public.announcements enable row level security;
alter table public.meetings enable row level security;
alter table public.meeting_requests enable row level security;
alter table public.suggestions enable row level security;
alter table public.notifications enable row level security;

revoke all on table
  public.profiles,
  public.departments,
  public.projects,
  public.tasks,
  public.announcements,
  public.meetings,
  public.meeting_requests,
  public.suggestions,
  public.notifications
from public, anon, authenticated;

grant usage on schema public to authenticated;
grant usage on type
  public.employee_role,
  public.project_status,
  public.task_status,
  public.announcement_status,
  public.meeting_request_status,
  public.suggestion_status
to authenticated;

grant select, update (display_name, phone, avatar_url, job_title, department_id, manager_id, is_active)
  on public.profiles to authenticated;
grant select, insert, update
  on public.departments to authenticated;
grant select, insert
  on public.projects to authenticated;
 grant update(
  department_id,
  name_en,
  name_ar,
  description_en,
  description_ar,
  status,
  starts_at,
  due_at
)
  on public.projects to authenticated;
grant select, insert
  on public.tasks to authenticated;
grant update (
  project_id,
  department_id,
  assigned_to,
  title_en,
  title_ar,
  description_en,
  description_ar,
  status,
  priority,
  due_at,
  completed_at
)
  on public.tasks to authenticated;
grant select, insert, update
  on public.announcements to authenticated;
grant select, insert, update
  on public.meetings to authenticated;
grant select, insert
  on public.meeting_requests to authenticated;
grant select, insert
  on public.suggestions to authenticated;
grant update (status, reviewed_by, review_note)
  on public.meeting_requests to authenticated;
grant update (status, reviewed_by, review_note)
  on public.suggestions to authenticated;
grant select, update (read_at)
  on public.notifications to authenticated;

revoke all on function public.set_updated_at() from public, anon, authenticated;
revoke all on function public.current_employee_role() from public, anon;
revoke all on function public.is_active_employee_in_department(uuid, uuid) from public, anon;
revoke all on function public.is_current_employee_in_department(uuid) from public, anon;
revoke all on function public.can_manage_department(uuid) from public, anon;
revoke all on function public.project_matches_department(uuid, uuid) from public, anon;
revoke all on function public.guard_profile_sensitive_fields() from public, anon, authenticated;
revoke all on function public.create_employee_profile() from public, anon, authenticated;
revoke all on function public.update_assigned_task_status(uuid, public.task_status)
  from public, anon;

grant execute on function public.current_employee_role() to authenticated;
grant execute on function public.is_active_employee_in_department(uuid, uuid) to authenticated;
grant execute on function public.is_current_employee_in_department(uuid) to authenticated;
grant execute on function public.can_manage_department(uuid) to authenticated;
grant execute on function public.project_matches_department(uuid, uuid) to authenticated;
grant execute on function public.update_assigned_task_status(uuid, public.task_status)
  to authenticated;

create policy "Profiles are visible to self and authorized management"
  on public.profiles for select to authenticated
  using (
    user_id = (select auth.uid())
    or public.can_manage_department(department_id)
  );

create policy "Employees can update their basic profile"
  on public.profiles for update to authenticated
  using (
    user_id = (select auth.uid())
    and public.current_employee_role() is not null
  )
  with check (
    user_id = (select auth.uid())
    and public.current_employee_role() is not null
  );

create policy "Admins can update employee profile details"
  on public.profiles for update to authenticated
  using (
    public.current_employee_role() in (
      'super_admin'::public.employee_role,
      'admin'::public.employee_role
    )
  )
  with check (
    public.current_employee_role() in (
      'super_admin'::public.employee_role,
      'admin'::public.employee_role
    )
  );

create policy "Active employees can view departments"
  on public.departments for select to authenticated
  using (public.current_employee_role() is not null);

create policy "Admins can create departments"
  on public.departments for insert to authenticated
  with check (
    public.current_employee_role() in (
      'super_admin'::public.employee_role,
      'admin'::public.employee_role
    )
  );

create policy "Admins can update departments"
  on public.departments for update to authenticated
  using (
    public.current_employee_role() in (
      'super_admin'::public.employee_role,
      'admin'::public.employee_role
    )
  )
  with check (
    public.current_employee_role() in (
      'super_admin'::public.employee_role,
      'admin'::public.employee_role
    )
  );

create policy "Employees can view assigned or managed projects"
  on public.projects for select to authenticated
  using (
    public.current_employee_role() is not null
    and (
      public.can_manage_department(department_id)
      or exists (
        select 1
        from public.tasks as t
        where t.project_id = projects.id
          and t.assigned_to = (select auth.uid())
          and (
            public.current_employee_role() <> 'manager'::public.employee_role
            or public.can_manage_department(projects.department_id)
          )
      )
    )
  );

create policy "Management can create projects in permitted departments"
  on public.projects for insert to authenticated
  with check (
    created_by = (select auth.uid())
    and public.can_manage_department(department_id)
  );

create policy "Management can update projects in permitted departments"
  on public.projects for update to authenticated
  using (public.can_manage_department(department_id))
  with check (public.can_manage_department(department_id));

create policy "Employees can view assigned or managed tasks"
  on public.tasks for select to authenticated
  using (
    public.current_employee_role() is not null
    and (
      (
        assigned_to = (select auth.uid())
        and (
          public.current_employee_role() <> 'manager'::public.employee_role
          or public.can_manage_department(department_id)
        )
      )
      or public.can_manage_department(department_id)
    )
  );

create policy "Management can assign tasks in permitted departments"
  on public.tasks for insert to authenticated
  with check (
    assigned_by = (select auth.uid())
    and public.can_manage_department(department_id)
    and (
      assigned_to is null
      or public.is_active_employee_in_department(assigned_to, department_id)
    )
    and (
      project_id is null
      or public.project_matches_department(project_id, department_id)
    )
  );

create policy "Management can update tasks in permitted departments"
  on public.tasks for update to authenticated
  using (public.can_manage_department(department_id))
  with check (
    public.can_manage_department(department_id)
    and (
      assigned_to is null
      or public.is_active_employee_in_department(assigned_to, department_id)
    )
    and (
      project_id is null
      or public.project_matches_department(project_id, department_id)
    )
  );

create policy "Employees can view published announcements for their audience"
  on public.announcements for select to authenticated
  using (
    public.current_employee_role() is not null
    and (
      public.can_manage_department(department_id)
      or (
        status = 'published'::public.announcement_status
        and (publish_at is null or publish_at <= now())
        and (expires_at is null or expires_at > now())
        and (
          department_id is null
          or public.is_current_employee_in_department(department_id)
        )
      )
    )
  );

create policy "Management can create announcements for permitted departments"
  on public.announcements for insert to authenticated
  with check (
    created_by = (select auth.uid())
    and public.can_manage_department(department_id)
  );

create policy "Management can update announcements for permitted departments"
  on public.announcements for update to authenticated
  using (public.can_manage_department(department_id))
  with check (public.can_manage_department(department_id));

create policy "Employees can view company-wide or department meetings"
  on public.meetings for select to authenticated
  using (
    public.current_employee_role() is not null
    and (
      (
        is_company_wide
        and public.current_employee_role() <> 'manager'::public.employee_role
      )
      or public.can_manage_department(department_id)
      or (
        department_id is not null
        and public.is_current_employee_in_department(department_id)
      )
    )
  );

create policy "Management can create meetings for permitted audiences"
  on public.meetings for insert to authenticated
  with check (
    organizer_id = (select auth.uid())
    and (
      (is_company_wide and public.current_employee_role() in (
        'super_admin'::public.employee_role,
        'admin'::public.employee_role
      ))
      or (not is_company_wide and public.can_manage_department(department_id))
    )
  );

create policy "Management can update meetings for permitted audiences"
  on public.meetings for update to authenticated
  using (
    is_company_wide
      and public.current_employee_role() in (
        'super_admin'::public.employee_role,
        'admin'::public.employee_role
      )
    or (not is_company_wide and public.can_manage_department(department_id))
  )
  with check (
    (
      is_company_wide
      and public.current_employee_role() in (
        'super_admin'::public.employee_role,
        'admin'::public.employee_role
      )
    )
    or (not is_company_wide and public.can_manage_department(department_id))
  );

create policy "Employees can submit meeting requests for their department"
  on public.meeting_requests for insert to authenticated
  with check (
    requested_by = (select auth.uid())
    and public.current_employee_role() is not null
    and public.is_current_employee_in_department(department_id)
    and status = 'pending'::public.meeting_request_status
    and reviewed_by is null
  );

create policy "Employees can view own meeting requests and management can review"
  on public.meeting_requests for select to authenticated
  using (
    requested_by = (select auth.uid())
    or public.can_manage_department(department_id)
  );

create policy "Management can review meeting requests"
  on public.meeting_requests for update to authenticated
  using (public.can_manage_department(department_id))
  with check (
    public.can_manage_department(department_id)
    and (
      reviewed_by is null
      or reviewed_by = (select auth.uid())
    )
  );

create policy "Employees can submit suggestions for their department"
  on public.suggestions for insert to authenticated
  with check (
    submitted_by = (select auth.uid())
    and public.current_employee_role() is not null
    and public.is_current_employee_in_department(department_id)
    and status = 'submitted'::public.suggestion_status
    and reviewed_by is null
  );

create policy "Employees can view own suggestions and management can review"
  on public.suggestions for select to authenticated
  using (
    submitted_by = (select auth.uid())
    or public.can_manage_department(department_id)
  );

create policy "Management can review suggestions"
  on public.suggestions for update to authenticated
  using (public.can_manage_department(department_id))
  with check (
    public.can_manage_department(department_id)
    and (
      reviewed_by is null
      or reviewed_by = (select auth.uid())
    )
  );

create policy "Employees can view their own notifications"
  on public.notifications for select to authenticated
  using (
    recipient_id = (select auth.uid())
    and public.current_employee_role() is not null
  );

create policy "Employees can mark their own notifications as read"
  on public.notifications for update to authenticated
  using (
    recipient_id = (select auth.uid())
    and public.current_employee_role() is not null
  )
  with check (
    recipient_id = (select auth.uid())
    and public.current_employee_role() is not null
  );

-- Reviewers may perform only forward transitions and must record themselves as
-- the reviewer. Table grants separately restrict edits to review columns.
create function public.update_meeting_request_review()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if auth.uid() is null or coalesce(auth.role(), '') = 'service_role' then
    return new;
  end if;

  if not public.can_manage_department(old.department_id)
    or old.status <> 'pending'::public.meeting_request_status
    or new.status not in (
      'approved'::public.meeting_request_status,
      'declined'::public.meeting_request_status
    )
    or new.reviewed_by is distinct from auth.uid()
  then
    raise exception 'Meeting request review must be a permitted forward transition'
      using errcode = '42501';
  end if;

  return new;
end;
$$;

create function public.update_suggestion_review()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if auth.uid() is null or coalesce(auth.role(), '') = 'service_role' then
    return new;
  end if;

  if not public.can_manage_department(old.department_id)
    or new.reviewed_by is distinct from auth.uid()
    or not (
      (
        old.status = 'submitted'::public.suggestion_status
        and new.status in (
          'under_review'::public.suggestion_status,
          'accepted'::public.suggestion_status,
          'declined'::public.suggestion_status
        )
      )
      or (
        old.status = 'under_review'::public.suggestion_status
        and new.status in (
          'accepted'::public.suggestion_status,
          'declined'::public.suggestion_status
        )
      )
      or (
        old.status = 'accepted'::public.suggestion_status
        and new.status = 'implemented'::public.suggestion_status
      )
    )
  then
    raise exception 'Suggestion review must be a permitted forward transition'
      using errcode = '42501';
  end if;

  return new;
end;
$$;

create function public.mark_own_notification_read()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if auth.uid() is null or coalesce(auth.role(), '') = 'service_role' then
    return new;
  end if;

  if old.recipient_id is distinct from auth.uid()
    or old.read_at is not null
    or new.read_at is null
  then
    raise exception 'A notification can only be marked read once by its recipient'
      using errcode = '42501';
  end if;

  new.read_at := now();
  return new;
end;
$$;

revoke all on function public.update_meeting_request_review()
  from public, anon, authenticated;
revoke all on function public.update_suggestion_review()
  from public, anon, authenticated;
revoke all on function public.mark_own_notification_read()
  from public, anon, authenticated;

create trigger meeting_requests_guard_review
  before update on public.meeting_requests
  for each row execute function public.update_meeting_request_review();

create trigger suggestions_guard_review
  before update on public.suggestions
  for each row execute function public.update_suggestion_review();

create trigger notifications_guard_read
  before update on public.notifications
  for each row execute function public.mark_own_notification_read();

comment on table public.profiles is
  'Private employee profiles linked one-to-one to Supabase Auth users. Roles are assigned only by trusted server-side administration.';
comment on table public.departments is
  'Internal department directory; readable only by active employees.';
comment on table public.projects is
  'Internal projects visible to authorized management and employees assigned a task in the project.';
comment on table public.tasks is
  'Internal tasks visible to authorized management and the assigned employee.';
comment on table public.announcements is
  'Internal announcements scoped to a department or the whole company.';
comment on table public.meetings is
  'Internal meetings scoped to a department or explicitly marked company-wide.';
comment on table public.meeting_requests is
  'Employee meeting requests visible to their requester and authorized management.';
comment on table public.suggestions is
  'Private employee suggestions visible to their submitter and authorized management.';
comment on table public.notifications is
  'Private per-employee notifications; creation is reserved for trusted server-side code.';
