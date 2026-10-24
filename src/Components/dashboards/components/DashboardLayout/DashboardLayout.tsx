import { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import { products } from "../../../../config/products";
import { AdminContext } from "../../AdminContext";
import type {SaveOptions} from "../../AdminContext";
import {useDashboardAccess} from "../../accessContext";
import { STORAGE_KEY, parseAdminData, normalizeProduct } from "../../adminModel";
import type { AdminData } from "../../adminModel";
import { emptyWorkspace } from "../../businessModel";
import { HISTORY_LIMIT, trackChanges } from "../../models/recoveryModel";
import type { EntityModule, HistoryEntry } from "../../models/recoveryModel";
import { moveToTrash, restoreFromTrash } from "../../models/recoveryActions";
import { SidebarAdmin } from "../SidebarAdmin/SidebarAdmin";
import { NavbarAdmin } from "../NavbarAdmin/NavbarAdmin";
import styles from "./DashboardLayout.module.css";
import { cloudEnabled } from "../../../../lib/supabase";
import { loadCloudWorkspace,saveCloudWorkspace,publishCloudSite } from "../../services/cloudRepository";
function load() {
  const seed: AdminData = {version: 1, posts: [], activity: [], workspace: emptyWorkspace(), products: products.map(p => normalizeProduct({
    ...p, id: p.slug, logo: p.logo ?? "", editorialStatus: "draft", updatedAt: "",
  }))};
  try {
    const raw = cloudEnabled ? null : localStorage.getItem(STORAGE_KEY);
    return {data: raw ? parseAdminData(raw) : seed, error: "", raw};
  } catch {
    return {data: seed, error: "No se pudo leer el contenido guardado. No se sobrescribirán los datos existentes. Revisa el almacenamiento del navegador.", raw: null};
  }
}
export function DashboardLayout() {
  const {role}=useDashboardAccess();
  const [initial] = useState(load);
  const [data, setData] = useState(initial.data);
  const [lastRaw, setLastRaw] = useState(initial.raw);
  const [error, setError] = useState(initial.error);
  const [notice, setNotice] = useState("");
  const [blocked,setBlocked] = useState(!!initial.error);
  const [undoId,setUndoId] = useState<string|null>(null);
  const [loading,setLoading]=useState(cloudEnabled),[saving,setSaving]=useState(false);
  const revision=useRef(0),busy=useRef(false);
  useEffect(()=>{
    if(!cloudEnabled)return;
    let active=true;
    void loadCloudWorkspace(role).then(result=>{if(active){revision.current=result.revision;if(result.data)setData(result.data);setBlocked(false);setLoading(false);}}).catch(()=>{if(active){setError("No se pudo conectar con tu espacio de Ksoft. Recarga para volver a intentarlo. No se utilizará la copia local como sustituto.");setBlocked(true);setLoading(false);}});
    return ()=>{active=false;};
  },[role]);
  const errorRef=useRef<HTMLParagraphElement>(null);
  useEffect(()=>{if(error){errorRef.current?.scrollIntoView({block:"center",behavior:"smooth"});errorRef.current?.focus({preventScroll:true});}},[error]);
  const save = async (next: AdminData, message: string, logActivity = true, options?: SaveOptions) => {
    if(busy.current || loading)return false;
    if (blocked && !options?.restoreBackup) return false;
    if(cloudEnabled && blocked)return false;
    let checked: AdminData;
    try {checked=parseAdminData(JSON.stringify(next));} catch (cause) {setError(cause instanceof Error ? cause.message : "Los datos no son válidos.");return false;}
    busy.current=true;setSaving(true);
    try {
      if (!cloudEnabled && !options?.restoreBackup && localStorage.getItem(STORAGE_KEY) !== lastRaw) {
        setError("Hay cambios en otra pestaña. Recarga esta página antes de guardar."); return false;
      }
      const backupEvent: HistoryEntry = {id:crypto.randomUUID(),module:"settings",entityId:"backup",title:"Respaldo restaurado",date:new Date().toISOString(),action:"updated",changes:[{field:"Respaldo",before:"Copia anterior del navegador",after:"Copia importada"}]};
      const events=role==="admin"&&logActivity?(options?.restoreBackup?[backupEvent]:trackChanges(data,checked)):[];
      const updated: AdminData = {...checked, ...(events.length?{history:[...events,...(checked.history??[])].slice(0,HISTORY_LIMIT)}:{}), activity: role==="admin"&&logActivity ? [{id: crypto.randomUUID(), title: message, date: new Date().toISOString()}, ...checked.activity].slice(0, 30) : checked.activity};
      const raw = JSON.stringify(updated);
      if(cloudEnabled)revision.current=await saveCloudWorkspace(updated,revision.current,role,options);
      else localStorage.setItem(STORAGE_KEY, raw);
      setLastRaw(raw); setData(updated); setBlocked(false); setUndoId(null); setError(""); setNotice(message + (cloudEnabled?options?.publication?.action==="publish"?". Publicado en la web.":". Guardado en Ksoft.":". Guardado en este navegador."));
      return true;
    } catch (cause) {
      setError(cloudEnabled&&cause instanceof Error?cause.message:"No se pudo guardar. Comprueba el espacio y los permisos del navegador. Tus cambios siguen en el formulario."); return false;
    } finally {busy.current=false;setSaving(false);}
  };
  const trash = async (module: EntityModule,id: string) => {
    try {const result=moveToTrash(data,module,id);if(!await save(result.next,"Enviado a la papelera: "+result.entry.title))return false;setUndoId(result.entry.id);return true;}
    catch(cause){setError(cause instanceof Error?cause.message:"No se pudo archivar el registro.");return false;}
  };
  const restore = async (id: string) => {
    try{return await save(restoreFromTrash(data,id),"Registro restaurado desde la papelera");}
    catch(cause){setError(cause instanceof Error?cause.message:"No se pudo restaurar el registro.");return false;}
  };
  const exportContent = () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], {type: "application/json"}));
    const link = document.createElement("a");
    link.href = url; link.download = "ksoft-contenido.json"; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const publish=async()=>{
    if(role!=="admin"||!cloudEnabled||blocked||busy.current||loading)return false;
    busy.current=true;setSaving(true);
    try{await publishCloudSite(revision.current);setError("");setNotice("Contenido publicado en la web. Los borradores y datos internos permanecen privados.");return true;}
    catch(cause){setError(cause instanceof Error?cause.message:"No se pudo publicar.");return false;}
    finally{busy.current=false;setSaving(false);}
  };
  const refresh=async()=>{
    if(!cloudEnabled||busy.current||loading)return false;
    if(!window.dispatchEvent(new Event("ksoft:before-module-change",{cancelable:true})))return false;
    setLoading(true);
    try{const result=await loadCloudWorkspace(role);revision.current=result.revision;if(result.data)setData(result.data);setError("");return true;}
    catch{setError("No se pudieron actualizar los registros. Tus datos actuales se conservan.");return false;}
    finally{setLoading(false);}
  };
  return <AdminContext.Provider value={{data, save, trash, restore,cloud:cloudEnabled,saving,publish,role,refresh}}>
    <div className={styles.dashboardLayout}><SidebarAdmin /><div className={styles.mainArea}>
      <NavbarAdmin />
      <main id="main-content" tabIndex={-1} className={styles.content}>
        <aside className={styles.localNotice}><div><strong>Panel de Ksoft · {role==="developer"?"Development":role==="qa"?"Calidad":role==="employee"?"Equipo":"Administración"}</strong><p>{role!=="admin"?"Tu espacio para colaborar con el equipo, consultar tus responsabilidades y resolver solicitudes internas.":cloudEnabled?"Guarda borradores o usa Publicar en la web desde cada editor. Los datos internos permanecen privados.":"Los registros se guardan en este navegador. La conexión con Ksoft todavía no está configurada."}</p></div>{role==="admin"&&<button type="button" onClick={exportContent} disabled={loading||blocked}>Exportar respaldo</button>}</aside>
        {error && <p ref={errorRef} tabIndex={-1} role="alert" className={styles.error}>{error}</p>}
        {cloudEnabled&&<div><button type="button" className={styles.refreshButton} disabled={saving||loading} onClick={()=>void refresh()}>Actualizar registros</button></div>}
        <div role="status" className={styles.saveNotice}>{notice}{undoId&&<button type="button" className={styles.undoButton} onClick={()=>restore(undoId)}>Deshacer envío a papelera</button>}</div>
        {loading?<p role="status">Cargando tu espacio de trabajo…</p>:cloudEnabled&&blocked?<button type="button" onClick={()=>window.location.reload()}>Volver a intentar</button>:<fieldset className={styles.workspace} disabled={saving} aria-busy={saving}><Outlet /></fieldset>}
      </main>
    </div></div>
  </AdminContext.Provider>;
}
