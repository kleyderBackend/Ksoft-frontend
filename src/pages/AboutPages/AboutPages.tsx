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

const workingAgreements = [
  { title: "Primero, entender el negocio", description: "Conversamos sobre el proceso que quieres mejorar, quién utilizará la solución y qué resultado necesitas. Esa conversación permite priorizar lo que se va a construir." },
  { title: "Avanzar con entregas revisables", description: "Acordamos las funcionalidades y revisamos contigo las entregas parciales. Puedes contrastar lo desarrollado con los requisitos antes de la entrega final." },
  { title: "Decidir los cambios contigo", description: "Si surge una nueva necesidad, evaluamos su impacto en el alcance, el presupuesto y los tiempos antes de incorporarla al proyecto." },
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

      <section className={styles.story} id="fundador" aria-labelledby="story-title">
        <div>
          <p className={styles.eyebrow}>DETRÁS DE KSOFT</p>
          <h2 id="story-title">Kleyder Moreno Davila</h2>
          <p className={styles.founderRole}>Fundador de Ksoft Technology</p>
        </div>
        <div className={styles.storyCopy}>
          <p>Kleyder Moreno Davila es el fundador de Ksoft Technology, una iniciativa de desarrollo de software desde Medellín, Colombia. Su propósito con Ksoft es construir soluciones que respondan a necesidades concretas de negocio.</p>
          <p>La empresa reúne el desarrollo a medida y la creación de productos propios. Esa visión se refleja en SaaS Dental, una plataforma de Ksoft orientada a la gestión de clínicas dentales y en preparación de piloto, a la espera de sus primeros usuarios.</p>
          <p>Queremos que conozcas qué se va a construir, cómo se revisará el avance y cuáles serán las condiciones de entrega antes de comenzar.</p>
        </div>
      </section>

      <section className={styles.experienceSection} aria-labelledby="experience-title">
        <div>
          <p className={styles.eyebrow}>DEL DESARROLLO AL PRODUCTO</p>
          <h2 id="experience-title">Conoce lo que estamos construyendo</h2>
          <p>Los productos propios permiten ver el enfoque de Ksoft en una solución concreta. Puedes conocer el propósito de SaaS Dental y su estado de desarrollo en nuestro portafolio.</p>
          <Link className={styles.textLink} to="/products/saas-dental">Conocer SaaS Dental <FaArrowRight aria-hidden="true" /></Link>
        </div>
        <div className={styles.experienceCard}>
          <span className={styles.icon}><FaLayerGroup aria-hidden="true" /></span>
          <p className={styles.cardLabel}>PRODUCTO PROPIO · PREPARACIÓN DE PILOTO</p>
          <h3>SaaS Dental</h3>
          <p>Software orientado a la gestión de clínicas dentales.</p>
          <span className={styles.productOrigin}>Desarrollado por Ksoft Technology</span>
        </div>
      </section>

      <section className={styles.workingSection} aria-labelledby="working-title">
        <header className={styles.sectionHeader}>
          <p className={styles.eyebrow}>NUESTRA FORMA DE TRABAJAR</p>
          <h2 id="working-title">Una conversación que continúa durante el desarrollo</h2>
          <p>Estos acuerdos guían el trabajo desde la primera consulta hasta la entrega del proyecto.</p>
        </header>
        <ol className={styles.workingGrid}>
          {workingAgreements.map((agreement, index) => (
            <li key={agreement.title}>
              <span className={styles.workingNumber} aria-hidden="true">0{index + 1}</span>
              <h3>{agreement.title}</h3>
              <p>{agreement.description}</p>
            </li>
          ))}
        </ol>
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
            <p>Construimos productos para sectores específicos: Ksoft Dental con planes de suscripción y Ksoft Travel con un modelo de comisión.</p>
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
