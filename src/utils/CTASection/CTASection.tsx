import styles from "./CTASection.module.css";

export const CTASection = () => {
  return (
    <section className={styles.container}>
      <h2>¿Necesitas algo personalizado?</h2>
      <p>Desarrollamos soluciones a la medida de tu negocio.</p>
      <button>Contáctanos</button>
    </section>
  );
};