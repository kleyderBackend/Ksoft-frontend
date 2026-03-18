import styles from "./OurHistory.module.css";

interface OurHistoryProps {
  title: string;
  description: string;
}

export const OurHistory = ({ title, description }: OurHistoryProps) => {
  return (
    <section className={styles.container}>
      <h2>{title}</h2>
      <p>{description}</p>
    </section>
  );
};