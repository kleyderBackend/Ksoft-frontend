import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createClient} from '@supabase/supabase-js';
import {parseAdminData} from '../src/Components/dashboards/adminModel.ts';
const env=Object.fromEntries(readFileSync('.env.local','utf8').split(/\r?\n/).filter(line=>line.includes('=')).map(line=>{const p=line.indexOf('=');return [line.slice(0,p),line.slice(p+1).replace(/^(['"])(.*)\1$/,'$2')];}));
const credentials=readFileSync('credenciales-ksoft.local','utf8');
for(const [section,expected] of [['ADMINISTRADOR','admin'],['DESARROLLADOR','developer']]){
 const block=credentials.match(new RegExp(section+'\\nCorreo: (.+)\\nContraseña: (.+)\\n'));
 if(!block)throw new Error('No se encontró el acceso de '+section);
 const client=createClient(env.VITE_SUPABASE_URL,env.VITE_SUPABASE_PUBLISHABLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
 try{
  const login=await client.auth.signInWithPassword({email:block[1],password:block[2]});assert.equal(login.error,null,'No se pudo iniciar sesión como '+expected);
  const access=await client.rpc('ksoft_get_access');assert.equal(access.data?.role,expected);
  const result=await client.rpc(expected==='admin'?'ksoft_read_workspace':'ksoft_read_developer_workspace');assert.equal(result.error,null);
  const data=parseAdminData(JSON.stringify(result.data.document));
  if(expected==='developer'){
   for(const module of ['clients','payments','expenses','quotes','requests','files'])assert.equal(data.workspace.records[module].length,0);
   assert.ok((await client.rpc('ksoft_read_workspace')).error);
   assert.ok((await client.rpc('ksoft_publish_site',{expected_revision:result.data.revision})).error);
  }
  console.log(JSON.stringify({role:expected,loginVerified:true,workspaceVerified:true}));
 }finally{await client.auth.signOut({scope:'local'});}
}
