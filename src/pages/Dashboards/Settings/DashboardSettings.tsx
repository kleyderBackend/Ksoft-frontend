import { SettingsManager } from "../../../Components/dashboards/components/Settings/SettingsManager";
import styles from "./DashboardSettings.module.css";

export const DashboardSettings = () => {
  return (
    <>
      <header className={styles.header}>
        <p className={styles.eyebrow}>GESTIÓN DE KSOFT</p>
        <h1 className={styles.title}>Configuración</h1>
        <p className={styles.subtitle}>Personaliza el espacio de trabajo y administra sus copias de respaldo.</p>
      </header>
      <SettingsManager />
    </>
  );
};
