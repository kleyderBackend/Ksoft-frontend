import { requireSupabase } from "../../../lib/supabase";
import { parseAdminData } from "../adminModel";
import type { AdminData } from "../adminModel";
import type {DashboardRole} from "../accessContext";
import type {SaveOptions} from "../AdminContext";

export interface CloudWorkspace { data: AdminData | null; revision: number }
export async function loadCloudWorkspace(role:DashboardRole="admin"): Promise<CloudWorkspace> {
  const {data,error} = await requireSupabase().rpc(role==="admin"?"ksoft_read_workspace":"ksoft_read_staff_workspace");
  if(error) throw new Error("No se pudo cargar el panel. Comprueba tu conexión y el acceso de tu cuenta.");
  return {revision:data.revision,data:data.document ? parseAdminData(JSON.stringify(data.document)) : null};
}
export async function saveCloudWorkspace(document: AdminData, revision: number,role:DashboardRole="admin",options?:SaveOptions): Promise<number> {
  const {data,error} = await requireSupabase().rpc(role==="admin"?"ksoft_commit_workspace":"ksoft_save_developer_workspace",{document,expected_revision:revision,...(role==="admin"?{p_module:options?.publication?.module??null,p_id:options?.publication?.id??null,p_action:options?.publication?.action??null}:{})});
  if(error) throw new Error(error.message.includes("CONFLICT") ? "Los datos cambiaron en otra pestaña o llegó una solicitud. Exporta tus cambios y recarga antes de guardar." : "No se pudo guardar los cambios. Tus cambios siguen en el formulario.");
  return Number(data);
}
export async function publishCloudSite(revision:number) {
  const {error}=await requireSupabase().rpc("ksoft_publish_site",{expected_revision:revision});
  if(error) throw new Error(error.message.includes("CONFLICT")?"Recarga el panel antes de publicar: hay cambios más recientes.":"No se pudo publicar. Revisa los permisos y la conexión.");
}
