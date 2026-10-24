import { BusinessManager } from "../shared/BusinessManager/BusinessManager";
import styles from "./ContactsManager.module.css";

export const ContactsManager = () => {
  return (
    <section className={styles.container}>
      <BusinessManager module="contacts" />
    </section>
  );
};
