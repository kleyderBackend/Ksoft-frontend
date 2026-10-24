import { BusinessManager } from "../shared/BusinessManager/BusinessManager";
import styles from "./TasksManager.module.css";

export const TasksManager = () => {
  return (
    <section className={styles.container}>
      <BusinessManager module="tasks" />
    </section>
  );
};
