import { NotificationsManager } from "../../../Components/dashboards/components/Notifications/NotificationsManager";
import styles from "./DashboardNotifications.module.css";

export const DashboardNotifications = () => {
  return (
    <>
      <header className={styles.header}>
        <p className={styles.eyebrow}>GESTIÓN DE KSOFT</p>
        <h1 className={styles.title}>Notificaciones</h1>
        <p className={styles.subtitle}>Revisa los vencimientos pendientes y los cambios guardados en el panel.</p>
      </header>
      <NotificationsManager />
    </>
  );
};
