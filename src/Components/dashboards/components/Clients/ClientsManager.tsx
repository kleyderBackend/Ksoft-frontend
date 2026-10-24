import { BusinessManager } from "../shared/BusinessManager/BusinessManager";
import styles from "./ClientsManager.module.css";

export const ClientsManager = () => {
  return (
    <section className={styles.container}>
      <BusinessManager module="clients" />
    </section>
  );
};
