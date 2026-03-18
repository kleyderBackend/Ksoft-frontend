import styles from "./CTASection.module.css";
import { useNavigate } from "react-router-dom";

export const CTASection = () => {
  const navigate = useNavigate();
  return (
    <section className={styles.container}>
      <h2>¿Listo para construir algo grande?</h2>
      <p>
        Contanos tu idea y te proponemos un plan claro, tiempos y un presupuesto
        realista.
      </p>
      <button type="button" onClick={() => navigate("/contact")}>
        Contáctanos
      </button>
    </section>
  );
};