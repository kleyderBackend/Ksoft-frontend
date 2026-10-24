import type {IncomingMessage,ServerResponse} from 'node:http';
import {createEmployee,TeamError} from '../server/team-service.js';

export default async function handler(req:IncomingMessage&{body?:unknown},res:ServerResponse){
 res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');
 const reply=(status:number,value:unknown)=>{res.statusCode=status;res.end(JSON.stringify(value));};
 if(req.method!=='POST'){res.setHeader('Allow','POST');return reply(405,{error:'Método no permitido.'});}
 const token=/^Bearer (\S+)$/.exec(req.headers.authorization??'')?.[1];
 if(!token)return reply(401,{error:'Inicia sesión para continuar.'});
 if(!req.headers['content-type']?.includes('application/json'))return reply(415,{error:'Formato no válido.'});
 if(!process.env.SUPABASE_URL||!process.env.SUPABASE_SERVICE_ROLE_KEY)return reply(503,{error:'El servicio de empleados no está disponible.'});
 try{
  let body=req.body;
  if(body===undefined){const chunks:Buffer[]=[];let size=0;for await(const chunk of req){const buffer=Buffer.from(chunk);size+=buffer.length;if(size>4096)return reply(413,{error:'Solicitud demasiado grande.'});chunks.push(buffer);}body=Buffer.concat(chunks).toString('utf8');}
  if(typeof body==='string'){if(Buffer.byteLength(body)>4096)return reply(413,{error:'Solicitud demasiado grande.'});try{body=JSON.parse(body);}catch{return reply(400,{error:'Datos no válidos.'});}}
  const result=await createEmployee(token,body,{url:process.env.SUPABASE_URL,key:process.env.SUPABASE_SERVICE_ROLE_KEY});
  return reply(201,result);
 }catch(error){return reply(error instanceof TeamError?error.status:502,{error:error instanceof TeamError?error.message:'No se pudo completar la operación. Actualiza el equipo antes de intentarlo de nuevo.'});}
}
