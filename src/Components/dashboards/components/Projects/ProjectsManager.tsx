import { useState } from "react";
import { Link,useLocation } from "react-router-dom";
import { BusinessManager } from "../shared/BusinessManager/BusinessManager";
import { ProjectsPublicManager } from "./ProjectsPublicManager";
import styles from "./ProjectsManager.module.css";
import {useAdmin} from "../../AdminContext";
export const ProjectsManager = () => {
  const {role}=useAdmin();
  const {search}=useLocation();
  const [view,setView] = useState(()=>new URLSearchParams(search).get("view")==="public"?"public":"internal");
  const changeView = (next: string) => { if (next !== view && window.dispatchEvent(new Event("ksoft:before-module-change", {cancelable:true}))) setView(next); };
  if(role!=="admin")return <BusinessManager module="projects"/>;
  return <section className={styles.container}><div className={styles.tabs} role="group" aria-label="Gestión de proyectos"><button type="button" aria-pressed={view==="internal"} onClick={()=>changeView("internal")}>Gestión interna</button><button type="button" aria-pressed={view==="public"} onClick={()=>changeView("public")}>Presentación pública</button></div>{view==="internal"?<><section className={styles.workspaceIntro}><h2>¿Qué vas a desarrollar?</h2><p>Un proyecto agrupa el alcance, las tareas y su equipo. Los productos SaaS y los proyectos propios no necesitan cliente ni cotización.</p><div className={styles.quickActions}><Link to="/dashboard/projects?action=new&type=Cliente">Proyecto para cliente</Link><Link to="/dashboard/projects?action=new&type=SaaS%20propio">SaaS propio</Link><Link to="/dashboard/projects?action=new&type=Proyecto%20propio">Proyecto propio</Link></div><small>Guarda el proyecto y asigna su equipo. Después crea sus tareas y asigna a los responsables entre los integrantes del proyecto.</small></section><BusinessManager module="projects" /></>:<ProjectsPublicManager />}</section>;
};

