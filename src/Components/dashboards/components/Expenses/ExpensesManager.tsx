import { BusinessManager } from "../shared/BusinessManager/BusinessManager";
import styles from "./ExpensesManager.module.css";

export const ExpensesManager = () => {
  return (
    <section className={styles.container}>
      <BusinessManager module="expenses" />
    </section>
  );
};
