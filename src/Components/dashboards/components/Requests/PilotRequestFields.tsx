import {participantTypes,pilotFields,pilotStatus} from '../../models/pilotRequests';
import styles from './PilotRequestFields.module.css';
export function PilotRequestFields({values,onChange}:{values:Record<string,string>;onChange:(key:string,value:string)=>void}){
 const status=pilotStatus(values);
 return <fieldset className={styles.panel}><legend>Seguimiento del piloto</legend><p>La solicitud y el piloto tienen estados independientes. Registra aquí la participación; el acceso al producto se gestiona por separado.</p><div className={styles.grid}>{pilotFields.map(field=>{
  const required=field.key==='pilotStatus'||field.key==='participantType'&&status!=='Solicitado'||field.key==='pilotStart'&&['Activo','Pausado','Finalizado'].includes(status);
  const value=field.key==='pilotStatus'?status:values[field.key]||'';
  return <label className={styles.field} key={field.key}>{field.label}{required?' *':''}{field.type==='select'?<select required={required} disabled={field.key==='participantType'&&!values.product} value={value} onChange={event=>onChange(field.key,event.target.value)}><option value="">Seleccionar</option>{(field.key==='participantType'?participantTypes(values.product):field.options??[]).map(option=><option key={option}>{option}</option>)}</select>:field.type==='textarea'?<textarea rows={4} maxLength={5000} value={value} onChange={event=>onChange(field.key,event.target.value)}/>:<input type={field.type||'text'} required={required} maxLength={field.key==='linkedAccountId'?200:undefined} value={value} onChange={event=>onChange(field.key,event.target.value)}/>}</label>;
 })}</div><small>El identificador vincula el registro con una cuenta existente; no crea una cuenta ni envía una invitación.</small></fieldset>;
}
