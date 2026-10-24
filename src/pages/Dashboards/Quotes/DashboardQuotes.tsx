import { QuotesManager } from "../../../Components/dashboards/components/Quotes/QuotesManager";
import styles from "./DashboardQuotes.module.css";

export const DashboardQuotes = () => {
  return (
    <>
      <header className={styles.header}>
        <p className={styles.eyebrow}>GESTIÓN DE KSOFT</p>
        <h1 className={styles.title}>Cotizaciones</h1>
        <p className={styles.subtitle}>Prepara propuestas comerciales y sigue su aceptación. Puedes imprimirlas o guardarlas como PDF desde el navegador.</p>
      </header>
      <QuotesManager />
    </>
  );
};
