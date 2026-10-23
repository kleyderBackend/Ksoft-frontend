import { FaRegEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaInstagram, FaWhatsapp, FaArrowRight } from "react-icons/fa";
import styles from "./ContactInfo.module.css";
import { CONTACT_EMAIL } from "../../config/contact";

export const ContactInfo = () => (
  <aside className={styles.card} aria-labelledby="channels-title">
    <h2 id="channels-title" className={styles.title}>Hablemos por tu canal preferido</h2>
    <p className={styles.intro}>También puedes comunicarte directamente con nosotros.</p>
    <div className={styles.list}>
      <a className={styles.item} href={`mailto:${CONTACT_EMAIL}`}>
        <span className={styles.icon}><FaRegEnvelope aria-hidden="true" /></span>
        <span className={styles.details}><span className={styles.label}>Correo electrónico</span><span className={styles.value}>{CONTACT_EMAIL}</span></span>
        <FaArrowRight className={styles.arrow} aria-hidden="true" />
      </a>
      <a className={styles.item} href="tel:+573142518296">
        <span className={styles.icon}><FaPhoneAlt aria-hidden="true" /></span>
        <span className={styles.details}><span className={styles.label}>Teléfono</span><span className={styles.value}>+57 314 251 8296</span></span>
        <FaArrowRight className={styles.arrow} aria-hidden="true" />
      </a>
      <div className={styles.item}>
        <span className={styles.icon}><FaMapMarkerAlt aria-hidden="true" /></span>
        <span className={styles.details}><span className={styles.label}>Ubicación</span><span className={styles.value}>Medellín, Colombia</span></span>
      </div>
    </div>
    <div className={styles.socialRow}>
      <a href="https://wa.me/573142518296" target="_blank" rel="noopener noreferrer"><FaWhatsapp aria-hidden="true" />Escribir por WhatsApp<span className={styles.srOnly}> (abre en una pestaña nueva)</span></a>
      <a href="https://www.instagram.com/ksoft_technology/" target="_blank" rel="noopener noreferrer"><FaInstagram aria-hidden="true" />Instagram<span className={styles.srOnly}> (abre en una pestaña nueva)</span></a>
    </div>
  </aside>
);
