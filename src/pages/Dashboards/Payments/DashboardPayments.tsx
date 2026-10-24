import { PaymentsManager } from "../../../Components/dashboards/components/Payments/PaymentsManager";
import styles from "./DashboardPayments.module.css";

export const DashboardPayments = () => {
  return (
    <>
      <header className={styles.header}>
        <p className={styles.eyebrow}>GESTIÓN DE KSOFT</p>
        <h1 className={styles.title}>Pagos</h1>
        <p className={styles.subtitle}>Registra cobros, vencimientos y pagos recibidos de tus clientes.</p>
      </header>
      <PaymentsManager />
    </>
  );
};
