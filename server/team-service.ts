import {randomBytes} from 'node:crypto';

export class TeamError extends Error {status:number;constructor(status:number,message:string){super(message);this.status=status;}}
export async function createEmployee(token:string,body:unknown,config:{url:string;key:string},request:typeof fetch=fetch){
 const headers={apikey:config.key,Authorization:'Bearer '+token,'Content-Type':'application/json'};
 const access=await request(new URL('/rest/v1/rpc/ksoft_get_access',config.url),{method:'POST',headers,body:'{}'});
 if(!access.ok)throw new TeamError(401,'Inicia sesión de nuevo.');
 const identity=await access.json() as {role?:string}|null;
 if(identity?.role!=='admin')throw new TeamError(403,'Solo administración puede crear empleados.');
 if(!body||typeof body!=='object'||Array.isArray(body))throw new TeamError(400,'Revisa los datos del empleado.');
 const input=body as Record<string,unknown>;
 const name=typeof input.name==='string'?input.name.trim():'';
 const email=typeof input.email==='string'?input.email.trim().toLowerCase():'';
 if(name.length<2||name.length>120||email.length>254||!/^\S+@\S+\.\S+$/.test(email)||!['developer','qa','employee'].includes(String(input.role)))throw new TeamError(400,'Completa nombre, correo válido y rol.');
 const password=randomBytes(18).toString('base64url')+'aA9!';
 const privileged={apikey:config.key,Authorization:'Bearer '+config.key,'Content-Type':'application/json'};
 const created=await request(new URL('/auth/v1/admin/users',config.url),{method:'POST',headers:privileged,body:JSON.stringify({email,password,email_confirm:true})});
 if(!created.ok)throw new TeamError(created.status===422?409:502,'No se pudo crear la cuenta. Comprueba que el correo no esté registrado.');
 const user=await created.json() as {id?:string};
 if(typeof user.id!=='string'||!/^[0-9a-f-]{36}$/i.test(user.id))throw new TeamError(502,'La cuenta no devolvió un identificador válido.');
 let registered:Response;
 try{registered=await request(new URL('/rest/v1/rpc/ksoft_manage_team',config.url),{method:'POST',headers,body:JSON.stringify({p_user:user.id,p_name:name,p_role:input.role,p_active:true})});}
 catch{throw new TeamError(502,'La cuenta fue creada, pero no se pudo confirmar su rol. Actualiza el equipo antes de volver a intentarlo.');}
 if(!registered.ok){
  const cleanup=await request(new URL('/auth/v1/admin/users/'+user.id,config.url),{method:'DELETE',headers:privileged});
  throw new TeamError(502,cleanup.ok?'No se pudo asignar el rol. La creación fue cancelada.':'La cuenta se creó sin acceso. Contacta con administración antes de volver a intentarlo.');
 }
 return {email,password};
}
