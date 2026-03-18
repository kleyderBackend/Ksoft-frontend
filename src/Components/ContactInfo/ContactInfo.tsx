import styles from "./ContactInfo.module.css";

export const ContactInfo = () => {
  return (
    <aside className={styles.card} aria-label="Información de contacto">
      <h3 className={styles.title}>Información</h3>

      <div className={styles.list}>
        <a className={styles.item} href="mailto:contacto@ksoft.com">
          <span className={styles.icon} aria-hidden="true">
            ✉️
          </span>
          <span>
            <div className={styles.label}>Email</div>
            <div className={styles.value}>contacto@ksoft.com</div>
          </span>
        </a>

        <a className={styles.item} href="tel:+573142518296">
          <span className={styles.icon} aria-hidden="true">
            📞
          </span>
          <span>
            <div className={styles.label}>Teléfono</div>
            <div className={styles.value}>+57 314 251 8296</div>
          </span>
        </a>

        <div className={styles.item} role="group" aria-label="Ubicación">
          <span className={styles.icon} aria-hidden="true">
            📍
          </span>
          <span>
            <div className={styles.label}>Ubicación</div>
            <div className={styles.value}>Buenos Aires, Argentina</div>
          </span>
        </div>
      </div>

      <div className={styles.socialRow} aria-label="Redes">
        <a className={styles.socialBtn} href="#" aria-label="LinkedIn">
          in
        </a>
        <a className={styles.socialBtn} href="#" aria-label="Instagram">
          ig
        </a>
        <a className={styles.socialBtn} href="#" aria-label="X">
          x
        </a>
      </div>

      <p className={styles.note}>Respondemos en menos de 24 horas.</p>
    </aside>
  );
};
