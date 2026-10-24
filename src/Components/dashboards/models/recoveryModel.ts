import type { AdminData, Post, Product } from "../adminModel";
import type { BusinessRecord, ModuleKey } from "../businessModel";
import { moduleKeys } from "../businessModel.ts";

export type EntityModule = ModuleKey | "posts" | "products" | "publicProjects";
export interface TrashEntry {
  id: string; module: EntityModule; entityId: string; title: string; deletedAt: string;
  payload: Post | Product | BusinessRecord;
}
export interface HistoryEntry {
  id: string; module: EntityModule | "settings"; entityId: string; title: string; date: string;
  action: "created" | "updated" | "trashed" | "restored" | "removed";
  changes: {field: string; before: string; after: string}[];
}
export const HISTORY_LIMIT = 100;
export const entityModules: EntityModule[] = [...moduleKeys,"posts","products","publicProjects"];
export const entityNames: Record<EntityModule | "settings",string> = {
  payments:"Pagos", expenses:"Gastos", projects:"Proyectos", tasks:"Tareas", supports:"Soporte",
  contacts:"Contactos", clients:"Clientes", quotes:"Cotizaciones", files:"Archivos", requests:"Solicitudes",
  posts:"Publicaciones", products:"Productos", publicProjects:"Proyectos públicos", settings:"Configuración",
};
export function getEntities(data: AdminData, module: EntityModule): (Post | Product | BusinessRecord)[] {
  if (module==="posts") return data.posts;
  if (module==="products") return data.products;
  if (module==="publicProjects") return data.publicProjects??[];
  return data.workspace.records[module];
}
export function entityTitle(item: Post | Product | BusinessRecord): string {
  return "values" in item ? item.values.name : "title" in item ? item.title : item.name;
}
export function replaceEntities(data: AdminData,module: EntityModule,items: (Post | Product | BusinessRecord)[]): AdminData {
  if(module==="posts") return {...data,posts:items as Post[]};
  if(module==="products") return {...data,products:items as Product[]};
  if(module==="publicProjects") return {...data,publicProjects:items as Product[]};
  return {...data,workspace:{...data.workspace,records:{...data.workspace.records,[module]:items as BusinessRecord[]}}};
}
function isObject(value: unknown): value is Record<string,unknown> {return !!value && typeof value==="object" && !Array.isArray(value);}
export function assertRecoveryShape(data: AdminData) {
  if(data.trash!==undefined){
    if(!Array.isArray(data.trash)) throw new Error("Papelera inválida");
    const ids=new Set<string>();
    for(const entry of data.trash){
      if(!entry || typeof entry.id!=="string" || ids.has(entry.id) || !entityModules.includes(entry.module) || typeof entry.entityId!=="string" || typeof entry.title!=="string" || typeof entry.deletedAt!=="string" || !Number.isFinite(Date.parse(entry.deletedAt)) || !isObject(entry.payload) || entry.payload.id!==entry.entityId) throw new Error("Registro de papelera inválido");
      ids.add(entry.id);
      const item=entry.payload;
      if(["posts","products","publicProjects"].includes(entry.module)){
        if(typeof ("title" in item?item.title:item.name)!=="string" || typeof item.slug!=="string") throw new Error("Contenido de papelera inválido");
      } else if(!isObject(item.values) || Object.values(item.values).some(value=>typeof value!=="string") || typeof item.createdAt!=="string" || typeof item.updatedAt!=="string") throw new Error("Registro de papelera inválido");
    }
  }
  if(data.history!==undefined){
    if(!Array.isArray(data.history) || data.history.length>HISTORY_LIMIT) throw new Error("Historial inválido");
    const ids=new Set<string>();
    for(const event of data.history){
      if(!event || typeof event.id!=="string" || ids.has(event.id) || ![...entityModules,"settings"].includes(event.module) || typeof event.entityId!=="string" || typeof event.title!=="string" || typeof event.date!=="string" || !Number.isFinite(Date.parse(event.date)) || !["created","updated","trashed","restored","removed"].includes(event.action) || !Array.isArray(event.changes) || event.changes.some(change=>!change || ["field","before","after"].some(key=>typeof change[key as keyof typeof change]!=="string"))) throw new Error("Evento de historial inválido");
      ids.add(event.id);
    }
  }
}
const labels: Record<string,string> = {values:"Datos",name:"Nombre",title:"Título",description:"Descripción",status:"Estado",amount:"Valor",client:"Cliente",quote:"Cotización",project:"Proyecto",contact:"Contacto",email:"Correo",phone:"Teléfono",due:"Fecha límite",progress:"Avance",scope:"Alcance",resolution:"Solución",presentation:"Presentación",sections:"Secciones",images:"Capturas",items:"Elementos",summary:"Resumen",content:"Contenido",logo:"Logo",base64:"Archivo",visibility:"Visibilidad",editorialStatus:"Estado editorial",settings:"Configuración"};
function summarize(value: unknown): string {
  if(value===undefined || value===null || value==="") return "—";
  const text=typeof value==="string"?value:JSON.stringify(value);
  if(text.startsWith("data:image/") || text.length>2000 && /^[a-zA-Z0-9+/=]+$/.test(text)){
    let hash=2166136261; for(let index=0;index<text.length;index++) hash=Math.imul(hash^text.charCodeAt(index),16777619);
    return "Archivo local · " + Math.round(text.length*0.75/1024) + " KB · " + (hash>>>0).toString(16);
  }
  return text.length>240?text.slice(0,237)+"…":text;
}
function changesBetween(before: unknown,after: unknown,path: string[]=[],out: HistoryEntry["changes"]=[]) {
  if(JSON.stringify(before)===JSON.stringify(after) || out.length>=30) return out;
  if(isObject(before) && isObject(after)){
    for(const key of new Set([...Object.keys(before),...Object.keys(after)])) if(!["updatedAt","createdAt","id"].includes(key)) changesBetween(before[key],after[key],[...path,key],out);
  } else if(Array.isArray(before)&&Array.isArray(after)){
    for(let index=0;index<Math.max(before.length,after.length)&&out.length<30;index++) changesBetween(before[index],after[index],[...path,String(index)],out);
  } else out.push({field:path.map(key=>/^\d+$/.test(key)?String(Number(key)+1):labels[key]??key).join(" › ")||"Registro",before:summarize(before),after:summarize(after)});
  return out;
}
export function trackChanges(previous: AdminData,next: AdminData): HistoryEntry[] {
  const events: HistoryEntry[]=[];
  const date=new Date().toISOString();
  for(const module of entityModules){
    const old=new Map(getEntities(previous,module).map(item=>[item.id,item]));
    const current=new Map(getEntities(next,module).map(item=>[item.id,item]));
    for(const [id,item] of current){
      const before=old.get(id);
      const changes=before?changesBetween(before,item):[];
      if(!before||changes.length) events.push({id:crypto.randomUUID(),module,entityId:id,title:entityTitle(item),date,action:before?"updated":previous.trash?.some(entry=>entry.module===module&&entry.entityId===id)?"restored":"created",changes});
    }
    for(const [id,item] of old) if(!current.has(id)) events.push({id:crypto.randomUUID(),module,entityId:id,title:entityTitle(item),date,action:next.trash?.some(entry=>entry.module===module&&entry.entityId===id)?"trashed":"removed",changes:[]});
  }
  const changes=changesBetween(previous.workspace.settings,next.workspace.settings);
  for(const entry of previous.trash??[]) if(!next.trash?.some(item=>item.id===entry.id)&&!getEntities(next,entry.module).some(item=>item.id===entry.entityId)) events.push({id:crypto.randomUUID(),module:entry.module,entityId:entry.entityId,title:entry.title,date,action:"removed",changes:[{field:"Papelera",before:"Registro recuperable",after:"Eliminado definitivamente"}]});
  if(changes.length) events.push({id:crypto.randomUUID(),module:"settings",entityId:"settings",title:"Datos de la empresa",date,action:"updated",changes});
  return events;
}

