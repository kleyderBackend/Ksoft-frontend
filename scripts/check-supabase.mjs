import {readFileSync} from 'node:fs';

// Read-only live checks. Only the public key is used for network requests.
const env=Object.fromEntries(readFileSync(new URL('../.env.local',import.meta.url),'utf8').split(/\r?\n/).filter(line=>line.includes('=')&&!line.trim().startsWith('#')).map(line=>{const index=line.indexOf('=');return [line.slice(0,index).trim(),line.slice(index+1).trim().replace(/^(['"])(.*)\1$/,'$2')];}));
const key=env.VITE_SUPABASE_PUBLISHABLE_KEY||env.VITE_SUPABASE_ANON_KEY;
if(!env.VITE_SUPABASE_URL||!key)throw new Error('Falta la configuración pública de Supabase.');
const get=path=>fetch(new URL(path,env.VITE_SUPABASE_URL),{headers:{apikey:key},signal:AbortSignal.timeout(15000)});
const publicResponse=await get('/rest/v1/ksoft_public_site?select=published_at&limit=1');
if(!publicResponse.ok)throw new Error('No se pudo leer el catálogo público.');
for(const table of ['ksoft_records','ksoft_workspace','ksoft_admins','ksoft_audit','ksoft_developers','ksoft_assignments','ksoft_tickets','ksoft_ticket_messages','ksoft_ticket_reads']){
  const response=await get('/rest/v1/'+table+'?select=*&limit=1');
  if(![401,403].includes(response.status))throw new Error('Permisos inesperados en '+table+': '+response.status);
}
const settingsResponse=await get('/auth/v1/settings');
if(!settingsResponse.ok)throw new Error('No se pudo verificar la configuración de Auth.');
const settings=await settingsResponse.json();
if(settings.disable_signup!==true)throw new Error('El registro público todavía está habilitado.');
console.log(JSON.stringify({publicCatalog:true,privateTablesProtected:true,publicSignupDisabled:true,serverKeyConfigured:!!env.SUPABASE_SERVICE_ROLE_KEY}));
