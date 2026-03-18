import styles from "./OurHistory.module.css";

interface OurHistoryProps {
  title: string;
  description: string;
}

export const OurHistory = ({ title, description }: OurHistoryProps) => {
  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <div className={styles.eyebrow}>HISTORIA</div>
        <h2>{title}</h2>
        <div className={styles.rule} aria-hidden="true" />
      </header>

      <div className={styles.card}>
        <p>{description}</p>
      </div>
    </section>
  );
};