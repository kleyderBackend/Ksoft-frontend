// No user is created: requests are deliberately invalid or unauthorized.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createClient} from '@supabase/supabase-js';
const env=Object.fromEntries(readFileSync('.env.local','utf8').split(/\r?\n/).filter(line=>line.includes('=')).map(line=>{const p=line.indexOf('=');return [line.slice(0,p),line.slice(p+1).replace(/^(['"])(.*)\1$/,'$2')];}));
const credentials=readFileSync('credenciales-ksoft.local','utf8');
const endpoint='http://127.0.0.1:5173/api/team';
assert.equal((await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'})).status,401);
for(const [section,status] of [['ADMINISTRADOR',400],['DESARROLLADOR',403]]){
 const block=credentials.match(new RegExp(section+'\\nCorreo: (.+)\\nContraseña: (.+)\\n'));
 const client=createClient(env.VITE_SUPABASE_URL,env.VITE_SUPABASE_PUBLISHABLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
 try{
  const {data,error}=await client.auth.signInWithPassword({email:block[1],password:block[2]});assert.equal(error,null);
  const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+data.session.access_token},body:'{}'});
  assert.equal(response.status,status);console.log(JSON.stringify({role:section,apiAuthorizationVerified:true,createdUsers:0}));
 }finally{await client.auth.signOut({scope:'local'});}
}
