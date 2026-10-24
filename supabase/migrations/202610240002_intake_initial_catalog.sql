-- Match the public fallback catalog until the first explicit publication.
begin;
create or replace function public.ksoft_receive_enquiry(enquiry jsonb,fingerprint text) returns uuid language plpgsql security definer set search_path='' as $$
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
  if enquiry->>'purpose'='pilot' and not exists(
    select 1 from public.ksoft_public_site s cross join lateral jsonb_array_elements(s.payload->'products') p where p->>'slug'=enquiry->>'product'
  ) and not (
    -- Before the first publication, the public website shows these two existing
    -- repository products. An unpublished custom draft is never accepted.
    exists(select 1 from public.ksoft_public_site where id and payload is null)
    and enquiry->>'product' in ('saas-dental','ksoft-travel')
  ) then raise exception 'INVALID_PRODUCT'; end if;
  insert into public.ksoft_records values('requests',new_id::text,-extract(epoch from now())::integer,jsonb_build_object('id',new_id,'createdAt',stamp,'updatedAt',stamp,'values',v));
  update public.ksoft_workspace set revision=rev+1,updated_at=now() where id;
  return new_id;
end $$;
commit;
