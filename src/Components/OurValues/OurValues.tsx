import styles from "./OurValues.module.css";

interface Value {
  title: string;
  description: string;
  icon: string;
}

interface OurValuesProps {
  values: Value[];
}

export const OurValues = ({ values }: OurValuesProps) => {
  return (
    <section className={styles.container}>
      <h2>Nuestros Valores</h2>

      <div className={styles.grid}>
        {values.map((value, index) => (
          <div key={index} className={styles.card}>
            <span className={styles.icon}>{value.icon}</span>
            <h4>{value.title}</h4>
            <p>{value.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};