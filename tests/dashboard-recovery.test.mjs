import assert from 'node:assert/strict';
import {test} from 'node:test';
import {emptyWorkspace} from '../src/Components/dashboards/businessModel.ts';
import {parseAdminData,normalizeProduct} from '../src/Components/dashboards/adminModel.ts';
import {moveToTrash,restoreFromTrash} from '../src/Components/dashboards/models/recoveryActions.ts';
import {trackChanges,HISTORY_LIMIT} from '../src/Components/dashboards/models/recoveryModel.ts';
import {products} from '../src/config/products.ts';
const record=(id,values)=>({id,values,createdAt:'2026-10-23T12:00:00Z',updatedAt:'2026-10-23T12:00:00Z'});
const base=()=>({version:1,posts:[],products:[],workspace:emptyWorkspace(),activity:[]});
test('archiving and restoring retains record identity and original values',()=>{
  const data=base(),client=record('c',{name:'Cliente',email:'cliente@example.test',status:'Activo'});
  data.workspace.records.clients=[client];
  const archived=moveToTrash(data,'clients','c');
  assert.equal(data.workspace.records.clients.length,1);
  assert.equal(archived.next.workspace.records.clients.length,0);
  const restored=restoreFromTrash(parseAdminData(JSON.stringify(archived.next)),archived.entry.id);
  assert.deepEqual(restored.workspace.records.clients[0],client);
  assert.equal(restored.trash.length,0);
});
test('active relationships prevent archiving a parent record',()=>{
  const data=base();data.workspace.records.clients=[record('c',{name:'Cliente',email:'c@example.test',status:'Activo'})];
  data.workspace.records.quotes=[record('q',{name:'Web',client:'c',amount:'500',date:'2026-10-23',status:'Aceptada',scope:'Sitio web'})];
  assert.throws(()=>moveToTrash(data,'clients','c'),/relaciones/);
  assert.equal(data.workspace.records.clients.length,1);
});
test('restoration rejects duplicate emails without losing the trashed copy',()=>{
  const data=base();data.workspace.records.clients=[record('c',{name:'Cliente',email:'c@example.test',status:'Activo'})];
  const archived=moveToTrash(data,'clients','c');
  archived.next.workspace.records.clients=[record('other',{name:'Otro',email:'c@example.test',status:'Activo'})];
  assert.throws(()=>restoreFromTrash(archived.next,archived.entry.id),/Ya existe/);
  assert.equal(archived.next.trash.length,1);
});
test('attachments and complete public presentations survive trash and backup restoration',()=>{
  const data=base();
  data.workspace.records.files=[record('f',{name:'Documento',filename:'documento.txt',base64:'aA==',size:'1'})];
  data.products=[normalizeProduct({...products[1],id:'travel',logo:products[1].logo,editorialStatus:'draft',updatedAt:''})];
  let archived=moveToTrash(data,'files','f');
  let restored=restoreFromTrash(parseAdminData(JSON.stringify(archived.next)),archived.entry.id);
  assert.equal(restored.workspace.records.files[0].values.base64,'aA==');
  archived=moveToTrash(restored,'products','travel');
  restored=restoreFromTrash(parseAdminData(JSON.stringify(archived.next)),archived.entry.id);
  assert.equal(restored.products[0].presentation.images.length,5);
  assert.deepEqual(restored.products[0],data.products[0]);
});
test('history records changed fields and distinguishes trash, restore and purge',()=>{
  const data=base();data.posts=[{id:'p',title:'Nota',slug:'nota',excerpt:'Resumen',content:'Texto',image:'',status:'draft',updatedAt:''}];
  const next=structuredClone(data);next.posts[0].title='Nota actualizada';
  const changes=trackChanges(data,next);assert.equal(changes[0].action,'updated');
  assert.ok(changes[0].changes.some(change=>change.before==='Nota'&&change.after==='Nota actualizada'));
  const archived=moveToTrash(next,'posts','p');
  assert.equal(trackChanges(next,archived.next)[0].action,'trashed');
  const restored=restoreFromTrash(archived.next,archived.entry.id);
  assert.equal(trackChanges(archived.next,restored)[0].action,'restored');
  assert.equal(trackChanges(archived.next,{...archived.next,trash:[]})[0].action,'removed');
});
test('history ignores timestamp-only updates and summarizes binary data',()=>{
  const data=base();data.posts=[{id:'p',title:'Nota',slug:'nota',excerpt:'',content:'',image:'',status:'draft',updatedAt:''}];
  const next=structuredClone(data);next.posts[0].updatedAt='2026-10-23T13:00:00Z';
  assert.equal(trackChanges(data,next).length,0);
  next.posts[0].image='data:image/png;base64,'+'A'.repeat(5000);
  const event=trackChanges(data,next)[0];assert.ok(event.changes[0].after.length<240);
  assert.match(event.changes[0].after,/Archivo local/);
});
test('malformed recovery entries are rejected and old backups still load',()=>{
  assert.equal(parseAdminData(JSON.stringify(base())).history,undefined);
  assert.throws(()=>parseAdminData(JSON.stringify({...base(),trash:[{id:'x',module:'unknown',entityId:'x',title:'x',deletedAt:'2026-10-23',payload:{id:'x'}}]})));
  assert.throws(()=>parseAdminData(JSON.stringify({...base(),history:Array(HISTORY_LIMIT+1).fill({})})));
});
