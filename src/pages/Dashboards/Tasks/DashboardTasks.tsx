import { TasksManager } from "../../../Components/dashboards/components/Tasks/TasksManager";
import styles from "./DashboardTasks.module.css";

export const DashboardTasks = () => {
  return (
    <>
      <header className={styles.header}>
        <p className={styles.eyebrow}>GESTIÓN DE KSOFT</p>
        <h1 className={styles.title}>Tareas</h1>
        <p className={styles.subtitle}>Convierte el trabajo pendiente en tareas con responsables y fechas.</p>
      </header>
      <TasksManager />
    </>
  );
};
