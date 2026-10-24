import {useState} from "react";
import {Link} from "react-router-dom";
import {useAdmin} from "../../AdminContext";
import {useUnsavedChanges} from "../../useUnsavedChanges";
import type {BusinessRecord} from "../../businessModel";
import styles from "./DeveloperWorkManager.module.css";

export function DeveloperWorkManager({module}:{module:"projects"|"tasks"}){
 const {data,save,saving,role}=useAdmin();
 const [query,setQuery]=useState(""),[form,setForm]=useState<BusinessRecord|null>(null),[error,setError]=useState("");
 const original=form?data.workspace.records[module].find(item=>item.id===form.id):null;
 useUnsavedChanges(!!form&&JSON.stringify(form.values)!==JSON.stringify(original?.values));
 const open=(record:BusinessRecord)=>{if(form&&JSON.stringify(form.values)!==JSON.stringify(original?.values)&&!window.confirm("¿Descartar los cambios sin guardar?"))return;setForm(structuredClone(record));setError("");};
 const commit=async()=>{
  if(!form)return;
  if(module==="projects"&&(!/^\d+$/.test(form.values.progress)||Number(form.values.progress)>100)){setError("El avance debe ser un número entero entre 0 y 100.");return;}
  const updated={...form,updatedAt:new Date().toISOString()};
  if(await save({...data,workspace:{...data.workspace,records:{...data.workspace.records,[module]:data.workspace.records[module].map(item=>item.id===updated.id?updated:item)}}},"Trabajo actualizado: "+form.values.name))setForm(null);
 };
 const records=data.workspace.records[module].filter(record=>(record.values.name+" "+(record.values.scope??"")).toLowerCase().includes(query.toLowerCase()));
 return <div className={styles.container}><p className={styles.count}>Solo se muestran los {module==="projects"?"proyectos":"trabajos"} asignados a tu cuenta. El administrador gestiona las asignaciones y el alcance.</p><label className={styles.search}>Buscar en mi trabajo<input type="search" value={query} onChange={event=>setQuery(event.target.value)}/></label>
 {form&&<form className={styles.panel} onSubmit={event=>{event.preventDefault();void commit();}}><h2>{form.values.name}</h2>{module==="projects"?<label className={styles.field}>Avance (%)<input required type="number" min="0" max="100" step="1" value={form.values.progress} onChange={event=>setForm({...form,values:{...form.values,progress:event.target.value}})}/></label>:<><label className={styles.field}>Estado<select value={form.values.status} onChange={event=>setForm({...form,values:{...form.values,status:event.target.value}})}>{["Pendiente","En curso","Completada"].map(status=><option key={status}>{status}</option>)}</select></label><label className={styles.field}>Notas de trabajo<textarea maxLength={5000} rows={5} value={form.values.notes??""} onChange={event=>setForm({...form,values:{...form.values,notes:event.target.value}})}/></label></>}{error&&<p role="alert" className={styles.error}>{error}</p>}<div className={styles.actions}><button disabled={saving} className={styles.primary}>Guardar mi avance</button><button type="button" onClick={()=>{if(JSON.stringify(form.values)===JSON.stringify(original?.values)||window.confirm("¿Descartar los cambios sin guardar?"))setForm(null);}}>Cancelar</button></div></form>}
 {records.length?records.map(record=><article key={record.id} className={styles.panel}><span className={styles.badge}>{record.values.status}</span><h2>{record.values.name}</h2>{module==="projects"?<><p className={styles.prose}>{record.values.scope}</p><label>Avance: {record.values.progress||0}%<progress max="100" value={Number(record.values.progress||0)}/></label></>:<><p>Proyecto: {data.workspace.records.projects.find(item=>item.id===record.values.project)?.values.name??"Sin proyecto"}</p>{record.values.notes&&<p className={styles.prose}>{record.values.notes}</p>}</>}{record.values.due&&<p>Fecha límite: {record.values.due}</p>}<div className={styles.actions}>{(module!=="projects"||role!=="qa")&&<button onClick={()=>open(record)}>{module==="projects"?"Actualizar avance":"Actualizar tarea"}</button>}{module==="projects"&&<Link to="/dashboard/tasks">Ver mis tareas</Link>}</div></article>):<section className={styles.empty}><h2>No hay {module==="projects"?"proyectos":"tareas"} en esta vista</h2><p>Cuando el administrador te asigne trabajo aparecerá aquí. Usa Actualizar registros para consultar nuevas asignaciones.</p></section>}</div>;
}
