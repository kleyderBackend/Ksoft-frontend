import type {Field} from '../businessModel';
export const pilotPurpose='Participación en piloto';
export const pilotStatuses=['Solicitado','Invitado','Activo','Pausado','Finalizado'];
export const pilotFields:Field[]=[
 {key:'participantType',label:'Tipo de participante',type:'select',pilotOnly:true},
 {key:'pilotStatus',label:'Estado del piloto',type:'select',options:pilotStatuses,pilotOnly:true},
 {key:'pilotStart',label:'Fecha de inicio del piloto',type:'date',pilotOnly:true},
 {key:'linkedAccountId',label:'Identificador de cuenta en el producto (opcional)',pilotOnly:true},
 {key:'pilotTerms',label:'Condiciones acordadas',type:'textarea',pilotOnly:true},
 {key:'pilotNotes',label:'Observaciones del piloto',type:'textarea',pilotOnly:true},
];
export function participantTypes(product:string){
 return product==='ksoft-travel'?['Hotel','Guía','Otro']:product==='saas-dental'?['Consultorio','Clínica dental','Odontólogo','Otro']:['Empresa','Persona','Otro'];
}
export const pilotStatus=(values:Record<string,string>)=>values.pilotStatus||'Solicitado';
export function hasPilotTracking(values:Record<string,string>){return pilotFields.some(field=>field.key==='pilotStatus'?!!values.pilotStatus&&values.pilotStatus!=='Solicitado':!!values[field.key]);}
export function resetsPilot(values:Record<string,string>,key:string,value:string){return values.purpose===pilotPurpose&&value!==values[key]&&(key==='product'||key==='purpose'&&value!==pilotPurpose);}
export function updatePilotRequest(values:Record<string,string>,key:string,value:string){
 const next={...values,[key]:value};
 if(resetsPilot(values,key,value))for(const field of pilotFields)next[field.key]='';
 if(next.purpose===pilotPurpose&&!next.pilotStatus)next.pilotStatus='Solicitado';
 return next;
}
export function validatePilotRequest(values:Record<string,string>){
 if(values.purpose!==pilotPurpose)return pilotFields.some(field=>values[field.key])?'Los datos del piloto solo corresponden al motivo Participación en piloto.':'';
 if(!values.product)return 'Selecciona el producto del piloto solicitado.';
 if(!pilotStatuses.includes(pilotStatus(values)))return 'Selecciona un estado válido del piloto.';
 if(values.participantType&&!participantTypes(values.product).includes(values.participantType))return 'Selecciona un tipo de participante válido para el producto.';
 if(pilotStatus(values)!=='Solicitado'&&!values.participantType)return 'Selecciona el tipo de participante antes de avanzar el piloto.';
 if(['Activo','Pausado','Finalizado'].includes(pilotStatus(values))&&!values.pilotStart)return 'Indica la fecha de inicio del piloto.';
 if((values.linkedAccountId?.length??0)>200)return 'El identificador de cuenta admite hasta 200 caracteres.';
 if((values.pilotTerms?.length??0)>5000||(values.pilotNotes?.length??0)>5000)return 'Las condiciones y observaciones admiten hasta 5000 caracteres cada una.';
 return '';
}
export function matchesPilotFilters(values:Record<string,string>,product:string,status:string){return (!product||values.product===product)&&(!status||values.purpose===pilotPurpose&&(status==='all'||pilotStatus(values)===status));}
