import { AreasSection } from "../../Components/AreasSection/AreasSection";
import { Footer } from "../../Components/Footer/Footer";
import { HeroSection } from "../../Components/HeroSection/HeroSection";
import { Navbar } from "../../Components/Navbar/Navbar";
import { StatsSection } from "../../Components/StatsSection/StatsSection";
import styles from "./Landing.module.css";
export const Landing = () => {
  return (
    <>
      <Navbar title="KSoft" imglogo="/img/logo.png" />
      <main className={styles.conatinerLading}>
        <HeroSection
          subTitile="Innovamos. Desarrollamos. Escalamos"
          descriptions="Transformamos Ideas en soluciones digitales de alto impacto"
          cta={() => alert("Acción ejecutada")}
        />
        <StatsSection
          stats={[
            { label: "Proyectos", value: "10+" },
            { label: "Clientes", value: "50+" },
            { label: "Calidad", value: "100%" },
            { label: "Soporte", value: "24/7" },
          ]}
        />
        <AreasSection
          areas={[
            { title: "Desarrollo Web", icon: "🌐" },
            { title: "Apps móviles", icon: "📱" },
            { title: "Cloud", icon: "☁️" },
            { title: "AI", icon: "🤖" },
          ]}
        />
      </main>
      <Footer />
    </>
  );
};
