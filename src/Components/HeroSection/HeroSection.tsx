import { useNavigate } from "react-router-dom";
import styles from "./HeroSection.module.css";

interface HeroSectionProps {
  subTitile: string;
  descriptions: string;
}

export const HeroSection = ({
  subTitile,
  descriptions,
}: HeroSectionProps) => {
  const navigate = useNavigate();
  return (
    <section className={styles.stnContainer}>
      {/* TEXTO */}
      <div className={styles.left}>
        <h1>
          Ksoft <br />
          <span>{subTitile}</span>
        </h1>

        <p>{descriptions}</p>

        <div className={styles.buttons}>
          <button
            className={styles.secondary}
            onClick={() => navigate("/about")}
          >
            Conoce Más
          </button>
          <button className={styles.primary} onClick={() => navigate("/contact")}>
            Comenzar Proyecto
          </button>
        </div>
      </div>

      {/* VISUAL */}
      <div className={styles.right} aria-hidden="true">
        <div className={styles.visualCard}>
          <img src="/img/imgHero.jpg" alt="" />
        </div>
      </div>
    </section>
  );
};
