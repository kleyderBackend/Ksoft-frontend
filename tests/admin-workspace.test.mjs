import assert from 'node:assert/strict';
import { test } from 'node:test';
import { emptyWorkspace, financialSummary, validateRecord, referencedBy, csvCell, parseWorkspace } from '../src/Components/dashboards/businessModel.ts';
import { parseAdminData } from '../src/Components/dashboards/adminModel.ts';
import { getNotifications } from '../src/Components/dashboards/notifications.ts';

const record = (id, values) => ({id, values, createdAt: '2026-10-23T12:00:00Z', updatedAt: '2026-10-23T12:00:00Z'});
test('old content storage migrates without dropping posts or products', () => {
  const old = {version: 1, posts: [], products: [], activity: []};
  assert.deepEqual(parseAdminData(JSON.stringify(old)).workspace, emptyWorkspace());
});
test('financial reports only include paid records and the selected date range', () => {
  const w = emptyWorkspace();
  w.records.payments = [record('1',{amount:'100.10',status:'Pagado',date:'2026-10-12'}),record('2',{amount:'50.20',status:'Pagado',date:'2026-10-13'}),record('3',{amount:'300',status:'Pendiente',date:'2026-10-14'}),record('4',{amount:'500',status:'Anulado',date:'2026-10-14'}),record('5',{amount:'10',status:'Pagado',date:'2026-09-14'})];
  w.records.expenses = [record('1',{amount:'20.10',status:'Pagado',date:'2026-10-12'}),record('2',{amount:'40',status:'Pendiente',date:'2026-10-14'})];
  assert.deepEqual(financialSummary(w,'2026-10-01','2026-10-31'), {income:150.30,expenses:20.10,net:130.20,receivable:300,payable:40});
});
test('records reject invalid relationships, mismatched quote clients and duplicate email', () => {
  const w = emptyWorkspace();
  w.records.clients = [record('a',{name:'Cliente A',email:'a@example.test',status:'Activo'}),record('b',{name:'Cliente B',email:'b@example.test',status:'Activo'})];
  w.records.quotes = [record('quote',{name:'Propuesta',client:'a'})];
  const payment = {name:'Abono',client:'a',quote:'quote',amount:'100',date:'2026-10-23',status:'Pendiente'};
  assert.equal(validateRecord('payments',payment,w),'');
  assert.match(validateRecord('payments',{...payment,client:'b'},w), /corresponder/);
  assert.match(validateRecord('payments',{...payment,client:'missing'},w), /ya no existe/);
  assert.match(validateRecord('clients',{name:'Duplicado',email:'A@example.test',status:'Activo'},w), /Ya existe/);
  assert.equal(validateRecord('payments',{...payment,status:'Pagado',due:'2026-10-01'},w),'');
});
test('dates, money, progress and ticket resolution are validated', () => {
  const w = emptyWorkspace();
  const expense = {name:'Hosting',amount:'10.00',date:'2026-10-23',status:'Pagado'};
  for (const amount of ['-5','NaN','Infinity','0.001','1e10']) assert.notEqual(validateRecord('expenses',{...expense,amount},w),'');
  assert.notEqual(validateRecord('expenses',{...expense,date:'2026-02-30'},w),'');
  assert.match(validateRecord('projects',{name:'Web',scope:'Sitio',status:'Planificado',progress:'101'},w), /avance/);
  assert.match(validateRecord('supports',{name:'Caso',description:'Error',status:'Resuelto'},w), /solución/);
});
test('deletion detects records related to clients and projects', () => {
  const w = emptyWorkspace();
  w.records.projects = [record('p',{name:'Proyecto',client:'c'})];
  w.records.tasks = [record('t',{name:'Entrega',project:'p'})];
  assert.deepEqual(referencedBy(w,'clients','c'),['Proyectos: Proyecto']);
  assert.deepEqual(referencedBy(w,'projects','p'),['Tareas: Entrega']);
});
test('CSV values are quoted and spreadsheet formula injection is neutralized', () => {
  assert.equal(csvCell('=SUM(A1)'), '"\'=SUM(A1)"');
  assert.equal(csvCell('Texto "comillas"'), '"Texto ""comillas"""');
});
test('workspace backups round-trip and reject malformed records', () => {
  const w = emptyWorkspace();
  assert.deepEqual(parseWorkspace(JSON.parse(JSON.stringify(w))),w);
  assert.throws(() => parseWorkspace({...w,records:{...w.records,tasks:[record('x',{name:'',status:'Pendiente'})]}}));
});
test('overdue notifications ignore completed work', () => {
  const w = emptyWorkspace();
  w.records.tasks = [record('a',{name:'Pendiente',status:'Pendiente',due:'2026-10-01'}),record('b',{name:'Terminada',status:'Completada',due:'2026-10-01'})];
  const notifications = getNotifications({activity:[],workspace:w},'2026-10-23');
  assert.equal(notifications.length,1);
  assert.match(notifications[0].title,/Pendiente/);
});
