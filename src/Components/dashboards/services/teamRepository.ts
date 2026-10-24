import {requireSupabase} from '../../../lib/supabase';
import type {DashboardRole} from '../accessContext';
export interface TeamMember {id:string;name:string;role:DashboardRole;email?:string;active?:boolean}
export interface Ticket {id:string;number:number;creator:string;assignee:string;creator_name:string;assignee_name:string;subject:string;description:string;kind:string;priority:string;status:string;updated_at:string;unread?:boolean}
export interface TicketMessage {id:number;author:string;author_name:string;body:string;created_at:string}
export interface TicketDetail {ticket:Ticket;messages:TicketMessage[]}
export async function teamRpc<T>(name:string,args?:Record<string,unknown>):Promise<T>{
 const {data,error}=await requireSupabase().rpc(name,args);
 if(error)throw new Error(error.message.includes('FORBIDDEN')?'Tu cuenta no tiene permiso para esta acción. Actualiza la página si tu rol cambió.':'No se pudo completar la operación. Revisa los datos y tu conexión.');
 return data as T;
}
export function ticketChanged(){window.dispatchEvent(new Event('ksoft:tickets-changed'));}
