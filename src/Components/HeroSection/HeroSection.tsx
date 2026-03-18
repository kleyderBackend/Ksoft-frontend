import styles from "./HeroSection.module.css";

interface HeroSectionProps {
  subTitile: string;
  descriptions: string;
  cta: () => void;
}

export const HeroSection = ({
  subTitile,
  descriptions,
  cta,
}: HeroSectionProps) => {
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
          <button className={styles.secondary} onClick={cta}>
            Conoce Más
          </button>
          <button className={styles.primary} onClick={cta}>
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
