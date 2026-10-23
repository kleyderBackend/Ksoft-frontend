import { FaArrowRight, FaCalendarCheck, FaUsers, FaEnvelopeOpenText } from "react-icons/fa";
import { Link } from "react-router-dom";
import { dentalProduct } from "../../config/dental";
import styles from "./ProductDetails.module.css";
import { products } from "../../config/products";

export const DentalProductDetails = () => (
  <div className={styles.details}>
    <section className={styles.audience} aria-labelledby="dental-audience-title">
      <div><p className={styles.eyebrow}>PENSADO PARA TU CONSULTORIO</p><h2 id="dental-audience-title">Pacientes, agenda y comunicación en un mismo lugar</h2><p>El producto busca facilitar el trabajo diario del consultorio, dar más visibilidad a las citas y sus confirmaciones, y ayudar a reducir los espacios perdidos por inasistencia.</p></div>
      <ul>{dentalProduct.audience.map((item) => <li key={item}>{item}</li>)}</ul>
    </section>

    <section className={styles.section} aria-labelledby="dental-modules-title">
      <header className={styles.header}><p className={styles.eyebrow}>FUNCIONES PARA TU CONSULTORIO</p><h2 id="dental-modules-title">Organiza tu atención desde un solo lugar</h2><p>Conoce sus funciones y consulta cómo participar en el piloto de Ksoft Dental.</p></header>
      <div className={styles.modules}>{dentalProduct.modules.map((module) => (
        <article key={module.title}><h3>{module.title}</h3><p>{module.description}</p></article>
      ))}</div>
    </section>

    <section className={styles.section} aria-labelledby="dental-flow-title">
      <header className={styles.header}><p className={styles.eyebrow}>DE LA CITA A LA CONFIRMACIÓN</p><h2 id="dental-flow-title">Una agenda con seguimiento de asistencia</h2><p>La primera automatización conecta la programación de la cita con la respuesta del paciente por correo.</p></header>
      <div className={styles.flowSummary} aria-hidden="true"><FaUsers /><span>Paciente</span><FaArrowRight /><FaCalendarCheck /><span>Cita</span><FaArrowRight /><FaEnvelopeOpenText /><span>Confirmación</span></div>
      <ol className={styles.flow}>{dentalProduct.appointmentFlow.map((step, index) => (
        <li key={step.title}><span className={styles.number} aria-hidden="true">0{index + 1}</span><h3>{step.title}</h3><p>{step.description}</p></li>
      ))}</ol>
    </section>

    <section className={styles.commercial} aria-labelledby="dental-commercial-title">
      <div><p className={styles.eyebrow}>PLANES DE SUSCRIPCIÓN</p><h2 id="dental-commercial-title">Prepara tu consultorio para el piloto</h2><p>Ksoft Dental se ofrece mediante planes de suscripción. Cuéntanos cómo organizas hoy tus pacientes y tu agenda para orientarte sobre el plan y las funciones que necesita tu consultorio.</p><p>Estamos preparando el piloto y esperamos a sus primeros usuarios. Consulta con Ksoft cómo participar, los precios y las condiciones de cada plan.</p></div>
      <Link to={products[0].pilotHref} className={styles.contactLink}>Solicitar participar en el piloto <FaArrowRight aria-hidden="true" /></Link>
    </section>
  </div>
);
