import assert from 'node:assert/strict';
import {test} from 'node:test';
import {createEmployee} from '../server/team-service.ts';
const config={url:'https://example.test',key:'server-only'};
const userId='00000000-0000-4000-8000-000000000004';
const input={name:' QA Nuevo ',email:' QA@example.test ',role:'qa'};
const json=(value,status=200)=>new Response(JSON.stringify(value),{status});
test('team creation checks the signed-in role before touching Auth',async()=>{
 for(const role of ['developer','qa','employee',null]){let calls=0;await assert.rejects(createEmployee('user-token',input,config,async()=>{calls++;return json(role?{role}:null);}),error=>error.status===403);assert.equal(calls,1);}
 await assert.rejects(createEmployee('expired',input,config,async()=>json({},401)),error=>error.status===401);
});
test('only staff roles and valid employee details are accepted',async()=>{
 for(const value of [{...input,role:'admin'},{...input,email:'invalid'},{...input,name:''},null]){let calls=0;await assert.rejects(createEmployee('admin-token',value,config,async()=>{calls++;return json({role:'admin'});}),error=>error.status===400);assert.equal(calls,1);}
});
test('creates a staff account with a generated password and registers the role using admin identity',async()=>{
 const calls=[];
 const result=await createEmployee('admin-token',input,config,async(url,options)=>{calls.push({url:String(url),...options});return calls.length===1?json({role:'admin'}):calls.length===2?json({id:userId}):json([]);});
 assert.equal(result.email,'qa@example.test');assert.ok(result.password.length>=24);
 const auth=JSON.parse(calls[1].body);assert.equal(auth.password,result.password);assert.equal(auth.email_confirm,true);
 assert.equal(calls[1].headers.Authorization,'Bearer server-only');assert.equal(calls[2].headers.Authorization,'Bearer admin-token');
 assert.deepEqual(JSON.parse(calls[2].body),{p_user:userId,p_name:'QA Nuevo',p_role:'qa',p_active:true});
});
test('failed registration cleans up only the newly created account; duplicates never reset existing users',async()=>{
 const calls=[];
 await assert.rejects(createEmployee('admin-token',input,config,async(url,options)=>{calls.push({url:String(url),...options});return calls.length===1?json({role:'admin'}):calls.length===2?json({id:userId}):calls.length===3?json({},403):json({});}),error=>error.status===502);
 assert.equal(calls[3].method,'DELETE');assert.ok(calls[3].url.endsWith(userId));
 let count=0;await assert.rejects(createEmployee('admin-token',input,config,async()=>++count===1?json({role:'admin'}):json({},422)),error=>error.status===409);assert.equal(count,2);
});
