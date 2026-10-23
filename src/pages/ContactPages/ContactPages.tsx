import { FaRegComments, FaRegFileAlt, FaArrowRight, FaRegClock } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Navbar } from "../../Components/Navbar/Navbar";
import { Footer } from "../../Components/Footer/Footer";
import { ContactInfo } from "../../Components/ContactInfo/ContactInfo";
import { ContactForm } from "../../Components/FormContact/FormContact";
import styles from "./ContactPages.module.css";

const steps = [
  { icon: FaRegComments, title: "Cuéntanos qué necesitas", description: "Comparte tu idea, el proceso que quieres mejorar o el producto SaaS que te interesa." },
  { icon: FaRegClock, title: "Revisamos tu consulta", description: "Nuestro tiempo estimado de respuesta es de hasta 24 horas hábiles por los canales oficiales." },
  { icon: FaRegFileAlt, title: "Definimos el siguiente paso", description: "Para un proyecto a medida, conversamos sobre los requisitos. Para un producto, resolvemos tus dudas de acceso." },
];

export const ContactPage = () => (
  <>
    <Navbar title="Ksoft" imglogo="/img/logo.png" />
    <main id="main-content" tabIndex={-1} className={styles.page}>
      <section className={styles.contactLayout} aria-labelledby="contact-title">
        <div className={styles.contactCopy}>
          <header>
            <p className={styles.eyebrow}>CONTACTA CON KSOFT TECHNOLOGY</p>
            <h1 id="contact-title">Tu próximo proyecto<br /><span>empieza aquí.</span></h1>
            <p className={styles.lead}>Hablemos de lo que tu negocio necesita. Podemos ayudarte con un desarrollo a medida o resolver tus dudas sobre nuestros productos SaaS.</p>
          </header>
          <div className={styles.responseBadge}><FaRegClock aria-hidden="true" /><span>Respuesta estimada en hasta <strong>24 horas hábiles</strong></span></div>
          <Link className={styles.formShortcut} to="/contact#contact-form">Escribir un mensaje <FaArrowRight aria-hidden="true" /></Link>
          <ContactInfo />
        </div>
        <ContactForm />
      </section>

      <section className={styles.nextSection} aria-labelledby="next-title">
        <header className={styles.sectionHeader}>
          <p className={styles.eyebrow}>UNA CONVERSACIÓN PARA COMENZAR</p>
          <h2 id="next-title">¿Qué pasa después de escribirnos?</h2>
          <p>El primer paso es entender tu necesidad para orientarte sobre las opciones de Ksoft.</p>
        </header>
        <ol className={styles.steps}>
          {steps.map(({ icon: Icon, title, description }, index) => (
            <li key={title}><div className={styles.stepTop}><span aria-hidden="true">0{index + 1}</span><Icon aria-hidden="true" /></div><h3>{title}</h3><p>{description}</p></li>
          ))}
        </ol>
      </section>

      <section className={styles.exploreSection} aria-labelledby="explore-title">
        <div><p className={styles.eyebrow}>CONOCE TUS OPCIONES</p><h2 id="explore-title">¿Aún estás explorando?</h2><p>Descubre qué desarrollamos o conoce nuestros productos antes de contactarnos.</p></div>
        <div className={styles.exploreLinks}>
          <Link to="/#servicios">Ver servicios <FaArrowRight aria-hidden="true" /></Link>
          <Link to="/products">Explorar productos SaaS <FaArrowRight aria-hidden="true" /></Link>
          <Link to="/faq">Preguntas frecuentes <FaArrowRight aria-hidden="true" /></Link>
        </div>
      </section>
    </main>
    <Footer />
  </>
);
