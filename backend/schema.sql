-- Additive v2 schema: existing app_private participants are preserved.
create schema if not exists connection_private;
revoke all on schema connection_private from public, anon, authenticated;
create table if not exists connection_private.profiles (
 id uuid primary key default gen_random_uuid(), token_hash text unique not null,
 profile jsonb not null, created_at timestamptz not null default now(),
 expires_at timestamptz not null default now()+interval '90 days'
);
create table if not exists connection_private.consents (
 from_id uuid references connection_private.profiles on delete cascade,
 to_id uuid references connection_private.profiles on delete cascade,
 created_at timestamptz not null default now(), primary key(from_id,to_id), check(from_id<>to_id)
);
create table if not exists connection_private.notifications (
 recipient uuid references connection_private.profiles on delete cascade,
 partner uuid references connection_private.profiles on delete cascade,
 sent_at timestamptz, claimed_at timestamptz, attempts integer not null default 0,
 primary key(recipient,partner)
);
create table if not exists connection_private.rate_limits (
 source text, window_start timestamptz, total integer not null, primary key(source,window_start)
);
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
 if p_action='mail_claim' then
  return (with batch as (
   select q.recipient,q.partner from connection_private.notifications q
   join connection_private.profiles p on p.id=q.recipient
   join connection_private.profiles b on b.id=q.partner
   where q.sent_at is null and q.attempts<5 and (q.claimed_at is null or q.claimed_at<now()-interval '5 minutes')
   and p.expires_at>now() and b.expires_at>now() limit 20 for update of q skip locked
  ), claimed as (
   update connection_private.notifications q set claimed_at=now(),attempts=q.attempts+1
   from batch where q.recipient=batch.recipient and q.partner=batch.partner returning q.*
  ) select coalesce(jsonb_agg(jsonb_build_object('recipient',c.recipient,'partner',c.partner,'email',p.profile->>'email')),'[]'::jsonb)
  from claimed c join connection_private.profiles p on p.id=c.recipient);
 end if;
 if p_action='mail_sent' then
  update connection_private.notifications set sent_at=now() where recipient=p_source::uuid and partner=p_target;
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
  delete from connection_private.profiles where token_hash=p_hash;
  return '{}'::jsonb;
 else
  select * into me from connection_private.profiles where token_hash=p_hash and expires_at>now();
  if not found then raise exception 'session_invalid'; end if;
 end if;
 if p_action='enqueue' then
  insert into connection_private.notifications(recipient,partner) values(me.id,p_target),(p_target,me.id) on conflict do nothing;
  return '{}'::jsonb;
 end if;
 if p_action='accept' then
  if p_target=me.id or not exists(select 1 from connection_private.profiles where id=p_target and expires_at>now()) then raise exception 'target_invalid'; end if;
  insert into connection_private.consents(from_id,to_id) values(me.id,p_target) on conflict do nothing;
 end if;
 return jsonb_build_object('profile',me.profile||jsonb_build_object('id',me.id,'createdAt',me.created_at),
 'candidates',(select coalesce(jsonb_agg(jsonb_build_object('profile',p.profile||jsonb_build_object('id',p.id),
 'accepted',exists(select 1 from connection_private.consents c where c.from_id=me.id and c.to_id=p.id),
 'partnerAccepted',exists(select 1 from connection_private.consents c where c.from_id=p.id and c.to_id=me.id))),'[]'::jsonb)
 from connection_private.profiles p where p.id<>me.id and p.expires_at>now()));
end $$;
revoke all on function public.connection_rpc(text,text,jsonb,uuid,text) from public,anon,authenticated;
grant execute on function public.connection_rpc(text,text,jsonb,uuid,text) to service_role;
notify pgrst,'reload schema';
