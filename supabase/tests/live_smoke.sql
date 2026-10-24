-- Live intake check that rolls back every test record and revision change.
begin;
select set_config('request.jwt.claim.role','service_role',true);
do $check$
declare original_revision bigint; after_revision bigint; enquiry_id uuid;
begin
  select revision into original_revision from public.ksoft_workspace where id for update;
  enquiry_id := public.ksoft_receive_enquiry(
    '{"name":"Verificación técnica","email":"connection-check@example.test","message":"Prueba transaccional: se revierte sin conservar datos.","purpose":"pilot","product":"saas-dental"}'::jsonb,
    repeat('e',64)
  );
  select revision into after_revision from public.ksoft_workspace where id;
  if after_revision<>original_revision+1 then raise exception 'Intake revision was not incremented'; end if;
  if not exists(select 1 from public.ksoft_records where module='requests' and id=enquiry_id::text) then raise exception 'Enquiry was not stored'; end if;
end $check$;
rollback;
