import type {AdminData} from '../adminModel';
import type {BusinessRecord} from '../businessModel';
import {projectType} from '../businessModel.ts';

const prefix='@product:';
export function productTaskTarget(data:AdminData,productId:string):string {
 if(!data.products.some(product=>product.id===productId))throw new Error('El SaaS seleccionado ya no está disponible.');
 return data.workspace.records.projects.find(project=>project.values.productId===productId)?.id??prefix+productId;
}
export function taskTargets(data:AdminData){
 const projects=data.workspace.records.projects;
 return [
  ...projects.map(project=>({id:project.id,name:project.values.name,type:projectType(project.values)})),
  ...data.products.filter(product=>!projects.some(project=>project.values.productId===product.id)).map(product=>({id:prefix+product.id,name:product.name,type:'SaaS propio'})),
 ];
}
/** Materialize a product's work area and its task in the same workspace save. */
export function prepareTaskWorkspace(data:AdminData,input:BusinessRecord):AdminData {
 const task=structuredClone(input);
 let projects=data.workspace.records.projects;
 let trash=data.trash;
 const target=task.values.project;
 if(target&&!projects.some(project=>project.id===target)&&target.startsWith(prefix)){
  const productId=target.slice(prefix.length),product=data.products.find(product=>product.id===productId);
  if(!product)throw new Error('El SaaS seleccionado ya no está disponible.');
  let project=projects.find(project=>project.values.productId===productId);
  if(!project){
   const archived=data.trash?.find(entry=>entry.module==='projects'&&'values' in entry.payload&&entry.payload.values.productId===productId);
   if(archived&&'values' in archived.payload){project=structuredClone(archived.payload);trash=data.trash?.filter(entry=>entry.id!==archived.id);}
   else {const now=new Date().toISOString();project={id:crypto.randomUUID(),createdAt:now,updatedAt:now,values:{name:product.name,type:'SaaS propio',productId:product.id,client:'',quote:'',status:'Planificado',progress:'',start:'',due:'',scope:'Desarrollo y mantenimiento de '+product.name+'.',notes:''}};}
   projects=[...projects,project];
  }
  task.values.project=project.id;
 }
 const tasks=data.workspace.records.tasks;
 return {...data,...(trash?{trash}:{}),workspace:{...data.workspace,records:{...data.workspace.records,projects,tasks:tasks.some(item=>item.id===task.id)?tasks.map(item=>item.id===task.id?task:item):[task,...tasks]}}};
}
