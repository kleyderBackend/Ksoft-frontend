import assert from 'node:assert/strict';
import {test} from 'node:test';
import {emptyWorkspace,validateRecord} from '../src/Components/dashboards/businessModel.ts';
import {parseAdminData} from '../src/Components/dashboards/adminModel.ts';
import {newBusinessRecord,requestToContact} from '../src/Components/dashboards/models/businessFlowModel.ts';
import {participantTypes,pilotStatus,updatePilotRequest,hasPilotTracking,resetsPilot,matchesPilotFilters} from '../src/Components/dashboards/models/pilotRequests.ts';
const values=()=>({name:'Hotel participante',email:'hotel@example.test',purpose:'Participación en piloto',product:'ksoft-travel',date:'2026-10-24',status:'Nueva'});
const base=()=>({version:1,posts:[],products:[],activity:[],workspace:emptyWorkspace()});
test('pilot requests preserve minimal public enquiries and never offer traveler as a participant',()=>{
 const data=base();const form=newBusinessRecord(data,'requests');
 assert.equal(form.values.pilotStatus,'Solicitado');assert.equal(form.values.participantType,'');assert.equal(form.values.pilotStart,'');
 assert.equal(validateRecord('requests',values(),data.workspace),'');assert.equal(pilotStatus(values()),'Solicitado');
 assert.deepEqual(participantTypes('ksoft-travel'),['Hotel','Guía','Otro']);
 assert.match(validateRecord('requests',{...values(),participantType:'Viajero'},data.workspace),/participante válido/);
 assert.match(validateRecord('requests',{...values(),product:'saas-dental',participantType:'Hotel'},data.workspace),/participante válido/);
});
test('activation requires a participant and real start date; request status remains independent',()=>{
 const data=base();const active={...values(),pilotStatus:'Activo',participantType:'Hotel',pilotStart:'2026-10-24'};
 assert.equal(validateRecord('requests',active,data.workspace),'');
 assert.equal(validateRecord('requests',{...active,status:'Atendida'},data.workspace),'');
 assert.match(validateRecord('requests',{...active,participantType:''},data.workspace),/tipo de participante/);
 assert.match(validateRecord('requests',{...active,pilotStart:''},data.workspace),/fecha de inicio/);
 assert.match(validateRecord('requests',{...active,pilotStart:'2026-02-31'},data.workspace),/fecha/);
 assert.match(validateRecord('requests',{...active,pilotNotes:'x'.repeat(5001)},data.workspace),/5000/);
 assert.match(validateRecord('requests',{...active,linkedAccountId:'x'.repeat(201)},data.workspace),/200/);
});
test('changing purpose or product clears pilot tracking while retaining original contact and request data',()=>{
 const source={...values(),participantType:'Hotel',pilotStatus:'Activo',pilotStart:'2026-10-24',linkedAccountId:'external-id',pilotNotes:'Observación',pilotTerms:'Condiciones'};
 assert.equal(hasPilotTracking(source),true);assert.equal(resetsPilot(source,'product','saas-dental'),true);
 const changed=updatePilotRequest(source,'product','saas-dental');assert.equal(changed.pilotStatus,'Solicitado');assert.equal(changed.participantType,'');assert.equal(changed.linkedAccountId,'');assert.equal(changed.email,source.email);assert.equal(source.pilotStatus,'Activo');
 const general=updatePilotRequest(source,'purpose','Consulta general');assert.equal(general.pilotStatus,'');assert.equal(general.pilotNotes,'');assert.equal(validateRecord('requests',general,emptyWorkspace()),'');
 assert.equal(updatePilotRequest(general,'purpose','Participación en piloto').pilotStatus,'Solicitado');
});
test('product and pilot status filters distinguish regular enquiries and legacy pilot requests',()=>{
 assert.equal(matchesPilotFilters(values(),'ksoft-travel','Solicitado'),true);
 assert.equal(matchesPilotFilters(values(),'saas-dental','all'),false);
 assert.equal(matchesPilotFilters({...values(),purpose:'Cotización'},'','all'),false);
 assert.equal(matchesPilotFilters({...values(),pilotStatus:'Activo'},'ksoft-travel','Activo'),true);
});
test('pilot information survives backup and contact association without converting it into request status',()=>{
 let data=base();const now='2026-10-24T12:00:00Z';data.workspace.records.requests=[{id:'pilot',createdAt:now,updatedAt:now,values:{...values(),pilotStatus:'Activo',participantType:'Hotel',pilotStart:'2026-10-24',pilotTerms:'Acceso de prueba',pilotNotes:'Seguimiento',linkedAccountId:'hotel-123'}}];
 data=requestToContact(data,'pilot');data=parseAdminData(JSON.stringify(data));
 assert.equal(data.workspace.records.requests[0].values.status,'En seguimiento');assert.equal(data.workspace.records.requests[0].values.pilotStatus,'Activo');assert.equal(data.workspace.records.requests[0].values.linkedAccountId,'hotel-123');
});
