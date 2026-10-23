import { Link } from "react-router-dom";
import { FaCode, FaGlobe, FaLaptopCode, FaArrowRight, FaCheck } from "react-icons/fa";
import { AreasSection } from "../../Components/AreasSection/AreasSection";
import { Footer } from "../../Components/Footer/Footer";
import { HeroSection } from "../../Components/HeroSection/HeroSection";
import { Navbar } from "../../Components/Navbar/Navbar";
import styles from "./Landing.module.css";
import { ProductsPreview } from "../Portfolio/Portfolio";

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
        descriptions="En Ksoft Technology desarrollamos sitios web, aplicaciones y sistemas adaptados a las necesidades de tu negocio. También creamos productos SaaS propios para sectores como turismo y salud dental."
      />

      <div className={styles.commitments} aria-label="Nuestra forma de trabajar">
        {["Alcance definido antes de comenzar", "Cambios con aprobación previa", "Respuesta en hasta 24 horas hábiles"].map((text) => (
          <p key={text}><FaCheck aria-hidden="true" />{text}</p>
        ))}
      </div>

      <AreasSection areas={[
        {
          title: "Software a medida", icon: <FaCode />,
          description: "Para organizar la operación de tu empresa y reducir tareas manuales con un sistema adaptado a tu proceso.",
          includes: ["Definición de procesos, usuarios y permisos.", "Módulos de gestión y reportes según tus requisitos.", "Integraciones con otros sistemas cuando formen parte del alcance."],
          example: "Un panel para registrar clientes, consultar solicitudes y seguir el estado de cada trabajo.",
        },
        {
          title: "Sitios web", icon: <FaGlobe />,
          description: "Para presentar tu empresa, explicar lo que ofreces y facilitar que una persona interesada te contacte.",
          includes: ["Diseño adaptable a móvil y escritorio.", "Páginas de servicios, empresa y contacto.", "Formularios y metadatos básicos para buscadores."],
          example: "Una web corporativa con catálogo de servicios, portafolio y formulario de consultas.",
        },
        {
          title: "Aplicaciones", icon: <FaLaptopCode />,
          description: "Para que tus usuarios realicen una tarea concreta mediante una interfaz diseñada alrededor de su flujo de trabajo.",
          includes: ["Definición de pantallas y recorridos de usuario.", "Funciones y acceso a datos según el alcance aprobado.", "Pruebas de los flujos acordados y revisión de entregas."],
          example: "Una aplicación web donde un usuario inicia sesión, registra una solicitud y consulta su avance.",
        },
      ]} />

      <ProductsPreview />

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
