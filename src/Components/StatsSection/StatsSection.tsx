import styles from "./StatsSection.module.css";

interface Stat {
  label: string;
  value: string;
}

interface StatsSectionProps {
  stats: Stat[];
}

export const StatsSection = ({ stats }: StatsSectionProps) => {
  const iconFor = (label: string) => {
    const key = label.toLowerCase();
    if (key.includes("proy")) return "📁";
    if (key.includes("clie")) return "👥";
    if (key.includes("cal")) return "💎";
    if (key.includes("sop") || key.includes("support")) return "🎧";
    return "✨";
  };

  return (
    <section className={styles.statsSection}>
      <div className={styles.container}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.card}>
            <div className={styles.topRow}>
              <span className={styles.icon} aria-hidden="true">
                {iconFor(stat.label)}
              </span>
              <h3>{stat.value}</h3>
            </div>
            <p className={styles.label}>{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
