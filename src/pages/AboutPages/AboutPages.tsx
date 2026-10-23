import { Link } from "react-router-dom";
import { FaArrowRight, FaCode, FaLayerGroup, FaLightbulb, FaShieldAlt, FaHandshake, FaCheck, FaBullseye, FaCompass } from "react-icons/fa";
import { Footer } from "../../Components/Footer/Footer";
import { Navbar } from "../../Components/Navbar/Navbar";
import styles from "./AboutPages.module.css";

const values = [
  { title: "Innovación", icon: FaLightbulb, description: "Buscamos formas de resolver necesidades reales con software, tanto en proyectos a medida como en nuestros productos." },
  { title: "Calidad", icon: FaShieldAlt, description: "Orientamos el desarrollo a los requisitos acordados y revisamos contigo las entregas durante el proyecto." },
  { title: "Compromiso", icon: FaHandshake, description: "Definimos el alcance antes de comenzar y mantenemos la comunicación para avanzar con acuerdos claros." },
  { title: "Confianza", icon: FaCheck, description: "Cuidamos la información que compartes y evaluamos contigo los cambios antes de ejecutarlos." },
];

export const AboutPages = () => (
  <>
    <Navbar title="Ksoft" imglogo="/img/logo.png" />
    <main id="main-content" tabIndex={-1} className={styles.page}>
      <section className={styles.hero} aria-labelledby="about-title">
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>CONOCE KSOFT TECHNOLOGY</p>
          <h1 id="about-title">Creamos software.<br /><span>Construimos posibilidades.</span></h1>
          <p className={styles.lead}>Somos una empresa de desarrollo de software que une dos formas de aportar a tu negocio: soluciones a medida y productos SaaS propios.</p>
          <p className={styles.body}>Partimos de lo que tu empresa necesita para definir qué construir, cómo desarrollarlo y qué esperar de cada entrega.</p>
          <div className={styles.actions}>
            <Link className={styles.primaryLink} to="/contact">Hablemos de tu proyecto <FaArrowRight aria-hidden="true" /></Link>
            <Link className={styles.textLink} to="/products">Explorar nuestros productos <FaArrowRight aria-hidden="true" /></Link>
          </div>
        </div>
        <div className={styles.identityCard}>
          <div className={styles.identityTop}><span className={styles.statusDot} aria-hidden="true" />DESDE MEDELLÍN, COLOMBIA</div>
          <img src="/img/logo.png" alt="" className={styles.brandMark} width="180" height="180" />
          <p className={styles.brandName}>Ksoft <span>Technology</span></p>
          <p className={styles.brandCaption}>Ideas que se convierten en software.</p>
          <div className={styles.identityLines}>
            <span><FaCode aria-hidden="true" />Desarrollo a medida</span>
            <span><FaLayerGroup aria-hidden="true" />Productos SaaS propios</span>
          </div>
        </div>
      </section>

      <section className={styles.story} aria-labelledby="story-title">
        <div>
          <p className={styles.eyebrow}>LO QUE NOS MUEVE</p>
          <h2 id="story-title">Una idea clara.<br />Dos formas de hacerla realidad.</h2>
        </div>
        <div className={styles.storyCopy}>
          <p>Ksoft nace con una idea: construir soluciones digitales que respondan a necesidades concretas. Ese propósito guía tanto los proyectos que desarrollamos para nuestros clientes como los productos que creamos.</p>
          <p>En un proyecto a medida, trabajamos sobre los requisitos de cada empresa. Con nuestros productos SaaS, abordamos necesidades de sectores específicos mediante plataformas propias, como SaaS Dental.</p>
          <p>En ambos casos, buscamos que la tecnología tenga un propósito claro dentro del negocio.</p>
        </div>
      </section>

      <section className={styles.businessSection} aria-labelledby="business-title">
        <header className={styles.sectionHeader}>
          <p className={styles.eyebrow}>NUESTRAS DOS LÍNEAS</p>
          <h2 id="business-title">Software para distintas necesidades</h2>
          <p>Un proyecto propio de tu empresa o una plataforma de Ksoft: conoce las dos formas en las que podemos ayudarte.</p>
        </header>
        <div className={styles.businessGrid}>
          <article className={styles.businessCard}>
            <span className={styles.icon}><FaCode aria-hidden="true" /></span>
            <p className={styles.cardLabel}>PARA LOS REQUISITOS DE TU NEGOCIO</p>
            <h3>Desarrollo a medida</h3>
            <p>Diseñamos y desarrollamos software, sitios web y aplicaciones con un alcance acordado contigo antes de comenzar.</p>
            <Link className={styles.textLink} to="/#servicios">Conocer nuestros servicios <FaArrowRight aria-hidden="true" /></Link>
          </article>
          <article className={`${styles.businessCard} ${styles.saasCard}`}>
            <span className={styles.icon}><FaLayerGroup aria-hidden="true" /></span>
            <p className={styles.cardLabel}>PLATAFORMAS CREADAS POR KSOFT</p>
            <h3>Productos SaaS propios</h3>
            <p>Construimos productos para sectores específicos. Su acceso se ofrece mediante suscripción o licencia, según las condiciones de cada plataforma.</p>
            <Link className={styles.textLink} to="/products">Explorar nuestros productos <FaArrowRight aria-hidden="true" /></Link>
          </article>
        </div>
      </section>

      <section className={styles.purposeSection} aria-labelledby="purpose-title">
        <div className={styles.purposeIntro}>
          <p className={styles.eyebrow}>NUESTRO PROPÓSITO</p>
          <h2 id="purpose-title">Lo que hacemos hoy.<br />Hacia dónde queremos ir.</h2>
        </div>
        <div className={styles.purposeGrid}>
          <article>
            <FaBullseye className={styles.purposeIcon} aria-hidden="true" />
            <h3>Nuestra misión</h3>
            <p>Diseñar y desarrollar soluciones digitales que ayuden a las empresas a mejorar sus procesos y acompañen el crecimiento de sus operaciones.</p>
          </article>
          <article>
            <FaCompass className={styles.purposeIcon} aria-hidden="true" />
            <h3>Nuestra visión</h3>
            <p>Convertirnos en un referente de innovación tecnológica, desarrollando productos SaaS y soluciones de software que aporten valor a las empresas.</p>
          </article>
        </div>
      </section>

      <section className={styles.valuesSection} aria-labelledby="values-title">
        <header className={styles.sectionHeader}>
          <p className={styles.eyebrow}>PRINCIPIOS QUE GUÍAN EL TRABAJO</p>
          <h2 id="values-title">Nuestros valores, en la práctica</h2>
          <p>La forma de trabajar importa tanto como lo que construimos.</p>
        </header>
        <div className={styles.valuesGrid}>
          {values.map(({ title, icon: Icon, description }) => (
            <article key={title} className={styles.valueCard}>
              <span className={styles.icon}><Icon aria-hidden="true" /></span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.contactSection} aria-labelledby="about-contact-title">
        <p className={styles.eyebrow}>CONSTRUYAMOS EL SIGUIENTE PASO</p>
        <h2 id="about-contact-title">Tu negocio es el punto de partida.</h2>
        <p>Cuéntanos qué necesitas. Podemos conversar sobre un proyecto a medida o sobre nuestros productos SaaS.</p>
        <Link className={styles.primaryLink} to="/contact">Contactar con Ksoft <FaArrowRight aria-hidden="true" /></Link>
        <p className={styles.responseTime}>Tiempo estimado de respuesta: hasta 24 horas hábiles.</p>
      </section>
    </main>
    <Footer />
  </>
);
