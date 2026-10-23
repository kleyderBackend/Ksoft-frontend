import { Link } from "react-router-dom";
import styles from "./HeroSection.module.css";

interface HeroSectionProps {
  subTitile: string;
  descriptions: string;
}

export const HeroSection = ({
  subTitile,
  descriptions,
}: HeroSectionProps) => {
  return (
    <section className={styles.stnContainer}>
      {/* TEXTO */}
      <div className={styles.left}>
        <p className={styles.eyebrow}>KSOFT TECHNOLOGY</p>
        <h1>
          <span>{subTitile}</span>
        </h1>

        <p>{descriptions}</p>

        <div className={styles.buttons}>
          <Link className={styles.primary} to="/contact">Cotizar un proyecto</Link>
          <Link className={styles.secondary} to="/products">Explorar nuestros productos</Link>
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
