import { ExpensesManager } from "../../../Components/dashboards/components/Expenses/ExpensesManager";
import styles from "./DashboardExpenses.module.css";

export const DashboardExpenses = () => {
  return (
    <>
      <header className={styles.header}>
        <p className={styles.eyebrow}>GESTIÓN DE KSOFT</p>
        <h1 className={styles.title}>Gastos</h1>
        <p className={styles.subtitle}>Lleva el control de tus gastos operativos y compromisos de pago.</p>
      </header>
      <ExpensesManager />
    </>
  );
};
