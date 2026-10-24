-- All ticket data and team changes are rolled back.
begin;
do $check$
declare administrator uuid; developer uuid; ticket uuid; detail jsonb;
begin
 select user_id into administrator from public.ksoft_admins limit 1;
 select user_id into developer from public.ksoft_developers where active and role='developer' limit 1;
 if administrator is null or developer is null then raise exception 'MISSING_ACCOUNTS'; end if;
 perform set_config('request.jwt.claim.role','authenticated',true);
 perform set_config('request.jwt.claim.sub',developer::text,true);
 ticket:=public.ksoft_ticket_create('Verificación transaccional','Prueba interna que se revierte al finalizar.',administrator,'Consulta','Normal');
 perform set_config('request.jwt.claim.sub',administrator::text,true);
 detail:=public.ksoft_ticket_detail(ticket);
 if detail->'ticket'->>'creator'<>developer::text then raise exception 'INVALID_CREATOR'; end if;
 perform public.ksoft_ticket_update(ticket,'Validación transaccional completada.','Resuelto',null);
 perform set_config('request.jwt.claim.sub',developer::text,true);
 detail:=public.ksoft_ticket_detail(ticket);
 if detail->'ticket'->>'status'<>'Resuelto' or jsonb_array_length(detail->'messages')<>3 then raise exception 'TICKET_FLOW_FAILED'; end if;
 perform set_config('request.jwt.claim.sub',administrator::text,true);
 perform public.ksoft_manage_team(developer,'Verificación temporal','employee',true);
 perform set_config('request.jwt.claim.sub',developer::text,true);
 if public.ksoft_get_access()->>'role'<>'employee' or jsonb_array_length(public.ksoft_read_staff_workspace()->'document'->'workspace'->'records'->'projects')<>0 then raise exception 'EMPLOYEE_PERMISSIONS_FAILED'; end if;
end $check$;
rollback;
