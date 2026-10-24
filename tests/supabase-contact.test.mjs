import assert from 'node:assert/strict';
import {test} from 'node:test';
import handler from '../api/contact.ts';
const body={name:'Prueba',email:'p@example.test',message:'Quiero participar',purpose:'pilot',product:'saas-dental'};
async function invoke(payload=body){
  const res={setHeader(){},end(value){this.body=JSON.parse(value);}};
  await handler({method:'POST',headers:{'content-type':'application/json'},body:payload},res);
  return res;
}
test('Supabase intake uses server-side RPC, retains product and only acknowledges persisted enquiries',async(t)=>{
  const oldUrl=process.env.SUPABASE_URL,oldKey=process.env.SUPABASE_SERVICE_ROLE_KEY;
  process.env.SUPABASE_URL='https://project.example.test';process.env.SUPABASE_SERVICE_ROLE_KEY='server-only-test-key';
  t.after(()=>{if(oldUrl===undefined)delete process.env.SUPABASE_URL;else process.env.SUPABASE_URL=oldUrl;if(oldKey===undefined)delete process.env.SUPABASE_SERVICE_ROLE_KEY;else process.env.SUPABASE_SERVICE_ROLE_KEY=oldKey;});
  const mock=t.mock.method(globalThis,'fetch',async()=>new Response(JSON.stringify('00000000-0000-4000-8000-000000000001')));
  assert.equal((await invoke()).statusCode,200);
  const [url,options]=mock.mock.calls[0].arguments;
  assert.equal(url.pathname,'/rest/v1/rpc/ksoft_receive_enquiry');
  assert.equal(options.method,'POST');assert.equal(url.search,'');
  const sent=JSON.parse(options.body);assert.equal(sent.enquiry.product,'saas-dental');assert.equal(sent.enquiry.purpose,'pilot');
  assert.equal(sent.fingerprint.length,64);assert.equal(sent.fingerprint.includes(body.email),false);
  for(const result of ['{}','"not-a-record"','<html>error</html>']){
    mock.mock.mockImplementation(async()=>new Response(result));
    assert.equal((await invoke()).statusCode,502);
  }
  mock.mock.mockImplementation(async()=>new Response('{"message":"RATE_LIMITED"}',{status:400}));
  assert.equal((await invoke()).statusCode,429);
  assert.equal((await invoke({...body,product:''})).statusCode,400);
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  assert.equal((await invoke()).statusCode,503);
});
