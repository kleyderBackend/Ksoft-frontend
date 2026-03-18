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
      <header className={styles.header}>
        <div className={styles.eyebrow}>CULTURA</div>
        <h2>Nuestros Valores</h2>
        <p className={styles.subtitle}>
          Principios que guían cada decisión, cada entrega y cada producto.
        </p>
        <div className={styles.rule} aria-hidden="true" />
      </header>

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