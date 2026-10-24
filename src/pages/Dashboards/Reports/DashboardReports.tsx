import { ReportsManager } from "../../../Components/dashboards/components/Reports/ReportsManager";
import styles from "./DashboardReports.module.css";

export const DashboardReports = () => {
  return (
    <>
      <header className={styles.header}>
        <p className={styles.eyebrow}>GESTIÓN DE KSOFT</p>
        <h1 className={styles.title}>Reportes</h1>
        <p className={styles.subtitle}>Consulta el resultado de los registros financieros y el avance del trabajo de Ksoft.</p>
      </header>
      <ReportsManager />
    </>
  );
};
