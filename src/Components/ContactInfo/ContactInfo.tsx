import styles from "./ContactInfo.module.css";

export const ContactInfo = () => {
  return (
    <div className={styles.container}>
      <h3>Contacto</h3>

      <p>
        <strong>Email:</strong> contacto@ksoft.com
      </p>

      <p>
        <strong>Teléfono:</strong> +57 314 251 8296
      </p>

      <p className={styles.note}>Respondemos en menos de 24 horas.</p>
    </div>
  );
};
