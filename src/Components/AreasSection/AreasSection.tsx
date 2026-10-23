import styles from "./AreasSection.module.css";
import { Link } from "react-router-dom";

interface Area {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface AreasSectionProps {
  areas: Area[];
}

export const AreasSection = ({ areas }: AreasSectionProps) => {
  return (
    <section className={styles.areasSection} id="servicios">
      <header className={styles.header}>
        <p className={styles.eyebrow}>DESARROLLO PARA TU EMPRESA</p>
        <h2>Servicios adaptados a tu negocio</h2>
        <p className={styles.intro}>Definimos contigo el alcance y los entregables antes de comenzar, para construir una solución alineada con lo que necesitas.</p>
        <div className={styles.divider} aria-hidden="true" />
      </header>

      <div className={styles.container}>
        {areas.map((area, index) => (
          <article key={index} className={styles.card}>
            <span className={styles.icon} aria-hidden="true">{area.icon}</span>
            <h3>{area.title}</h3>
            <p>{area.description}</p>
            <Link to="/contact" aria-label={`Consultar servicio de ${area.title.toLowerCase()}`}>Consultar este servicio <span aria-hidden="true">↗</span></Link>
          </article>
        ))}
      </div>
    </section>
  );
};
