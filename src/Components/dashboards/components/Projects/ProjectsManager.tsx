import { useState } from "react";
import { useLocation } from "react-router-dom";
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
  return <section className={styles.container}><div className={styles.tabs} role="group" aria-label="Gestión de proyectos"><button type="button" aria-pressed={view==="internal"} onClick={()=>changeView("internal")}>Gestión interna</button><button type="button" aria-pressed={view==="public"} onClick={()=>changeView("public")}>Presentación pública</button></div>{view==="internal"?<BusinessManager module="projects" />:<ProjectsPublicManager />}</section>;
};

