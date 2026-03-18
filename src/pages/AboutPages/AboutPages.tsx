import { Footer } from "../../Components/Footer/Footer";
import { Navbar } from "../../Components/Navbar/Navbar";
import { OurHistory } from "../../Components/OurHistory/OurHistory";
import { OurMission } from "../../Components/OurMision/OurMission";
import { OurVision } from "../../Components/OurVission/OurVission";
import styles from "./AboutPages.module.css";

export const AboutPages = () => {
  const values = [
    { title: "Innovación", icon: "💡" },
    { title: "Calidad", icon: "🛡️" },
    { title: "Compromiso", icon: "🤍" },
    { title: "Confianza", icon: "🤝" },
  ];

  return (
    <>
      <Navbar title="KSoft" imglogo="/img/logo.png" />
      <main className={styles.miainContainerAbout}>
        <section className={styles.aboutHero}>
          <div className={styles.aboutHeroInner}>
            <div className={styles.eyebrow}>NOSOTROS</div>

            <div className={styles.brandRow}>
              <img className={styles.heroLogo} src="/img/logo.png" alt="Ksoft" />
              <h1 className={styles.heroTitle}>Ksoft</h1>
            </div>

            <p className={styles.heroSubtitle}>
              <span>Impulsando el Futuro Digital</span>
            </p>
          </div>
        </section>

        <OurHistory
          title="Nuestra Historia"
          description={`Ksoft nace con una idea clara: construir soluciones digitales que no solo funcionen, sino que realmente generen impacto.

Comenzamos como un proyecto enfocado en el desarrollo de software moderno, enfrentando los mismos retos que muchas startups: recursos limitados, alta competencia y la necesidad de diferenciarnos.

Con el tiempo, evolucionamos hacia un enfoque más estratégico, combinando desarrollo, automatización y soluciones escalables. Hoy, Ksoft se posiciona como una startup enfocada en crear productos digitales eficientes, confiables y preparados para el crecimiento.`}
        />

        <section className={styles.missionVisionSection}>
          <div className={styles.missionCol}>
            <OurMission
              title="Nuestra Misión"
              description="Diseñar y desarrollar soluciones digitales inteligentes que ayuden a empresas a optimizar procesos y escalar sus operaciones."
            />
          </div>

          <div className={styles.visualCol} aria-hidden="true">
            <div className={styles.visualCard}>
              <img src="/img/imgHero.jpg" alt="" />
              <div className={styles.visualOverlay} />
            </div>
            <div className={styles.visionFloat}>
              <OurVision
                title="Nuestra Visión"
                description="Convertirnos en una startup referente en innovación tecnológica, creando productos SaaS que transformen empresas."
              />
            </div>
          </div>
        </section>

        <section className={styles.valuesSection}>
          <h2 className={styles.valuesTitle}>Nuestros Valores</h2>
          <div className={styles.valuesRow}>
            {values.map((v) => (
              <div key={v.title} className={styles.valueItem}>
                <div className={styles.valueIcon} aria-hidden="true">
                  {v.icon}
                </div>
                <div className={styles.valueLabel}>{v.title}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};
