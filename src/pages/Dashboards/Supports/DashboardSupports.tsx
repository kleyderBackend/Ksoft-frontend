import { SupportsManager } from "../../../Components/dashboards/components/Supports/SupportsManager";
import styles from "./DashboardSupports.module.css";

export const DashboardSupports = () => {
  return (
    <>
      <header className={styles.header}>
        <p className={styles.eyebrow}>GESTIÓN DE KSOFT</p>
        <h1 className={styles.title}>Soporte</h1>
        <p className={styles.subtitle}>Registra solicitudes, sigue su estado y deja constancia de la solución.</p>
      </header>
      <SupportsManager />
    </>
  );
};
