import styles from "./RecentActivity.module.css";

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  time: string;
  status?: "pending" | "in-progress" | "done" | "warning";
}

interface RecentActivityProps {
  items?: ActivityItem[];
  title?: string;
  subtitle?: string;
}

export const RecentActivity = ({
  items = [],
  title = "Actividad reciente",
  subtitle = "Seguimiento a cotizaciones, proyectos y soporte",
}: RecentActivityProps) => {
  return (
    <section className={styles.sectionPanel}>
      <header className={styles.panelHeader}>
        <div className={styles.panelTitleGroup}>
          <h2 className={styles.panelTitle}>{title}</h2>
          <p className={styles.panelSubtitle}>{subtitle}</p>
        </div>
      </header>
      {items.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No hay actividad reciente para mostrar.</p>
        </div>
      ) : (
        <ul className={styles.list}>
          {items.map((item) => (
            <li key={item.id} className={styles.item}>
              <div className={styles.itemContent}>
                <p className={styles.itemTitle}>{item.title}</p>
                <p className={styles.itemDescription}>{item.description}</p>
              </div>
              <div className={styles.itemMeta}>
                <span className={styles.itemTime}>{item.time}</span>
                {item.status && <span className={styles.status} data-status={item.status} />}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
