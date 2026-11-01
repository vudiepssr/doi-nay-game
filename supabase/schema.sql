-- DỜI NÀY v0.7: Run ONCE in Supabase SQL Editor.
-- No browser access to the underlying tables. All writes happen through Netlify server.
create extension if not exists pgcrypto;

create table if not exists public.game_guests (
  id uuid primary key default gen_random_uuid(),
  token_hash text not null unique check (length(token_hash) = 64),
  nickname text not null check (char_length(nickname) between 2 and 24),
  life_counter integer not null default 0 check (life_counter >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.game_runs (
  id uuid primary key,
  guest_id uuid not null references public.game_guests(id) on delete cascade,
  life_number integer not null check (life_number >= 1),
  state jsonb not null,
  revision integer not null default 0 check (revision >= 0),
  alive boolean not null default true,
  created_at timestamptz not null default now(),
  died_at timestamptz,
  unique(guest_id,life_number)
);
create unique index if not exists game_one_active_run_per_guest
  on public.game_runs(guest_id) where alive = true;
create index if not exists game_runs_guest_recent on public.game_runs(guest_id, created_at desc);

create table if not exists public.game_scores (
  run_id uuid primary key references public.game_runs(id) on delete cascade,
  guest_id uuid not null references public.game_guests(id) on delete cascade,
  nickname text not null,
  name text not null,
  age integer not null,
  cash bigint not null,
  absurdity integer not null,
  iq integer not null,
  birth_iq integer not null,
  reason text not null,
  job text not null,
  created_at timestamptz not null default now()
);
create index if not exists game_scores_rich on public.game_scores(cash desc, created_at);
create index if not exists game_scores_old on public.game_scores(age desc, created_at);
create index if not exists game_scores_absurd on public.game_scores(absurdity desc, created_at);
create index if not exists game_scores_iq on public.game_scores(iq desc, created_at);

alter table public.game_guests enable row level security;
alter table public.game_runs enable row level security;
alter table public.game_scores enable row level security;
revoke all on public.game_guests, public.game_runs, public.game_scores from anon, authenticated;

-- Atomic start: prevents two active lives, counts births and assigns server-owned life numbers.
create or replace function public.game_start_run(p_guest_id uuid, p_run_id uuid, p_state jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_life integer; v_active public.game_runs%rowtype; v_state jsonb;
begin
  perform 1 from public.game_guests where id = p_guest_id for update;
  if not found then raise exception 'Guest not found'; end if;
  select * into v_active from public.game_runs where guest_id = p_guest_id and alive = true limit 1;
  if found then
    return jsonb_build_object('runId',v_active.id,'revision',v_active.revision,'state',v_active.state);
  end if;
  update public.game_guests set life_counter = life_counter + 1 where id = p_guest_id
    returning life_counter into v_life;
  v_state := jsonb_set(jsonb_set(p_state,'{player,lifeNumber}',to_jsonb(v_life),true),
                           '{player,id}',to_jsonb(p_run_id::text),true);
  insert into public.game_runs(id,guest_id,life_number,state,alive)
  values(p_run_id,p_guest_id,v_life,v_state,true);
  return jsonb_build_object('runId',p_run_id,'revision',0,'state',v_state);
end $$;

-- Optimistic concurrency: two tabs cannot independently advance one life.
-- A dead run writes its score in the SAME database transaction as its final state.
create or replace function public.game_commit_run(
  p_guest_id uuid, p_run_id uuid, p_revision integer, p_state jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_run public.game_runs%rowtype; v_player jsonb; v_guest public.game_guests%rowtype;
begin
  select * into v_run from public.game_runs
  where id = p_run_id and guest_id = p_guest_id and revision = p_revision and alive = true
  for update;
  if not found then return jsonb_build_object('ok',false,'conflict',true); end if;
  v_player := p_state->'player';
  if v_player is null then raise exception 'Missing player state'; end if;
  update public.game_runs set
    state=p_state, revision=revision+1,
    alive=coalesce((v_player->>'alive')::boolean,false),
    died_at=case when coalesce((v_player->>'alive')::boolean,false) then null else now() end
  where id=p_run_id;
  if coalesce((v_player->>'alive')::boolean,false) = false then
    select * into v_guest from public.game_guests where id=p_guest_id;
    insert into public.game_scores(run_id,guest_id,nickname,name,age,cash,absurdity,iq,birth_iq,reason,job)
    values(p_run_id,p_guest_id,v_guest.nickname,
      left(coalesce(v_player->>'name','Vô danh'),50),
      greatest(0,least(115,coalesce((v_player->>'age')::int,0))),
      greatest(0,coalesce((v_player->>'cash')::bigint,0)+coalesce((v_player->>'invested')::bigint,0)),
      greatest(0,coalesce((v_player->>'absurdity')::int,0)),
      greatest(0,least(200,coalesce((v_player->>'peakIQ')::int,(v_player->>'intellect')::int,0))),
      greatest(0,least(200,coalesce((v_player->>'birthIQ')::int,0))),
      left(coalesce(v_player->>'deathReason','Không rõ'),300),
      left(coalesce(v_player->>'job','Không rõ'),100))
    on conflict (run_id) do nothing;
  end if;
  return jsonb_build_object('ok',true,'revision',p_revision+1);
end $$;

create or replace function public.game_global_boards()
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'rich',coalesce((select jsonb_agg(to_jsonb(q) order by q.rank) from (
      select row_number() over(order by cash desc,created_at,run_id) as rank,
             run_id as id,nickname,name,age,cash,absurdity,iq,birth_iq as "birthIQ",reason,job
      from public.game_scores order by cash desc,created_at,run_id limit 100) q),'[]'::jsonb),
    'old',coalesce((select jsonb_agg(to_jsonb(q) order by q.rank) from (
      select row_number() over(order by age desc,created_at,run_id) as rank,
             run_id as id,nickname,name,age,cash,absurdity,iq,birth_iq as "birthIQ",reason,job
      from public.game_scores order by age desc,created_at,run_id limit 100) q),'[]'::jsonb),
    'absurd',coalesce((select jsonb_agg(to_jsonb(q) order by q.rank) from (
      select row_number() over(order by absurdity desc,created_at,run_id) as rank,
             run_id as id,nickname,name,age,cash,absurdity,iq,birth_iq as "birthIQ",reason,job
      from public.game_scores order by absurdity desc,created_at,run_id limit 100) q),'[]'::jsonb),
    'iq',coalesce((select jsonb_agg(to_jsonb(q) order by q.rank) from (
      select row_number() over(order by iq desc,created_at,run_id) as rank,
             run_id as id,nickname,name,age,cash,absurdity,iq,birth_iq as "birthIQ",reason,job
      from public.game_scores order by iq desc,created_at,run_id limit 100) q),'[]'::jsonb)
  );
$$;

-- Give the exact position displayed on the Top list, including equal-score tie breakers.
create or replace function public.game_run_ranks(p_run_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'rich',(select count(*)+1 from public.game_scores b
      where b.cash>e.cash or (b.cash=e.cash and (b.created_at,b.run_id)<(e.created_at,e.run_id))),
    'old',(select count(*)+1 from public.game_scores b
      where b.age>e.age or (b.age=e.age and (b.created_at,b.run_id)<(e.created_at,e.run_id))),
    'absurd',(select count(*)+1 from public.game_scores b
      where b.absurdity>e.absurdity or (b.absurdity=e.absurdity and (b.created_at,b.run_id)<(e.created_at,e.run_id))),
    'iq',(select count(*)+1 from public.game_scores b
      where b.iq>e.iq or (b.iq=e.iq and (b.created_at,b.run_id)<(e.created_at,e.run_id)))
  ) from public.game_scores e where e.run_id = p_run_id;
$$;

-- Restrict direct RPC access to backend service key only.
revoke all on function public.game_start_run(uuid,uuid,jsonb) from public,anon,authenticated;
revoke all on function public.game_commit_run(uuid,uuid,integer,jsonb) from public,anon,authenticated;
revoke all on function public.game_global_boards() from public,anon,authenticated;
revoke all on function public.game_run_ranks(uuid) from public,anon,authenticated;
grant execute on function public.game_start_run(uuid,uuid,jsonb) to service_role;
grant execute on function public.game_commit_run(uuid,uuid,integer,jsonb) to service_role;
grant execute on function public.game_global_boards() to service_role;
grant execute on function public.game_run_ranks(uuid) to service_role;

-- Persistent limit per guest: 90 state-changing HTTP requests per rolling minute window.
-- This slows simple bots, but is NOT a substitute for challenge/abuse protection at scale.
create table if not exists public.game_guest_limits (
  guest_id uuid primary key references public.game_guests(id) on delete cascade,
  window_start timestamptz not null default now(),
  hits integer not null default 0
);
alter table public.game_guest_limits enable row level security;
revoke all on public.game_guest_limits from anon,authenticated;
create or replace function public.game_check_rate(p_guest_id uuid)
returns boolean language plpgsql security definer set search_path = public as $$
declare allowed boolean;
begin
  insert into public.game_guest_limits(guest_id,window_start,hits)
  values(p_guest_id,now(),1)
  on conflict (guest_id) do update set
    hits=case when public.game_guest_limits.window_start < now()-interval '1 minute' then 1
              else public.game_guest_limits.hits+1 end,
    window_start=case when public.game_guest_limits.window_start < now()-interval '1 minute'
                      then now() else public.game_guest_limits.window_start end
  returning hits <= 90 into allowed;
  return allowed;
end $$;
revoke all on function public.game_check_rate(uuid) from public,anon,authenticated;
grant execute on function public.game_check_rate(uuid) to service_role;


-- v0.7: anti-spam for anonymous guest CREATION (60 guests/hour per hashed IP).
-- IP is HMAC-hashed by Netlify and never stored as a plain address.
create table if not exists public.game_guest_ip_limits (
  ip_hash text primary key check (length(ip_hash)=64),
  window_start timestamptz not null default now(),
  hits integer not null default 0
);
alter table public.game_guest_ip_limits enable row level security;
revoke all on public.game_guest_ip_limits from anon, authenticated;

create or replace function public.game_allow_guest_ip(p_ip_hash text)
returns boolean language plpgsql security definer set search_path = public as $$
declare allowed boolean;
begin
  if p_ip_hash is null or length(p_ip_hash)<>64 then return false; end if;
  insert into public.game_guest_ip_limits(ip_hash,window_start,hits)
  values(p_ip_hash,now(),1)
  on conflict (ip_hash) do update set
    hits=case when public.game_guest_ip_limits.window_start < now()-interval '1 hour' then 1
              else public.game_guest_ip_limits.hits+1 end,
    window_start=case when public.game_guest_ip_limits.window_start < now()-interval '1 hour'
                      then now() else public.game_guest_ip_limits.window_start end
  returning hits <= 60 into allowed;
  return allowed;
end $$;
revoke all on function public.game_allow_guest_ip(text) from public,anon,authenticated;
grant execute on function public.game_allow_guest_ip(text) to service_role;
