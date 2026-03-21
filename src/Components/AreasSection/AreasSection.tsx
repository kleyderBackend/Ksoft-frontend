import styles from "./AreasSection.module.css";

interface Area {
  title: string;
  icon: React.ReactNode;
}

interface AreasSectionProps {
  areas: Area[];
}

export const AreasSection = ({ areas }: AreasSectionProps) => {
  return (
    <section className={styles.areasSection}>
      <header className={styles.header}>
        <h2>Nuestras Áreas</h2>
        <div className={styles.divider} aria-hidden="true" />
      </header>

      <div className={styles.container}>
        {areas.map((area, index) => (
          <div key={index} className={styles.card}>
            <span className={styles.icon}>{area.icon}</span>
            <p>{area.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
