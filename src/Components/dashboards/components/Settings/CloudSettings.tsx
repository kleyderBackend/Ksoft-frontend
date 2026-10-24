import { useState } from "react";
import { useAdmin } from "../../AdminContext";
import { parseAdminData,STORAGE_KEY } from "../../adminModel";
import styles from "./SettingsManager.module.css";

export function CloudSettings() {
  const {data,cloud,saving,save,publish}=useAdmin();
  const [error,setError]=useState("");
  if(!cloud)return null;
  const ready=[...data.products,...(data.publicProjects??[])].filter(item=>item.editorialStatus==="ready"&&item.visibility==="visible");
  const posts=data.posts.filter(item=>item.status==="ready");
  const migrate=async()=>{
    try {
      const raw=localStorage.getItem(STORAGE_KEY);
      if(!raw){setError("No hay registros locales guardados en este navegador y dirección. También puedes importar un respaldo JSON.");return;}
      const next=parseAdminData(raw);
      if(window.confirm("¿Importar la copia local al espacio de Ksoft? Reemplazará los registros actuales del panel en la nube. Exporta un respaldo antes de continuar.")){
        if(await save(next,"Copia local migrada al espacio de Ksoft",true,{restoreBackup:true}))setError("");
      }
    }catch{setError("No se pudo leer la copia local. Conservamos los registros existentes.");}
  };
  const publishSite=async()=>{
    if(window.confirm(`¿Publicar ${ready.length} fichas y ${posts.length} publicaciones preparadas? Sustituirá el contenido público anterior. Las fichas ocultas y los borradores no aparecerán en la web.`))await publish();
  };
  return <section className={styles.panel}><h2>Contenido y publicación web</h2><p className={styles.count}>Los formularios guardan registros privados en tu espacio de Ksoft. Para cambiar lo que ve el público, revisa las vistas previas y publica aquí el contenido preparado y visible.</p><p>{ready.length} fichas y {posts.length} publicaciones listas para publicar.</p><div className={styles.actions}><button type="button" disabled={saving} onClick={()=>void publishSite()}>Publicar cambios en la web</button><button type="button" disabled={saving} onClick={()=>void migrate()}>Importar mi copia local al espacio de Ksoft</button></div><small>La importación conserva la copia local original. Los documentos internos permanecen privados; las imágenes comerciales cargadas se alojan en el espacio público de imágenes.</small>{error&&<p role="alert" className={styles.error}>{error}</p>}</section>;
}
