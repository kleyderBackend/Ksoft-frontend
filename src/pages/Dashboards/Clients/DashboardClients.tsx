import { ClientsManager } from "../../../Components/dashboards/components/Clients/ClientsManager";
import styles from "./DashboardClients.module.css";

export const DashboardClients = () => {
  return (
    <>
      <header className={styles.header}>
        <p className={styles.eyebrow}>GESTIÓN DE KSOFT</p>
        <h1 className={styles.title}>Clientes</h1>
        <p className={styles.subtitle}>Consulta los datos de tus clientes y su relación con proyectos, cotizaciones y pagos.</p>
      </header>
      <ClientsManager />
    </>
  );
};
