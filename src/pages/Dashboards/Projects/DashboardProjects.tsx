import { ProjectsManager } from "../../../Components/dashboards/components/Projects/ProjectsManager";
import styles from "./DashboardProjects.module.css";

export const DashboardProjects = () => {
  return (
    <>
      <header className={styles.header}>
        <p className={styles.eyebrow}>GESTIÓN DE KSOFT</p>
        <h1 className={styles.title}>Proyectos</h1>
        <p className={styles.subtitle}>Gestiona proyectos de clientes, productos SaaS y proyectos propios de Ksoft. Organiza el equipo, el alcance y sus tareas.</p>
      </header>
      <ProjectsManager />
    </>
  );
};
