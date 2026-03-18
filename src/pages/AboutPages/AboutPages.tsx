import { Footer } from "../../Components/Footer/Footer";
import { HeaderSection } from "../../Components/HeaderSection/HeaderSection";
import { Navbar } from "../../Components/Navbar/Navbar";
import { OurHistory } from "../../Components/OurHistory/OurHistory";
import { OurMission } from "../../Components/OurMision/OurMission";
import { OurValues } from "../../Components/OurValues/OurValues";
import { OurVision } from "../../Components/OurVission/OurVission";
import styles from "./AboutPages.module.css";

export const AboutPages = () => {
  return (
    <>
      <Navbar title="KSoft" imglogo="/img/logo.png" />
      <main className={styles.miainContainerAbout}>
        <HeaderSection
          title="Quiénes somos"
          subTitle="Impulsando el futuro digital"
        />

        <OurHistory
          title="Nuestra Historia"
          description={`Ksoft nace con una idea clara: construir soluciones digitales que no solo funcionen, sino que realmente generen impacto.

Comenzamos como un proyecto enfocado en el desarrollo de software moderno, enfrentando los mismos retos que muchas startups: recursos limitados, alta competencia y la necesidad de diferenciarnos.

Con el tiempo, evolucionamos hacia un enfoque más estratégico, combinando desarrollo, automatización y soluciones escalables. Hoy, Ksoft se posiciona como una startup enfocada en crear productos digitales eficientes, confiables y preparados para el crecimiento.`}
        />

        <section style={{ display: "flex", gap: "20px" }}>
          <OurMission
            title="Nuestra Misión"
            description="Diseñar y desarrollar soluciones digitales inteligentes que ayuden a empresas a optimizar procesos y escalar sus operaciones."
          />

          <OurVision
            title="Nuestra Visión"
            description="Convertirnos en una startup referente en innovación tecnológica, creando productos SaaS que transformen empresas."
          />
        </section>

        <OurValues
          values={[
            {
              title: "Innovación",
              description:
                "Buscamos nuevas formas de resolver problemas con tecnología.",
              icon: "🚀",
            },
            {
              title: "Calidad",
              description: "Construimos soluciones sólidas y mantenibles.",
              icon: "💎",
            },
            {
              title: "Compromiso",
              description: "Nos enfocamos en resultados reales.",
              icon: "🔥",
            },
            {
              title: "Confianza",
              description: "Relaciones basadas en transparencia.",
              icon: "🤝",
            },
          ]}
        />
      </main>
      <Footer />
    </>
  );
};
