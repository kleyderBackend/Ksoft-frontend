import { useState } from "react";
import { Link } from "react-router-dom";
import { useAdmin } from "../../AdminContext";
import { entityNames,entityModules,HISTORY_LIMIT } from "../../models/recoveryModel";
import styles from "./HistoryManager.module.css";
const actions={created:"Creación",updated:"Actualización",trashed:"Envío a papelera",restored:"Restauración",removed:"Eliminación"};
export function HistoryManager(){
  const {data}=useAdmin();
  const [query,setQuery]=useState(""),[module,setModule]=useState(""),[from,setFrom]=useState(""),[to,setTo]=useState("");
  const invalid=!!(from&&to&&from>to);
  const events=(data.history??[]).filter(event=>(!module||event.module===module)&&(!from||new Date(event.date).toLocaleDateString("sv-SE")>=from)&&(!to||new Date(event.date).toLocaleDateString("sv-SE")<=to)&&(event.title+" "+entityNames[event.module]).toLocaleLowerCase("es").includes(query.toLocaleLowerCase("es")));
  const exportHistory=()=>{const url=URL.createObjectURL(new Blob([JSON.stringify(events,null,2)],{type:"application/json"}));const anchor=document.createElement("a");anchor.href=url;anchor.download="ksoft-historial.json";anchor.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
  return <div className={styles.container}><p className={styles.count}>Últimos {HISTORY_LIMIT} cambios guardados del panel. El historial se incluye en los respaldos y comienza con los cambios realizados a partir de esta versión.</p><div className={styles.toolbar}><label className={styles.search}>Buscar cambios<input type="search" value={query} onChange={e=>setQuery(e.target.value)}/></label><label className={styles.field}>Módulo<select value={module} onChange={e=>setModule(e.target.value)}><option value="">Todos</option>{[...entityModules,"settings" as const].map(key=><option key={key} value={key}>{entityNames[key]}</option>)}</select></label><button type="button" onClick={exportHistory} disabled={invalid}>Exportar historial filtrado</button></div><div className={styles.formGrid}><label className={styles.field}>Desde<input type="date" value={from} onChange={e=>setFrom(e.target.value)}/></label><label className={styles.field}>Hasta<input type="date" value={to} onChange={e=>setTo(e.target.value)}/></label></div>
    {invalid?<p className={styles.error} role="alert">La fecha inicial debe ser anterior o igual a la final.</p>:events.length?events.map(event=><article className={styles.panel} key={event.id}><div className={styles.heading}><div><span className={styles.badge}>{actions[event.action]} · {entityNames[event.module]}</span><h2>{event.title}</h2><p className={styles.count}>{new Date(event.date).toLocaleString("es-CO")}</p></div><Link to={event.module==="publicProjects"?"/dashboard/projects?view=public":"/dashboard/"+event.module}>Ver módulo →</Link></div>{event.changes.length>0&&<details><summary>Ver campos modificados ({event.changes.length})</summary><div className={styles.changes}>{event.changes.map((change,index)=><div className={styles.change} key={index}><h3>{change.field}</h3><div><span>Antes</span><p>{change.before}</p></div><div><span>Después</span><p>{change.after}</p></div></div>)}</div></details>}</article>):<section className={styles.empty}><h2>No hay cambios para mostrar</h2><p>Los registros que crees, edites, archives y restaures aparecerán aquí.</p></section>}
  </div>;
}

