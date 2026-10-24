begin;
alter table public.ksoft_developers add column role text not null default 'developer' check(role in ('developer','qa','employee'));
alter table public.ksoft_developers add column updated_at timestamptz not null default now();
create or replace function public.ksoft_is_developer() returns boolean language sql stable security definer set search_path='' as $$
select exists(select 1 from public.ksoft_developers where user_id=auth.uid() and active and role in ('developer','qa')) $$;
create or replace function public.ksoft_get_access() returns jsonb language sql stable security definer set search_path='' as $$
select case when public.ksoft_is_admin() then jsonb_build_object('role','admin','userId',auth.uid()) else (select jsonb_build_object('role',role,'userId',user_id) from public.ksoft_developers where user_id=auth.uid() and active) end $$;
create function public.ksoft_staff_name(p_user uuid) returns text language sql stable security definer set search_path='' as $$
select coalesce((select display_name from public.ksoft_developers where user_id=p_user),(select 'Administración de Ksoft' where exists(select 1 from public.ksoft_admins where user_id=p_user)),'Miembro del equipo') $$;
create function public.ksoft_team_directory() returns jsonb language plpgsql security definer set search_path='' as $$
begin
 if public.ksoft_get_access() is null then raise exception 'FORBIDDEN' using errcode='42501'; end if;
 return coalesce((select jsonb_agg(x order by x->>'name') from (
 select jsonb_build_object('id',user_id,'name',public.ksoft_staff_name(user_id),'role','admin') x from public.ksoft_admins
 union all select jsonb_build_object('id',user_id,'name',display_name,'role',role) from public.ksoft_developers d where active and not exists(select 1 from public.ksoft_admins a where a.user_id=d.user_id)) members),'[]');
end $$;
create function public.ksoft_manage_team(p_user uuid default null,p_name text default null,p_role text default null,p_active boolean default true) returns jsonb language plpgsql security definer set search_path='' as $$
begin
 if not public.ksoft_is_admin() then raise exception 'FORBIDDEN' using errcode='42501'; end if;
 if p_user is not null then
  if p_role is null or p_role not in ('developer','qa','employee') or p_name is null or length(trim(p_name)) not between 2 and 120 or p_active is null or exists(select 1 from public.ksoft_admins where user_id=p_user) then raise exception 'INVALID_EMPLOYEE'; end if;
  perform 1 from public.ksoft_workspace where id for update;
  insert into public.ksoft_developers(user_id,display_name,role,active) values(p_user,trim(p_name),p_role,p_active) on conflict(user_id) do update set display_name=excluded.display_name,role=excluded.role,active=excluded.active,updated_at=clock_timestamp();
  if p_role='employee' or not p_active then delete from public.ksoft_assignments where user_id=p_user; end if;
  update public.ksoft_workspace set revision=revision+1,updated_at=now() where id;
  insert into public.ksoft_audit(actor,action,revision) select auth.uid(),'team:'||p_user,revision from public.ksoft_workspace where id;
 end if;
 return coalesce((select jsonb_agg(x order by x->>'name') from (
 select jsonb_build_object('id',a.user_id,'name',public.ksoft_staff_name(a.user_id),'email',u.email,'role','admin','active',true) x from public.ksoft_admins a join auth.users u on u.id=a.user_id
 union all select jsonb_build_object('id',d.user_id,'name',d.display_name,'email',u.email,'role',d.role,'active',d.active) from public.ksoft_developers d join auth.users u on u.id=d.user_id where not exists(select 1 from public.ksoft_admins a where a.user_id=d.user_id)) members),'[]');
end $$;
create or replace function public.ksoft_list_developers() returns jsonb language plpgsql security definer set search_path='' as $$
begin
 if not public.ksoft_is_admin() then raise exception 'FORBIDDEN' using errcode='42501'; end if;
 return coalesce((select jsonb_agg(jsonb_build_object('id',d.user_id,'name',d.display_name,'email',u.email,'role',d.role) order by d.display_name) from public.ksoft_developers d join auth.users u on u.id=d.user_id where d.active and d.role in ('developer','qa')),'[]');
end $$;
create function public.ksoft_read_staff_workspace() returns jsonb language plpgsql security definer set search_path='' as $$
declare doc jsonb; records jsonb:='{}'; m text;
begin
 if public.ksoft_get_access() is null then raise exception 'FORBIDDEN' using errcode='42501'; end if;
 if public.ksoft_is_developer() then return public.ksoft_read_developer_workspace(); end if;
 if public.ksoft_get_access()->>'role' is distinct from 'employee' then raise exception 'FORBIDDEN'; end if;
 foreach m in array array['requests','payments','expenses','projects','tasks','supports','contacts','clients','quotes','files'] loop records:=records||jsonb_build_object(m,'[]'::jsonb); end loop;
 doc:=jsonb_build_object('version',1,'posts','[]'::jsonb,'products','[]'::jsonb,'publicProjects','[]'::jsonb,'trash','[]'::jsonb,'history','[]'::jsonb,'activity','[]'::jsonb,'workspace',jsonb_build_object('records',records,'readNotifications','[]'::jsonb,'settings',jsonb_build_object('company','Ksoft Technology','owner',public.ksoft_staff_name(auth.uid()),'email',(select email from auth.users where id=auth.uid()),'currency','COP')));
 return jsonb_build_object('document',doc,'revision',(select revision from public.ksoft_workspace where id));
end $$;

create table public.ksoft_tickets(
 id uuid primary key default gen_random_uuid(), number bigint generated always as identity unique,
 creator uuid not null references auth.users(id), assignee uuid not null references auth.users(id),
 subject text not null check(length(subject) between 4 and 160), description text not null check(length(description) between 10 and 5000),
 kind text not null check(kind in ('Consulta','Error','Bloqueo','Mejora')), priority text not null check(priority in ('Baja','Normal','Alta','Urgente')),
 status text not null default 'Abierto' check(status in ('Abierto','En curso','Bloqueado','Resuelto','Cerrado')),
 created_at timestamptz not null default now(),updated_at timestamptz not null default now()
);
create table public.ksoft_ticket_messages(id bigint generated always as identity primary key,ticket_id uuid not null references public.ksoft_tickets(id) on delete cascade,author uuid not null references auth.users(id),body text not null check(length(body) between 1 and 5000),created_at timestamptz not null default now());
create index on public.ksoft_ticket_messages(ticket_id,id);
create index on public.ksoft_tickets(assignee,updated_at desc);
create index on public.ksoft_tickets(creator,updated_at desc);
create table public.ksoft_ticket_reads(ticket_id uuid not null references public.ksoft_tickets(id) on delete cascade,user_id uuid not null references auth.users(id) on delete cascade,last_message bigint not null default 0,primary key(ticket_id,user_id));
alter table public.ksoft_tickets enable row level security;
alter table public.ksoft_ticket_messages enable row level security;
alter table public.ksoft_ticket_reads enable row level security;
revoke all on public.ksoft_tickets,public.ksoft_ticket_messages,public.ksoft_ticket_reads from anon,authenticated;

create function public.ksoft_ticket_list(p_query text default '',p_status text default '',p_offset integer default 0) returns jsonb language plpgsql security definer set search_path='' as $$
declare result jsonb; total integer; unread integer;
begin
 if public.ksoft_get_access() is null then raise exception 'FORBIDDEN' using errcode='42501'; end if;
 if p_offset is null or p_offset<0 or length(p_query)>160 then raise exception 'INVALID_FILTER'; end if;
 select count(*) into unread from public.ksoft_tickets t where (public.ksoft_is_admin() or auth.uid() in (t.creator,t.assignee)) and exists(select 1 from public.ksoft_ticket_messages m where m.ticket_id=t.id and m.author<>auth.uid() and m.id>coalesce((select last_message from public.ksoft_ticket_reads r where r.ticket_id=t.id and r.user_id=auth.uid()),0));
 select count(*) into total from public.ksoft_tickets t where (public.ksoft_is_admin() or auth.uid() in (t.creator,t.assignee)) and (p_status='' or t.status=p_status) and (p_query='' or t.subject ilike '%'||p_query||'%' or t.number::text=p_query);
 select coalesce(jsonb_agg(x order by x->>'updated_at' desc),'[]') into result from (
 select to_jsonb(t)||jsonb_build_object('creator_name',public.ksoft_staff_name(t.creator),'assignee_name',public.ksoft_staff_name(t.assignee),'unread',exists(select 1 from public.ksoft_ticket_messages m where m.ticket_id=t.id and m.author<>auth.uid() and m.id>coalesce((select last_message from public.ksoft_ticket_reads r where r.ticket_id=t.id and r.user_id=auth.uid()),0))) x
 from public.ksoft_tickets t where (public.ksoft_is_admin() or auth.uid() in (t.creator,t.assignee)) and (p_status='' or t.status=p_status) and (p_query='' or t.subject ilike '%'||p_query||'%' or t.number::text=p_query) order by t.updated_at desc limit 50 offset p_offset) page;
 return jsonb_build_object('items',result,'total',total,'unread',unread);
end $$;
create function public.ksoft_ticket_detail(p_id uuid) returns jsonb language plpgsql security definer set search_path='' as $$
declare ticket public.ksoft_tickets; messages jsonb;
begin
 if public.ksoft_get_access() is null then raise exception 'FORBIDDEN' using errcode='42501'; end if;
 select * into ticket from public.ksoft_tickets where id=p_id for update;
 if ticket.id is null or not(public.ksoft_is_admin() or auth.uid() in (ticket.creator,ticket.assignee)) then raise exception 'FORBIDDEN' using errcode='42501'; end if;
 select coalesce(jsonb_agg(to_jsonb(m)||jsonb_build_object('author_name',public.ksoft_staff_name(m.author)) order by m.id),'[]') into messages from public.ksoft_ticket_messages m where ticket_id=p_id;
 insert into public.ksoft_ticket_reads values(p_id,auth.uid(),coalesce((select max(id) from public.ksoft_ticket_messages where ticket_id=p_id),0)) on conflict(ticket_id,user_id) do update set last_message=excluded.last_message;
 return jsonb_build_object('ticket',to_jsonb(ticket)||jsonb_build_object('creator_name',public.ksoft_staff_name(ticket.creator),'assignee_name',public.ksoft_staff_name(ticket.assignee)),'messages',messages);
end $$;
create function public.ksoft_ticket_create(p_subject text,p_description text,p_assignee uuid,p_kind text,p_priority text) returns uuid language plpgsql security definer set search_path='' as $$
declare ticket uuid;
begin
 if public.ksoft_get_access() is null then raise exception 'FORBIDDEN' using errcode='42501'; end if;
 if p_assignee is null or not exists(select 1 from jsonb_array_elements(public.ksoft_team_directory()) x where x->>'id'=p_assignee::text) then raise exception 'INVALID_RECIPIENT'; end if;
 insert into public.ksoft_tickets(creator,assignee,subject,description,kind,priority) values(auth.uid(),p_assignee,trim(p_subject),trim(p_description),p_kind,p_priority) returning id into ticket;
 insert into public.ksoft_ticket_messages(ticket_id,author,body) values(ticket,auth.uid(),'Ticket creado: '||trim(p_subject));
 return ticket;
end $$;
create function public.ksoft_ticket_update(p_id uuid,p_body text default '',p_status text default null,p_assignee uuid default null) returns void language plpgsql security definer set search_path='' as $$
declare ticket public.ksoft_tickets; changes text:='';
begin
 if public.ksoft_get_access() is null then raise exception 'FORBIDDEN' using errcode='42501'; end if;
 select * into ticket from public.ksoft_tickets where id=p_id for update;
 if ticket.id is null or not(public.ksoft_is_admin() or auth.uid() in (ticket.creator,ticket.assignee)) then raise exception 'FORBIDDEN' using errcode='42501'; end if;
 if p_status is not null and p_status<>ticket.status then
  if not(public.ksoft_is_admin() or auth.uid()=ticket.assignee or (auth.uid()=ticket.creator and p_status in ('Abierto','Cerrado'))) then raise exception 'FORBIDDEN_STATUS'; end if;
  update public.ksoft_tickets set status=p_status where id=p_id;
  changes:='Estado: '||p_status||'. ';
 end if;
 if p_assignee is not null and p_assignee<>ticket.assignee then
  if not(public.ksoft_is_admin() or auth.uid()=ticket.assignee) then raise exception 'FORBIDDEN_ASSIGNMENT'; end if;
  if not exists(select 1 from jsonb_array_elements(public.ksoft_team_directory()) x where x->>'id'=p_assignee::text) then raise exception 'INVALID_RECIPIENT'; end if;
  update public.ksoft_tickets set assignee=p_assignee where id=p_id;
  changes:=changes||'Asignado a '||public.ksoft_staff_name(p_assignee)||'. ';
 end if;
 if length(trim(coalesce(p_body,'')))>5000 then raise exception 'INVALID_MESSAGE'; end if;
 if changes<>'' then insert into public.ksoft_ticket_messages(ticket_id,author,body) values(p_id,auth.uid(),changes); end if;
 if trim(coalesce(p_body,''))<>'' then insert into public.ksoft_ticket_messages(ticket_id,author,body) values(p_id,auth.uid(),trim(p_body)); end if;
 if changes<>'' or trim(coalesce(p_body,''))<>'' then update public.ksoft_tickets set updated_at=clock_timestamp() where id=p_id; end if;
end $$;

-- Only authenticated users may call entry points; helpers remain private.
revoke all on function public.ksoft_staff_name(uuid) from public,anon,authenticated;
revoke all on function public.ksoft_team_directory(),public.ksoft_manage_team(uuid,text,text,boolean),public.ksoft_read_staff_workspace(),public.ksoft_ticket_list(text,text,integer),public.ksoft_ticket_detail(uuid),public.ksoft_ticket_create(text,text,uuid,text,text),public.ksoft_ticket_update(uuid,text,text,uuid) from public,anon;
grant execute on function public.ksoft_team_directory(),public.ksoft_manage_team(uuid,text,text,boolean),public.ksoft_read_staff_workspace(),public.ksoft_ticket_list(text,text,integer),public.ksoft_ticket_detail(uuid),public.ksoft_ticket_create(text,text,uuid,text,text),public.ksoft_ticket_update(uuid,text,text,uuid) to authenticated;
commit;
