import {pilotFields,pilotPurpose} from "./pilotRequests.ts";
import type { AdminData } from "../adminModel";
import type { BusinessRecord,ModuleKey } from "../businessModel";
import { modules,quoteTotals } from "../businessModel.ts";
import {productTaskTarget,taskTargets} from './taskTargets.ts';
export function newBusinessRecord(data: AdminData,module: ModuleKey,search="",today=new Date().toLocaleDateString("en-CA")): BusinessRecord {
  const params=new URLSearchParams(search),now=new Date().toISOString();
  const values: Record<string,string>=Object.fromEntries(modules[module].fields.map(field=>[field.key,field.options?.[0]||(field.key==="date"?today:"")]));
  for(const field of modules[module].fields){
    if(!field.relation) continue;
    const id=params.get(field.key);
    if(!id) continue;
    const related=module==="tasks"&&field.key==="project"?taskTargets(data).find(record=>record.id===id):data.workspace.records[field.relation].find(record=>record.id===id);
    if(!related) throw new Error("El registro relacionado ya no existe. Revisa la relación antes de continuar.");
    values[field.key]=id;
  }
  if(module==="requests"){for(const field of pilotFields)values[field.key]="";if(values.purpose===pilotPurpose)values.pilotStatus="Solicitado";}
  if(module==="tasks"&&params.get('productId'))values.project=productTaskTarget(data,params.get('productId')!);
  if(module==="projects"){
    values.progress="";
    if(values.client||values.quote)values.type="Cliente";
    else if(params.get("type")){if(!modules.projects.fields.find(field=>field.key==="type")!.options!.includes(params.get("type")!))throw new Error("El tipo de proyecto no es válido.");values.type=params.get("type")!;}
    const productId=params.get("productId");
    if(productId){const product=data.products.find(item=>item.id===productId);if(!product)throw new Error("El producto ya no está disponible.");if(values.client||values.quote)throw new Error("Un SaaS propio no se vincula a una cotización de cliente.");values.type="SaaS propio";values.productId=product.id;values.name=product.name;}
  }
  if(module==="payments"&&values.quote){
    const quote=data.workspace.records.quotes.find(record=>record.id===values.quote)!;
    values.client=quote.values.client;values.name="Cobro: "+quote.values.name;
    const totals=quoteTotals(data.workspace,quote.id);
    values.amount=totals.unallocated>0?String(totals.unallocated):"";
  }
  if(module==="projects"&&values.quote){
    const quote=data.workspace.records.quotes.find(record=>record.id===values.quote)!;
    values.client=quote.values.client;values.scope=quote.values.scope;values.name=quote.values.name;values.progress="";
  }
  return {id:crypto.randomUUID(),values,createdAt:now,updatedAt:now};
}
export function requestToContact(data: AdminData,id: string): AdminData {
  const request=data.workspace.records.requests.find(record=>record.id===id);
  if(!request) throw new Error("La solicitud ya no existe.");
  const existing=data.workspace.records.contacts.find(record=>record.values.email.toLowerCase()===request.values.email.toLowerCase());
  if(!existing && data.trash?.some(entry=>entry.module==="contacts"&&"values" in entry.payload&&entry.payload.values.email?.toLowerCase()===request.values.email.toLowerCase())) throw new Error("Ese contacto está en la papelera. Restáuralo antes de asociarlo.");
  const now=new Date().toISOString();
  const contact=existing??{id:crypto.randomUUID(),values:{name:request.values.name,email:request.values.email,company:request.values.company||"",phone:request.values.phone||"",source:"Web",status:"Nuevo",notes:request.values.message||""},createdAt:now,updatedAt:now};
  return {...data,workspace:{...data.workspace,records:{...data.workspace.records,contacts:existing?data.workspace.records.contacts:[contact,...data.workspace.records.contacts],requests:data.workspace.records.requests.map(record=>record.id===id?{...record,values:{...record.values,contact:contact.id,status:"En seguimiento"},updatedAt:now}:record)}}};
}
export function contactToClient(data: AdminData,id: string): AdminData {
  const contact=data.workspace.records.contacts.find(record=>record.id===id);
  if(!contact) throw new Error("El contacto ya no existe.");
  const existing=data.workspace.records.clients.find(record=>record.values.email.toLowerCase()===contact.values.email.toLowerCase());
  if(!existing && data.trash?.some(entry=>entry.module==="clients"&&"values" in entry.payload&&entry.payload.values.email?.toLowerCase()===contact.values.email.toLowerCase())) throw new Error("Ese cliente está en la papelera. Restáuralo antes de convertir el contacto.");
  const now=new Date().toISOString();
  const client=existing??{id:crypto.randomUUID(),values:{name:contact.values.name,company:contact.values.company||"",email:contact.values.email,phone:contact.values.phone||"",status:"Activo",notes:contact.values.notes||""},createdAt:now,updatedAt:now};
  return {...data,workspace:{...data.workspace,records:{...data.workspace.records,clients:existing?data.workspace.records.clients:[client,...data.workspace.records.clients],contacts:data.workspace.records.contacts.map(record=>record.id===id?{...record,values:{...record.values,client:client.id,status:"Convertido"},updatedAt:now}:record)}}};
}
export function acceptedQuoteToProject(data: AdminData,id: string): AdminData {
  const quote=data.workspace.records.quotes.find(record=>record.id===id);
  if(!quote||quote.values.status!=="Aceptada") throw new Error("Primero marca la cotización como aceptada.");
  if(data.workspace.records.projects.some(record=>record.values.quote===id)) throw new Error("Esta cotización ya tiene un proyecto. Puedes abrirlo desde los registros relacionados.");
  if(data.trash?.some(entry=>entry.module==="projects"&&"values" in entry.payload&&entry.payload.values.quote===id)) throw new Error("El proyecto de esta cotización está en la papelera. Restáuralo para continuar.");
  const project=newBusinessRecord(data,"projects","?quote="+encodeURIComponent(id));
  return {...data,workspace:{...data.workspace,records:{...data.workspace.records,projects:[project,...data.workspace.records.projects]}}};
}

