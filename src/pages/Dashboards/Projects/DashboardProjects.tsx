import { ProjectsManager } from "../../../Components/dashboards/components/Projects/ProjectsManager";
import styles from "./DashboardProjects.module.css";

export const DashboardProjects = () => {
  return (
    <>
      <header className={styles.header}>
        <p className={styles.eyebrow}>GESTIÓN DE KSOFT</p>
        <h1 className={styles.title}>Proyectos</h1>
        <p className={styles.subtitle}>Gestiona el trabajo interno y prepara las tarjetas y páginas públicas de tus proyectos.</p>
      </header>
      <ProjectsManager />
    </>
  );
};
