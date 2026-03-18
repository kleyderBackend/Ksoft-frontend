import { Navbar } from "../../Components/Navbar/Navbar";
import { HeaderSection } from "../../Components/HeaderSection/HeaderSection";
import { ProductsGrid } from "../../Components/ProductsGrid/ProductsGrid";
import { CTASection } from "../../utils/CTASection/CTASection";
import { Footer } from "../../Components/Footer/Footer";
import styles from "./ProductPages.module.css";

export const ProductsPage = () => {
  return (
    <>
      <Navbar title="KSoft" imglogo="/img/logo.png" />

      <main className={styles.container}>
        <HeaderSection
          title="Nuestros productos"
          subTitle="Soluciones digitales diseñadas para escalar tu negocio"
        />

        <ProductsGrid
          products={[
            {
              name: "SaaS Dental",
              description: "Gestión completa para clínicas dentales.",
              icon: "🦷",
              buttonText: "Próximamente",
              comingSoon: true,
            },
            {
              name: "E-commerce",
              description: "Tiendas online rápidas y escalables.",
              icon: "🛒",
              buttonText: "Próximamente",
              comingSoon: true,
            },
            {
              name: "CRM",
              description: "Administra clientes y ventas fácilmente.",
              icon: "📊",
              buttonText: "Próximamente",
              comingSoon: true,
            },
            {
              name: "Apps personalizadas",
              description: "Soluciones hechas a medida.",
              icon: "📱",
              buttonText: "Cotizar",
              href: "/contact",
            },
          ]}
        />

        <CTASection />
      </main>

      <Footer />
    </>
  );
};
