import { AreasSection } from "../../Components/AreasSection/AreasSection";
import { Footer } from "../../Components/Footer/Footer";
import { HeroSection } from "../../Components/HeroSection/HeroSection";
import { Navbar } from "../../Components/Navbar/Navbar";
import { StatsSection } from "../../Components/StatsSection/StatsSection";
import { FaCode, FaMobileAlt, FaServer, FaTools } from "react-icons/fa";
import styles from "./Landing.module.css";
export const Landing = () => {
  return (
    <>
      <Navbar title="KSoft" imglogo="/img/logo.png" />
      <main className={styles.conatinerLading}>
        <HeroSection
          subTitile="Innovamos. Desarrollamos. Escalamos"
          descriptions="Transformamos Ideas en soluciones digitales de alto impacto"
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
            { title: "Desarrollo Web", icon: <FaCode /> },
            { title: "Aplicaciones a Medida", icon: <FaServer /> },
            { title: "Interfaces Modernas", icon: <FaMobileAlt /> },
            { title: "Mantenimiento y Soporte", icon: <FaTools /> },
          ]}
        />
      </main>
      <Footer />
    </>
  );
};
