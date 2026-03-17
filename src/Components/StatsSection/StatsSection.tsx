import styles from "./StatsSection.module.css";

interface Stat {
  label: string;
  value: string;
}

interface StatsSectionProps {
  stats: Stat[];
}

export const StatsSection = ({ stats }: StatsSectionProps) => {
  return (
    <section className={styles.statsSection}>
      <div className={styles.container}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.card}>
            <h3>{stat.value}</h3>
            <p>{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
