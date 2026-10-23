import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import styles from "./ProductDetails.module.css";
import { products } from "../../config/products";

const roles = [
  { title: "Viajeros", description: "Exploran hoteles y guías, consultan la oferta, realizan reservas y gestionan su perfil y reseñas." },
  { title: "Hoteles", description: "Administran su perfil, habitaciones, disponibilidad y reservas, con reportes y seguimiento de reseñas." },
  { title: "Guías turísticos", description: "Presentan su perfil profesional y sus servicios, y gestionan reservas, reportes y reseñas." },
];

const journey = [
  { title: "Explorar la oferta", description: "El viajero consulta el catálogo público y el detalle del hotel o guía que le interesa." },
  { title: "Solicitar una reserva", description: "Selecciona habitación o servicio y revisa disponibilidad y condiciones del proveedor." },
  { title: "Revisar las condiciones", description: "Consulta la modalidad de pago y las condiciones de la reserva antes de continuar." },
  { title: "Gestionar la experiencia", description: "Viajero y proveedor consultan la reserva y cuentan con comunicación, notificaciones y seguimiento desde sus paneles." },
];

export const TravelProductDetails = () => (
  <div className={styles.details}>
    <section className={styles.audience} aria-labelledby="travel-audience-title">
      <div><p className={styles.eyebrow}>TURISMO CONECTADO</p><h2 id="travel-audience-title">Del descubrimiento del destino a la gestión de la reserva</h2><p>Ksoft Travel reúne la experiencia del viajero y las herramientas que hoteles y guías necesitan para presentar y gestionar su oferta. Cada participante tiene un espacio según su rol.</p></div>
      <ul><li>Viajeros que buscan alojamiento y experiencias</li><li>Hoteles que gestionan habitaciones y reservas</li><li>Guías que ofrecen servicios turísticos</li></ul>
    </section>
    <section className={styles.section} aria-labelledby="travel-roles-title">
      <header className={styles.header}><p className={styles.eyebrow}>PARA QUIEN VIAJA Y QUIEN RECIBE</p><h2 id="travel-roles-title">Una solución para cada participante</h2><p>Encuentra alojamiento y experiencias, o presenta y gestiona tu oferta turística.</p></header>
      <div className={styles.modules}>{roles.map((role) => <article key={role.title}><h3>{role.title}</h3><p>{role.description}</p></article>)}</div>
    </section>
    <section className={styles.section} aria-labelledby="travel-journey-title">
      <header className={styles.header}><p className={styles.eyebrow}>EL RECORRIDO DE UNA RESERVA</p><h2 id="travel-journey-title">Explorar, reservar y dar seguimiento</h2></header>
      <ol className={styles.flow}>{journey.map((step, index) => <li key={step.title}><span className={styles.number} aria-hidden="true">0{index + 1}</span><h3>{step.title}</h3><p>{step.description}</p></li>)}</ol>
    </section>
    <section className={styles.section} aria-labelledby="travel-operation-title">
      <header className={styles.header}><p className={styles.eyebrow}>OPERACIÓN Y COMUNICACIÓN</p><h2 id="travel-operation-title">Más que un catálogo turístico</h2></header>
      <div className={styles.architecture}>
        <article><h3>Oferta y disponibilidad</h3><p>Los proveedores gestionan habitaciones o servicios, sus reservas y la disponibilidad de su oferta.</p></article>
        <article><h3>Comunicación y reseñas</h3><p>Chat, notificaciones y reseñas con respuesta del proveedor acompañan la relación con el viajero.</p></article>
        <article><h3>Control de la operación</h3><p>Reportes y herramientas de administración permiten seguir reservas, incidencias y movimientos de la plataforma.</p></article>
      </div>
    </section>
    <section className={styles.commercial} aria-labelledby="travel-status-title">
      <div><p className={styles.eyebrow}>MODELO DE COMISIÓN</p><h2 id="travel-status-title">¿Tienes un hotel u ofreces experiencias turísticas?</h2><p>Cuéntanos sobre tu negocio y conoce cómo Ksoft Travel puede ayudarte a presentar tu oferta y organizar tus reservas.</p><p>Ksoft Travel utiliza un modelo de comisión. Estamos preparando el piloto; consúltanos la disponibilidad, el porcentaje y las condiciones para participar.</p></div>
      <Link to={products[1].pilotHref} className={styles.contactLink}>Solicitar participar en el piloto <FaArrowRight aria-hidden="true" /></Link>
    </section>
  </div>
);
