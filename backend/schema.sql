-- Additive v2 schema: existing app_private participants are preserved.
create schema if not exists connection_private;
revoke all on schema connection_private from public, anon, authenticated;
create table if not exists connection_private.profiles (
 id uuid primary key default gen_random_uuid(), token_hash text unique not null,
 profile jsonb not null, created_at timestamptz not null default now(),
 expires_at timestamptz not null default now()+interval '90 days'
);
alter table connection_private.profiles add column if not exists mail_access_hash text;
create index if not exists profiles_mail_access_idx on connection_private.profiles(mail_access_hash);
create table if not exists connection_private.consents (
 from_id uuid references connection_private.profiles on delete cascade,
 to_id uuid references connection_private.profiles on delete cascade,
 created_at timestamptz not null default now(), primary key(from_id,to_id), check(from_id<>to_id)
);
alter table connection_private.consents add column if not exists share_profile boolean not null default false;
create table if not exists connection_private.notifications (
 recipient uuid references connection_private.profiles on delete cascade,
 partner uuid references connection_private.profiles on delete cascade,
 sent_at timestamptz, claimed_at timestamptz, attempts integer not null default 0,
 primary key(recipient,partner)
);
create table if not exists connection_private.rate_limits (
 source text, window_start timestamptz, total integer not null, primary key(source,window_start)
);
create table if not exists connection_private.mail_jobs (
 recipient uuid references connection_private.profiles on delete cascade,
 partner uuid references connection_private.profiles on delete cascade,
 kind text not null check(kind in ('match','profile')),
 sent_at timestamptz, claimed_at timestamptz, attempts integer not null default 0,
 primary key(recipient,partner,kind),check(recipient<>partner)
);
alter table connection_private.mail_jobs enable row level security;
create index if not exists mail_jobs_partner_idx on connection_private.mail_jobs(partner);
alter table connection_private.profiles enable row level security;
alter table connection_private.consents enable row level security;
alter table connection_private.notifications enable row level security;
alter table connection_private.rate_limits enable row level security;
create index if not exists consents_target_idx on connection_private.consents(to_id);
create index if not exists notifications_partner_idx on connection_private.notifications(partner);
grant usage on schema connection_private to service_role;
grant all on all tables in schema connection_private to service_role;

create or replace function public.connection_rpc(p_action text, p_hash text default null, p_profile jsonb default null, p_target uuid default null, p_source text default null)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare me connection_private.profiles%rowtype; n integer;
begin
 -- Only the server's service role may call this function; no direct client access.
 if p_action='mail_access' then
  if p_source !~ '^[0-9a-f]{64}$' then raise exception 'invalid_access_hash'; end if;
  update connection_private.profiles set mail_access_hash=p_source where id=p_target and expires_at>now();
  return '{}'::jsonb;
 end if;
 if p_action='mail_claim' then
  return (with batch as (
   select q.recipient,q.partner,q.kind from connection_private.mail_jobs q
   join connection_private.profiles p on p.id=q.recipient
   join connection_private.profiles b on b.id=q.partner
   where q.sent_at is null and q.attempts<5 and (q.claimed_at is null or q.claimed_at<now()-interval '5 minutes')
   and p.expires_at>now() and b.expires_at>now()
   and (q.kind='match' or (
    exists(select 1 from connection_private.consents c where c.from_id=q.recipient and c.to_id=q.partner and c.share_profile)
    and exists(select 1 from connection_private.consents c where c.from_id=q.partner and c.to_id=q.recipient and c.share_profile)))
   limit 20 for update of q skip locked
  ), claimed as (
   update connection_private.mail_jobs q set claimed_at=now(),attempts=q.attempts+1
   from batch where q.recipient=batch.recipient and q.partner=batch.partner and q.kind=batch.kind returning q.*
  ) select coalesce(jsonb_agg(jsonb_build_object('recipient',c.recipient,'partner',c.partner,'kind',c.kind,'email',p.profile->>'email',
    'mutual',c.kind='profile','profile',case when c.kind='profile' then b.profile else null end)),'[]'::jsonb)
  from claimed c join connection_private.profiles p on p.id=c.recipient join connection_private.profiles b on b.id=c.partner);
 end if;
 if p_action='mail_sent' then
  update connection_private.mail_jobs set sent_at=now() where recipient=p_source::uuid and partner=p_target and kind=p_profile->>'kind';
  return '{}'::jsonb;
 end if;
 if p_hash is null or p_hash !~ '^[0-9a-f]{64}$' then raise exception 'session_invalid'; end if;
 if p_action='register' then
  perform pg_advisory_xact_lock(742019405);
  delete from connection_private.profiles where expires_at<=now();
  delete from connection_private.rate_limits where window_start<now()-interval '1 day';
  if p_source is null or p_profile is null or octet_length(p_profile::text)>350000 then raise exception 'invalid_registration'; end if;
  insert into connection_private.rate_limits values(p_source,date_trunc('hour',now()),1)
   on conflict(source,window_start) do update set total=connection_private.rate_limits.total+1 returning total into n;
  if n>30 then raise exception 'rate_limit'; end if;
  if (select count(*) from connection_private.profiles)>=1000 then raise exception 'capacity'; end if;
  insert into connection_private.profiles(token_hash,profile) values(p_hash,p_profile) returning * into me;
 elsif p_action='delete' then
  delete from connection_private.profiles where token_hash=p_hash or mail_access_hash=p_hash;
  return '{}'::jsonb;
 else
  select * into me from connection_private.profiles where (token_hash=p_hash or mail_access_hash=p_hash) and expires_at>now();
  if not found then raise exception 'session_invalid'; end if;
 end if;
 if p_action='enqueue' then
  insert into connection_private.mail_jobs(recipient,partner,kind) values(me.id,p_target,'match'),(p_target,me.id,'match') on conflict do nothing;
  return '{}'::jsonb;
 end if;
 if p_action='accept' then
  if p_target=me.id or not exists(select 1 from connection_private.profiles where id=p_target and expires_at>now()) then raise exception 'target_invalid'; end if;
  -- Serialize simultaneous accepts for the same unordered pair.
  perform pg_advisory_xact_lock(hashtextextended(least(me.id::text,p_target::text)||greatest(me.id::text,p_target::text),0));
  insert into connection_private.consents(from_id,to_id,share_profile) values(me.id,p_target,true)
   on conflict(from_id,to_id) do update set share_profile=true,created_at=now();
  if exists(select 1 from connection_private.consents where from_id=p_target and to_id=me.id and share_profile) then
   insert into connection_private.mail_jobs(recipient,partner,kind) values(me.id,p_target,'profile'),(p_target,me.id,'profile') on conflict do nothing;
  end if;
 end if;
 return jsonb_build_object('profile',me.profile||jsonb_build_object('id',me.id,'createdAt',me.created_at),
 'candidates',(select coalesce(jsonb_agg(jsonb_build_object('profile',p.profile||jsonb_build_object('id',p.id),
 'accepted',exists(select 1 from connection_private.consents c where c.from_id=me.id and c.to_id=p.id and c.share_profile),
 'partnerAccepted',exists(select 1 from connection_private.consents c where c.from_id=p.id and c.to_id=me.id and c.share_profile))),'[]'::jsonb)
 from connection_private.profiles p where p.id<>me.id and p.expires_at>now()));
end $$;
revoke all on function public.connection_rpc(text,text,jsonb,uuid,text) from public,anon,authenticated;
grant execute on function public.connection_rpc(text,text,jsonb,uuid,text) to service_role;
notify pgrst,'reload schema';
