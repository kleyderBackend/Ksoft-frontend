import { BusinessManager } from "../shared/BusinessManager/BusinessManager";
import styles from "./QuotesManager.module.css";

export const QuotesManager = () => {
  return (
    <section className={styles.container}>
      <BusinessManager module="quotes" />
    </section>
  );
};
