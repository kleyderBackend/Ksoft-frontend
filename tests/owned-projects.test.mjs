import assert from 'node:assert/strict';
import {test} from 'node:test';
import {products} from '../src/config/products.ts';
import {normalizeProduct,parseAdminData} from '../src/Components/dashboards/adminModel.ts';
import {emptyWorkspace,validateRecord,projectType} from '../src/Components/dashboards/businessModel.ts';
import {newBusinessRecord} from '../src/Components/dashboards/models/businessFlowModel.ts';
import {moveToTrash} from '../src/Components/dashboards/models/recoveryActions.ts';
import {taskTargets,prepareTaskWorkspace,productTaskTarget} from '../src/Components/dashboards/models/taskTargets.ts';
const base=()=>({version:1,posts:[],activity:[],workspace:emptyWorkspace(),products:products.map(product=>normalizeProduct({...product,id:product.slug,logo:product.logo??'',editorialStatus:'draft',updatedAt:''}))});
test('registered SaaS are task targets even when there are no internal projects',()=>{
 const data=base();assert.equal(data.workspace.records.projects.length,0);
 const targets=taskTargets(data);assert.deepEqual(targets.map(target=>target.name),data.products.map(product=>product.name));
 for(const product of data.products){
  const task=newBusinessRecord(data,'tasks','?productId='+product.id);task.values.name='Revisar funcionalidades';
  assert.equal(task.values.project,productTaskTarget(data,product.id));
  const next=prepareTaskWorkspace(data,task);const project=next.workspace.records.projects[0];
  assert.equal(project.values.productId,product.id);assert.equal(next.workspace.records.tasks[0].values.project,project.id);
  assert.doesNotThrow(()=>parseAdminData(JSON.stringify(next)));assert.equal(data.workspace.records.projects.length,0);
  const second=newBusinessRecord(next,'tasks','?productId='+product.id);second.values.name='Revisar accesos';
  assert.equal(second.values.project,project.id);
  assert.equal(prepareTaskWorkspace(next,second).workspace.records.projects.length,1);
  assert.equal(taskTargets(next).filter(target=>target.name===product.name).length,1);
 }
});
test('a stale SaaS target reuses its existing project and archived work areas retain identity',()=>{
 const data=base(),product=data.products[0],task=newBusinessRecord(data,'tasks','?productId='+product.id);task.values.name='Validar agenda';
 const withProject=prepareTaskWorkspace(data,task),project=withProject.workspace.records.projects[0];
 const reused=prepareTaskWorkspace(withProject,{...task,id:'second-task'});assert.equal(reused.workspace.records.projects.length,1);assert.equal(reused.workspace.records.tasks[0].values.project,project.id);
 const empty={...withProject,workspace:{...withProject.workspace,records:{...withProject.workspace.records,tasks:[]}}};
 const archived=moveToTrash(empty,'projects',project.id).next;
 const restored=prepareTaskWorkspace(archived,task);assert.equal(restored.workspace.records.projects[0].id,project.id);assert.equal(restored.trash.length,0);
 assert.throws(()=>prepareTaskWorkspace({...data,products:[]},task),/ya no está disponible/);
});
test('owned SaaS development links to a product and creates task forms without a client or quote',()=>{
 const data=base(),product=data.products[0];
 const project=newBusinessRecord(data,'projects','?productId='+product.id);
 Object.assign(project.values,{scope:'Preparar el piloto y sus funcionalidades.'});
 assert.equal(project.values.type,'SaaS propio');assert.equal(project.values.productId,product.id);assert.equal(project.values.name,product.name);
 assert.equal(project.values.client,'');assert.equal(project.values.quote,'');
 assert.equal(validateRecord('projects',project.values,data.workspace,project.id),'');
 data.workspace.records.projects.push(project);
 const task=newBusinessRecord(data,'tasks','?project='+project.id);Object.assign(task.values,{name:'Validar el registro de usuarios'});
 data.workspace.records.tasks.push(task);
 const restored=parseAdminData(JSON.stringify(data));assert.equal(restored.workspace.records.tasks[0].values.project,project.id);assert.equal(restored.workspace.records.projects[0].values.productId,product.id);
 assert.throws(()=>moveToTrash(data,'products',product.id),/desarrollo vinculados/);
 assert.throws(()=>newBusinessRecord(data,'projects','?productId=unknown'),/ya no está disponible/);
});
test('internal initiatives and customer projects retain distinct business rules and legacy classification',()=>{
 const data=base(),project=newBusinessRecord(data,'projects','?type=Proyecto%20propio');Object.assign(project.values,{name:'Portal de Ksoft',scope:'Mejorar las herramientas internas.'});
 assert.equal(validateRecord('projects',project.values,data.workspace),'');
 assert.match(validateRecord('projects',{...project.values,type:'Cliente'},data.workspace),/cliente/);
 assert.match(validateRecord('projects',{...project.values,client:'missing'},data.workspace),/relacionado/);
 assert.match(validateRecord('projects',{...project.values,productId:data.products[0].id},data.workspace),/SaaS/);
 assert.equal(projectType({client:'legacy'}),'Cliente');assert.equal(projectType({}),'Proyecto propio');
 data.workspace.records.projects.push(project);data.workspace.records.projects[0].values.productId='missing';data.workspace.records.projects[0].values.type='SaaS propio';
 assert.throws(()=>parseAdminData(JSON.stringify(data)),/producto vinculado/);
});
