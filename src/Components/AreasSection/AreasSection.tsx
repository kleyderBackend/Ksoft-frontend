import styles from "./AreasSection.module.css";
import { Link } from "react-router-dom";

interface Area {
  title: string;
  description: string;
  icon: React.ReactNode;
  includes: string[];
  example: string;
}

interface AreasSectionProps {
  areas: Area[];
}

export const AreasSection = ({ areas }: AreasSectionProps) => {
  return (
    <section className={styles.areasSection} id="servicios" aria-labelledby="services-title">
      <header className={styles.header}>
        <p className={styles.eyebrow}>DESARROLLO PARA TU EMPRESA</p>
        <h2 id="services-title">De una necesidad a una solución concreta</h2>
        <p className={styles.intro}>Elige el punto de partida para tu proyecto. Estas son las áreas en las que podemos ayudarte y los entregables que podemos acordar contigo.</p>
        <div className={styles.divider} aria-hidden="true" />
      </header>

      <div className={styles.container}>
        {areas.map((area) => (
          <article key={area.title} className={styles.card}>
            <span className={styles.icon} aria-hidden="true">{area.icon}</span>
            <h3>{area.title}</h3>
            <p>{area.description}</p>
            <h4>Qué podemos incluir</h4>
            <ul className={styles.includes}>
              {area.includes.map((item) => <li key={item}>{item}</li>)}
            </ul>
            <div className={styles.example}>
              <span>Ejemplo de entrega</span>
              <p>{area.example}</p>
            </div>
            <Link to="/contact" aria-label={`Consultar servicio de ${area.title.toLowerCase()}`}>Consultar este servicio <span aria-hidden="true">↗</span></Link>
          </article>
        ))}
      </div>
      <p className={styles.scopeNote}>Los ejemplos son orientativos. Las funciones, integraciones, publicación y soporte se concretan en la propuesta de cada proyecto.</p>
      <div className={styles.start}>
        <div>
          <p className={styles.eyebrow}>CÓMO COMENZAR</p>
          <h3>Cuéntanos qué quieres resolver</h3>
          <p>No necesitas llegar con una especificación técnica. Comparte cómo trabajas hoy, qué quieres mejorar y si tienes una fecha objetivo.</p>
          <Link to="/contact">Conversar sobre mi proyecto <span aria-hidden="true">→</span></Link>
        </div>
        <ol className={styles.startSteps}>
          <li><strong>Primera conversación</strong><span>Revisamos tu necesidad y aclaramos los requisitos.</span></li>
          <li><strong>Propuesta para revisar</strong><span>Definimos entregables, presupuesto, tiempos estimados y condiciones.</span></li>
          <li><strong>Inicio acordado</strong><span>Con la propuesta aprobada y el anticipo acordado, confirmamos la fecha de inicio según disponibilidad.</span></li>
        </ol>
      </div>
    </section>
  );
};
