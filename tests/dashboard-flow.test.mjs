import assert from 'node:assert/strict';
import {test} from 'node:test';
import {emptyWorkspace,quoteTotals,validateRecord} from '../src/Components/dashboards/businessModel.ts';
import {parseAdminData} from '../src/Components/dashboards/adminModel.ts';
import {newBusinessRecord,requestToContact,contactToClient,acceptedQuoteToProject} from '../src/Components/dashboards/models/businessFlowModel.ts';
const record=(id,values)=>({id,values,createdAt:'2026-10-23T12:00:00Z',updatedAt:'2026-10-23T12:00:00Z'});
const base=()=>({version:1,posts:[],products:[],workspace:emptyWorkspace(),activity:[]});
function quoteData(){const data=base();data.workspace.records.clients=[record('c',{name:'Cliente',email:'c@example.test',status:'Activo'})];data.workspace.records.quotes=[record('q',{name:'Sitio web',client:'c',amount:'500',date:'2026-10-23',status:'Aceptada',scope:'Diseño y desarrollo'})];return data;}
test('request to contact to client retains the original links and prevents duplicates',()=>{
  let data=base();data.workspace.records.requests=[record('r',{name:'Carlos',email:'carlos@example.test',purpose:'Participación en piloto',product:'saas-dental',date:'2026-10-23',status:'Nueva',message:'Me interesa el piloto'})];
  data=requestToContact(data,'r');data=requestToContact(data,'r');
  assert.equal(data.workspace.records.contacts.length,1);
  const contact=data.workspace.records.contacts[0];assert.equal(data.workspace.records.requests[0].values.contact,contact.id);
  data=contactToClient(data,contact.id);data=contactToClient(data,contact.id);
  assert.equal(data.workspace.records.clients.length,1);
  assert.equal(data.workspace.records.contacts[0].values.client,data.workspace.records.clients[0].id);
  assert.doesNotThrow(()=>parseAdminData(JSON.stringify(data)));
});
test('an accepted quote creates one linked project and prefilled task and file forms',()=>{
  let data=quoteData();data=acceptedQuoteToProject(data,'q');
  const project=data.workspace.records.projects[0];assert.equal(project.values.quote,'q');assert.equal(project.values.client,'c');
  assert.throws(()=>acceptedQuoteToProject(data,'q'),/ya tiene un proyecto/);
  assert.equal(newBusinessRecord(data,'tasks','?project='+project.id).values.project,project.id);
  assert.equal(newBusinessRecord(data,'files','?project='+project.id).values.project,project.id);
  assert.doesNotThrow(()=>parseAdminData(JSON.stringify(data)));
});
test('payment suggestions subtract paid and pending amounts and reject over-allocation',()=>{
  const data=quoteData();data.workspace.records.payments=[record('paid',{name:'Abono',client:'c',quote:'q',amount:'100',date:'2026-10-23',status:'Pagado'}),record('pending',{name:'Saldo parcial',client:'c',quote:'q',amount:'50',date:'2026-10-23',status:'Pendiente'})];
  assert.deepEqual(quoteTotals(data.workspace,'q'),{total:500,paid:100,pending:50,balance:400,unallocated:350});
  const form=newBusinessRecord(data,'payments','?quote=q');assert.equal(form.values.client,'c');assert.equal(form.values.amount,'350');
  assert.equal(validateRecord('payments',form.values,data.workspace,form.id),'');
  assert.match(validateRecord('payments',{...form.values,amount:'351'},data.workspace,form.id),/superan/);
});
test('deep links only select existing relations and never inject financial amounts',()=>{
  const data=quoteData();
  assert.throws(()=>newBusinessRecord(data,'quotes','?client=missing'),/ya no existe/);
  assert.equal(newBusinessRecord(data,'quotes','?client=c&amount=9999').values.amount,'');
});
test('old workspaces gain an empty request inbox without changing existing records',()=>{
  const data=quoteData();delete data.workspace.records.requests;
  const restored=parseAdminData(JSON.stringify(data));
  assert.deepEqual(restored.workspace.records.requests,[]);
  assert.equal(restored.workspace.records.quotes[0].id,'q');
});
