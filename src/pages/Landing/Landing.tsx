import { Link } from "react-router-dom";
import { FaCode, FaGlobe, FaLaptopCode, FaTooth, FaArrowRight, FaCheck } from "react-icons/fa";
import { AreasSection } from "../../Components/AreasSection/AreasSection";
import { Footer } from "../../Components/Footer/Footer";
import { HeroSection } from "../../Components/HeroSection/HeroSection";
import { Navbar } from "../../Components/Navbar/Navbar";
import { products } from "../../config/products";
import styles from "./Landing.module.css";

const steps = [
  { title: "Entendemos tu necesidad", description: "Conversamos sobre tu negocio, tus objetivos y el problema que quieres resolver." },
  { title: "Definimos el alcance", description: "Acordamos los requisitos, las funcionalidades y los entregables de tu proyecto." },
  { title: "Presentamos la propuesta", description: "Recibes una propuesta con el alcance, el presupuesto y los tiempos estimados." },
  { title: "Confirmamos el inicio", description: "Programamos el proyecto según disponibilidad, con la propuesta aprobada y el anticipo acordado." },
  { title: "Desarrollamos y revisamos", description: "Construimos la solución y revisamos contigo las entregas parciales. Los cambios de alcance se evalúan antes de ejecutarlos." },
  { title: "Entregamos la solución", description: "Realizamos la entrega final según el alcance aprobado y las condiciones de pago acordadas." },
];

export const Landing = () => (
  <>
    <Navbar title="Ksoft" imglogo="/img/logo.png" />
    <main id="main-content" tabIndex={-1} className={styles.conatinerLading}>
      <HeroSection
        subTitile="Software a medida y productos SaaS para tu empresa"
        descriptions="En Ksoft Technology desarrollamos sitios web, aplicaciones y sistemas adaptados a las necesidades de tu negocio. También creamos productos SaaS propios que puedes utilizar mediante suscripción."
      />

      <div className={styles.commitments} aria-label="Nuestra forma de trabajar">
        {["Alcance definido antes de comenzar", "Cambios con aprobación previa", "Respuesta en hasta 24 horas hábiles"].map((text) => (
          <p key={text}><FaCheck aria-hidden="true" />{text}</p>
        ))}
      </div>

      <AreasSection areas={[
        { title: "Software a medida", icon: <FaCode />, description: "Desarrollamos sistemas adaptados a los procesos y necesidades de tu empresa, con un alcance definido antes de comenzar." },
        { title: "Sitios web", icon: <FaGlobe />, description: "Creamos sitios web para presentar tu negocio, comunicar tu oferta y facilitar el contacto con tus clientes." },
        { title: "Aplicaciones", icon: <FaLaptopCode />, description: "Desarrollamos aplicaciones según los objetivos y requisitos de tu proyecto, con las funcionalidades acordadas contigo." },
      ]} />

      <section className={styles.productsSection} aria-labelledby="products-title">
        <div className={styles.productIntro}>
          <p className={styles.eyebrow}>PRODUCTOS DE KSOFT</p>
          <h2 id="products-title">También construimos<br />nuestros propios productos</h2>
          <p>Además del desarrollo a medida, creamos plataformas SaaS para necesidades de sectores específicos. Su acceso se ofrece mediante suscripción o licencia, según las condiciones de cada producto.</p>
          <Link className={styles.textLink} to="/products">Conocer nuestros productos <FaArrowRight aria-hidden="true" /></Link>
        </div>
        <article className={styles.productCard}>
          <div className={styles.productTop}>
            <span className={styles.productIcon}><FaTooth aria-hidden="true" /></span>
            <span className={styles.badge}>Acceso anticipado</span>
          </div>
          <p className={styles.productCategory}>SOFTWARE PARA CLÍNICAS DENTALES</p>
          <h3>{products[0].name}</h3>
          <p>{products[0].description}</p>
          <a className={styles.textLink} href={products[0].href} target="_blank" rel="noopener noreferrer">Explorar SaaS Dental <span className={styles.srOnly}>(abre en una pestaña nueva)</span><FaArrowRight aria-hidden="true" /></a>
        </article>
      </section>

      <section className={styles.processSection} aria-labelledby="process-title">
        <header className={styles.sectionHeader}>
          <p className={styles.eyebrow}>DE LA IDEA A LA ENTREGA</p>
          <h2 id="process-title">Así trabajamos contigo</h2>
          <p>Un proceso claro para nuestros proyectos de desarrollo, con acuerdos definidos y comunicación durante cada etapa.</p>
        </header>
        <ol className={styles.steps}>
          {steps.map((step, index) => (
            <li key={step.title}>
              <span className={styles.stepNumber} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.contactSection} aria-labelledby="contact-title">
        <p className={styles.eyebrow}>HABLEMOS DE TU NEGOCIO</p>
        <h2 id="contact-title">Encuentra el siguiente paso<br />para tu empresa</h2>
        <p>Cuéntanos qué necesitas desarrollar o consulta sobre nuestros productos SaaS. Te orientamos sobre las opciones de Ksoft.</p>
        <Link className={styles.contactButton} to="/contact">Contactar con Ksoft <FaArrowRight aria-hidden="true" /></Link>
        <p className={styles.responseTime}>Tiempo estimado de respuesta: hasta 24 horas hábiles.</p>
      </section>
    </main>
    <Footer />
  </>
);
