import { BusinessManager } from "../shared/BusinessManager/BusinessManager";
import styles from "./FilesManager.module.css";

export const FilesManager = () => {
  return (
    <section className={styles.container}>
      <BusinessManager module="files" />
    </section>
  );
};
