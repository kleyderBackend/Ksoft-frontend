import { BusinessManager } from "../shared/BusinessManager/BusinessManager";
import styles from "./SupportsManager.module.css";

export const SupportsManager = () => {
  return (
    <section className={styles.container}>
      <BusinessManager module="supports" />
    </section>
  );
};
