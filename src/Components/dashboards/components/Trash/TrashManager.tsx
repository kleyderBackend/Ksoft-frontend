import { useState } from "react";
import { useAdmin } from "../../AdminContext";
import { entityNames,entityModules } from "../../models/recoveryModel";
import styles from "./TrashManager.module.css";
export function TrashManager() {
  const {data,save,restore}=useAdmin();
  const [query,setQuery]=useState(""),[module,setModule]=useState("");
  const items=(data.trash??[]).filter(item=>(!module||item.module===module)&&item.title.toLocaleLowerCase("es").includes(query.toLocaleLowerCase("es")));
  const permanentlyRemove=(id:string,title:string)=>{
    if(window.confirm('¿Eliminar definitivamente "'+title+'"? Esta acción no se puede deshacer desde la papelera.')){
      save({...data,trash:data.trash?.filter(item=>item.id!==id)},"Eliminado definitivamente de la papelera: "+title);
    }
  };
  return <div className={styles.container}><p className={styles.count}>Los registros archivados conservan sus datos y archivos. Si tienen relaciones, restaura primero el cliente, la cotización o el proyecto de los que dependen.</p><div className={styles.toolbar}><label className={styles.search}>Buscar en papelera<input type="search" value={query} onChange={e=>setQuery(e.target.value)}/></label><label className={styles.field}>Módulo<select value={module} onChange={e=>setModule(e.target.value)}><option value="">Todos los módulos</option>{entityModules.map(key=><option value={key} key={key}>{entityNames[key]}</option>)}</select></label></div>
    <p className={styles.count}>{items.length} registros en esta vista</p>
    {items.length?items.map(item=><article className={styles.row} key={item.id}><div><span className={styles.badge}>{entityNames[item.module]}</span><h2>{item.title}</h2><p>Archivado el {new Date(item.deletedAt).toLocaleString("es-CO")}</p></div><div className={styles.actions}><button type="button" onClick={()=>restore(item.id)} aria-label={"Restaurar "+item.title}>Restaurar</button><button type="button" className={styles.danger} onClick={()=>permanentlyRemove(item.id,item.title)} aria-label={"Eliminar definitivamente "+item.title}>Eliminar definitivamente</button></div></article>):<section className={styles.empty}><h2>{data.trash?.length?"Sin resultados":"La papelera está vacía"}</h2><p>Cuando envíes un registro a la papelera podrás recuperarlo desde aquí.</p></section>}
  </div>;
}

