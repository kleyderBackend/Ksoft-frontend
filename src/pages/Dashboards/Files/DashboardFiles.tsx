import { FilesManager } from "../../../Components/dashboards/components/Files/FilesManager";
import styles from "./DashboardFiles.module.css";

export const DashboardFiles = () => {
  return (
    <>
      <header className={styles.header}>
        <p className={styles.eyebrow}>GESTIÓN DE KSOFT</p>
        <h1 className={styles.title}>Archivos</h1>
        <p className={styles.subtitle}>Guarda documentos e imágenes pequeños y relaciónalos con un proyecto.</p>
      </header>
      <FilesManager />
    </>
  );
};
