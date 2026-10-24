import { BusinessManager } from "../shared/BusinessManager/BusinessManager";
import styles from "./PaymentsManager.module.css";

export const PaymentsManager = () => {
  return (
    <section className={styles.container}>
      <BusinessManager module="payments" />
    </section>
  );
};
