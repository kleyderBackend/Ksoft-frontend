-- Ksoft corporate dashboard. Run once in a new Supabase project's SQL Editor.
-- Private records never have anonymous policies. Membership is granted manually.
begin;
create table public.ksoft_admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.ksoft_admins enable row level security;
create policy own_membership on public.ksoft_admins for select to authenticated using (user_id = (select auth.uid()));
grant select on public.ksoft_admins to authenticated;
revoke all on public.ksoft_admins from anon;
revoke insert,update,delete on public.ksoft_admins from authenticated;

create function public.ksoft_is_admin() returns boolean language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.ksoft_admins where user_id = auth.uid())
$$;
revoke all on function public.ksoft_is_admin() from public,anon;
grant execute on function public.ksoft_is_admin() to authenticated;

create table public.ksoft_workspace (
  id boolean primary key default true check(id),
  revision bigint not null default 0,
  metadata jsonb,
  updated_at timestamptz not null default now()
);
insert into public.ksoft_workspace(id) values(true);
create table public.ksoft_records (
  module text not null check(module in ('requests','payments','expenses','projects','tasks','supports','contacts','clients','quotes','files','posts','products','publicProjects')),
  id text not null,
  position integer not null,
  payload jsonb not null check(jsonb_typeof(payload)='object' and payload->>'id'=id),
  primary key(module,id)
);
create table public.ksoft_audit (
  id bigint generated always as identity primary key,
  actor uuid references auth.users(id),
  action text not null,
  revision bigint not null,
  created_at timestamptz not null default now()
);
create table public.ksoft_public_site (
  id boolean primary key default true check(id),
  payload jsonb,
  published_at timestamptz
);
insert into public.ksoft_public_site(id) values(true);
alter table public.ksoft_workspace enable row level security;
alter table public.ksoft_records enable row level security;
alter table public.ksoft_audit enable row level security;
alter table public.ksoft_public_site enable row level security;
-- All private writes go through authorized, transactional RPCs, with revision checks.
revoke all on public.ksoft_workspace,public.ksoft_records,public.ksoft_audit from anon,authenticated;
revoke all on public.ksoft_public_site from anon,authenticated;
grant select on public.ksoft_public_site to anon,authenticated;
create policy public_site_read on public.ksoft_public_site for select to anon,authenticated using(true);

create function public.ksoft_read_workspace() returns jsonb language plpgsql security definer set search_path='' as $$
declare document jsonb; records jsonb := '{}'; m text; rev bigint;
begin
  if not public.ksoft_is_admin() then raise exception 'FORBIDDEN' using errcode='42501'; end if;
  -- A shared lock yields one consistent snapshot and serializes with save/intake.
  select metadata,revision into document,rev from public.ksoft_workspace where id for share;
  if document is null then return jsonb_build_object('document',null,'revision',rev); end if;
  foreach m in array array['requests','payments','expenses','projects','tasks','supports','contacts','clients','quotes','files'] loop
    records := records || jsonb_build_object(m,coalesce((select jsonb_agg(payload order by position)  from public.ksoft_records where module=m),'[]'::jsonb));
  end loop;
  document := jsonb_set(document,'{workspace,records}',records);
  foreach m in array array['posts','products','publicProjects'] loop
    document := document || jsonb_build_object(m,coalesce((select jsonb_agg(payload order by position) from public.ksoft_records where module=m),'[]'::jsonb));
  end loop;
  return jsonb_build_object('document',document,'revision',rev);
end $$;

create function public.ksoft_save_workspace(document jsonb,expected_revision bigint) returns bigint language plpgsql security definer set search_path='' as $$
declare rev bigint; m text; items jsonb; item jsonb; v_metadata jsonb; source_module text; field_name text; target_module text;
begin
  if not public.ksoft_is_admin() then raise exception 'FORBIDDEN' using errcode='42501'; end if;
  select revision into rev from public.ksoft_workspace where id for update;
  if rev<>expected_revision then raise exception 'CONFLICT'; end if;
  if document->>'version' is distinct from '1' or jsonb_typeof(document->'workspace') is distinct from 'object' or octet_length(document::text)>6291456 then raise exception 'INVALID_DOCUMENT'; end if;
  foreach m in array array['requests','payments','expenses','projects','tasks','supports','contacts','clients','quotes','files','posts','products','publicProjects'] loop
    items := case when m in ('posts','products','publicProjects') then coalesce(document->m,'[]'::jsonb) else document->'workspace'->'records'->m end;
    if jsonb_typeof(items) is distinct from 'array' then raise exception 'INVALID_MODULE %',m; end if;
    if exists(select 1 from jsonb_array_elements(items) x where jsonb_typeof(x) is distinct from 'object' or coalesce(x->>'id','')='' or length(x->>'id')>200) then raise exception 'INVALID_RECORD'; end if;
    delete from public.ksoft_records where module=m;
    insert into public.ksoft_records(module,id,position,payload) select m,x->>'id',n::integer,x from jsonb_array_elements(items) with ordinality as t(x,n);
  end loop;
  -- Server-side relationship validation, independent of browser validation.
  for source_module,field_name,target_module in select * from (values
    ('payments','client','clients'),('payments','quote','quotes'),('quotes','client','clients'),
    ('projects','client','clients'),('projects','quote','quotes'),('tasks','project','projects'),
    ('files','project','projects'),('supports','client','clients'),('contacts','client','clients'),('requests','contact','contacts')
  ) as relations(s,f,t) loop
    if exists(select 1 from public.ksoft_records r where r.module=source_module and coalesce(r.payload->'values'->>field_name,'')<>'' and not exists(select 1 from public.ksoft_records target where target.module=target_module and target.id=r.payload->'values'->>field_name)) then raise exception 'INVALID_RELATION % %',source_module,field_name; end if;
  end loop;
  if exists(select 1 from public.ksoft_records r join public.ksoft_records q on q.module='quotes' and q.id=r.payload->'values'->>'quote' where r.module in ('payments','projects') and coalesce(r.payload->'values'->>'client','') is distinct from coalesce(q.payload->'values'->>'client','')) then raise exception 'CLIENT_MISMATCH'; end if;
  -- Money is validated on the server, including total allocations across payments.
  for item in select payload from public.ksoft_records where module in ('payments','expenses','quotes') loop
    if coalesce(item->'values'->>'amount','') !~ '^[0-9]+(\.[0-9]{1,2})?$' then raise exception 'INVALID_AMOUNT'; end if;
  end loop;
  if exists(select 1 from public.ksoft_records q join public.ksoft_records p on p.module='payments' and p.payload->'values'->>'quote'=q.id and p.payload->'values'->>'status'<>'Anulado' where q.module='quotes' group by q.id,q.payload having sum((p.payload->'values'->>'amount')::numeric)>(q.payload->'values'->>'amount')::numeric) then raise exception 'PAYMENT_EXCEEDS_QUOTE'; end if;
  v_metadata := document - 'posts' - 'products' - 'publicProjects';
  v_metadata := jsonb_set(v_metadata,'{workspace,records}','{}'::jsonb);
  update public.ksoft_workspace set metadata=v_metadata,revision=rev+1,updated_at=now() where id;
  insert into public.ksoft_audit(actor,action,revision) values(auth.uid(),'save',rev+1);
  return rev+1;
end $$;

-- Publishing is explicit and only copies commercial fields, never CRM records,
-- private files, recovery data, settings, or audit events.
create function public.ksoft_publish_site(expected_revision bigint) returns void language plpgsql security definer set search_path='' as $$
declare rev bigint; result jsonb := '{}'; m text; items jsonb;
begin
  if not public.ksoft_is_admin() then raise exception 'FORBIDDEN' using errcode='42501'; end if;
  select revision into rev from public.ksoft_workspace where id for update;
  if rev<>expected_revision then raise exception 'CONFLICT'; end if;
  foreach m in array array['products','publicProjects','posts'] loop
    select coalesce(jsonb_agg(clean.payload order by r.position),'[]'::jsonb) into items
    from public.ksoft_records r cross join lateral (
      select jsonb_object_agg(key,value) as payload from jsonb_each(r.payload) where key=any(case when m='posts' then array['id','title','slug','excerpt','content','image','status','updatedAt'] else array['id','name','slug','headline','description','icon','logo','sector','audience','billingModel','availability','status','questions','editorialStatus','updatedAt','buttonText','contactButtonText','entryType','visibility','contactIntent','presentation'] end)
    ) clean
    where r.module=m and case when m='posts' then r.payload->>'status'='ready' else r.payload->>'editorialStatus'='ready' and r.payload->>'visibility'='visible' end;
    result:=result || jsonb_build_object(m,items);
  end loop;
  if exists(select 1 from jsonb_array_elements((result->'products') || (result->'publicProjects')) x group by x->>'slug' having count(*)>1) then raise exception 'DUPLICATE_PUBLIC_SLUG'; end if;
  update public.ksoft_public_site set payload=result,published_at=now() where id;
  insert into public.ksoft_audit(actor,action,revision) values(auth.uid(),'publish',rev);
end $$;

-- Contact intake is SERVER ONLY; no anonymous reads/inserts of private tables.
create table public.ksoft_intake_limits (fingerprint text primary key,last_received timestamptz not null);
alter table public.ksoft_intake_limits enable row level security;
revoke all on public.ksoft_intake_limits from anon,authenticated;
create function public.ksoft_receive_enquiry(enquiry jsonb,fingerprint text) returns uuid language plpgsql security definer set search_path='' as $$
declare new_id uuid := gen_random_uuid(); rev bigint; allowed boolean; v jsonb; stamp text := to_char(now() at time zone 'UTC','YYYY-MM-DD"T"HH24:MI:SS.MS"Z"');
begin
  if coalesce(auth.role(),'')<>'service_role' then raise exception 'FORBIDDEN' using errcode='42501'; end if;
  if length(coalesce(enquiry->>'name','')) not between 1 and 120 or length(coalesce(enquiry->>'email','')) not between 3 and 254 or coalesce(enquiry->>'email','') !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' or length(coalesce(enquiry->>'message','')) not between 1 and 5000 or length(fingerprint)<>64 then raise exception 'INVALID_ENQUIRY'; end if;
  insert into public.ksoft_intake_limits values(fingerprint,now()) on conflict on constraint ksoft_intake_limits_pkey do update set last_received=now() where ksoft_intake_limits.last_received<now()-interval '60 seconds' returning true into allowed;
  if allowed is distinct from true then raise exception 'RATE_LIMITED'; end if;
  delete from public.ksoft_intake_limits where last_received<now()-interval '1 day';
  select revision into rev from public.ksoft_workspace where id for update;
  if (select metadata is null from public.ksoft_workspace where id) then raise exception 'WORKSPACE_NOT_INITIALIZED'; end if;
  v:=jsonb_build_object('name',enquiry->>'name','email',enquiry->>'email','message',enquiry->>'message','status','Nueva','date',to_char(now() at time zone 'America/Bogota','YYYY-MM-DD'),'purpose',case when enquiry->>'purpose'='pilot' then 'Participación en piloto' else 'Consulta general' end,'product',coalesce(enquiry->>'product',''));
  if enquiry->>'purpose'='pilot' and not exists(select 1 from public.ksoft_public_site s cross join lateral jsonb_array_elements(s.payload->'products') p where p->>'slug'=enquiry->>'product') then raise exception 'INVALID_PRODUCT'; end if;
  insert into public.ksoft_records values('requests',new_id::text,-extract(epoch from now())::integer,jsonb_build_object('id',new_id,'createdAt',stamp,'updatedAt',stamp,'values',v));
  update public.ksoft_workspace set revision=rev+1,updated_at=now() where id;
  return new_id;
end $$;

revoke all on function public.ksoft_read_workspace(),public.ksoft_save_workspace(jsonb,bigint),public.ksoft_publish_site(bigint),public.ksoft_receive_enquiry(jsonb,text) from public,anon,authenticated;
grant execute on function public.ksoft_read_workspace(),public.ksoft_save_workspace(jsonb,bigint),public.ksoft_publish_site(bigint) to authenticated;
grant execute on function public.ksoft_receive_enquiry(jsonb,text) to service_role;

-- Public marketing images only. Private documents remain in private record
-- payloads in this version, preserving existing backup/export compatibility.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('ksoft-media','ksoft-media',true,512000,array['image/png','image/jpeg','image/webp']);
create policy ksoft_media_insert on storage.objects for insert to authenticated with check(bucket_id='ksoft-media' and public.ksoft_is_admin());
create policy ksoft_media_read_admin on storage.objects for select to authenticated using(bucket_id='ksoft-media' and public.ksoft_is_admin());
-- No client delete policy: avoids breaking images referenced by published pages.
commit;
