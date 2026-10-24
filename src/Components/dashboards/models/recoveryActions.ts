import type { AdminData } from "../adminModel";
import { parseAdminData,validateContent } from "../adminModel.ts";
import { referencedBy,validateRecord } from "../businessModel.ts";
import type { BusinessRecord,ModuleKey } from "../businessModel";
import { entityTitle,getEntities,replaceEntities } from "./recoveryModel.ts";
import type { EntityModule } from "./recoveryModel";
export function moveToTrash(data: AdminData,module: EntityModule,id: string) {
  const items=getEntities(data,module),item=items.find(record=>record.id===id);
  if(!item) throw new Error("El registro ya no existe.");
  if("values" in item){
    const references=referencedBy(data.workspace,module as ModuleKey,id);
    if(references.length) throw new Error("Antes de archivarlo, cambia sus relaciones: "+references.join("; ")+".");
  }
  const entry={id:crypto.randomUUID(),module,entityId:id,title:entityTitle(item),deletedAt:new Date().toISOString(),payload:structuredClone(item)};
  const next=replaceEntities(data,module,items.filter(record=>record.id!==id));
  return {next:{...next,trash:[entry,...(data.trash??[])]},entry};
}
export function restoreFromTrash(data: AdminData,trashId: string): AdminData {
  const entry=data.trash?.find(item=>item.id===trashId);
  if(!entry) throw new Error("El registro ya no está en la papelera.");
  const items=getEntities(data,entry.module);
  if(items.some(item=>item.id===entry.entityId)) throw new Error("Ya existe un registro con ese identificador.");
  const payload=structuredClone(entry.payload);
  const error="values" in payload?validateRecord(entry.module as ModuleKey,payload.values,data.workspace,payload.id):validateContent(payload,entry.module==="posts"?data.posts:[...data.products,...(data.publicProjects??[])]);
  if(error) throw new Error(error+" Restaura primero sus registros relacionados si corresponde.");
  const next=replaceEntities(data,entry.module,[payload as BusinessRecord,...items]);
  return parseAdminData(JSON.stringify({...next,trash:data.trash?.filter(item=>item.id!==trashId)}));
}

