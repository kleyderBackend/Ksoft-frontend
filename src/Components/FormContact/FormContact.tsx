import styles from "./FormContact.module.css";

export const ContactForm = () => {
  return (
    <form className={styles.form}>
      <div className={styles.field}>
        <label>Nombre</label>
        <input type="text" placeholder="Tu nombre" />
      </div>

      <div className={styles.field}>
        <label>Email</label>
        <input type="email" placeholder="tu@email.com" />
      </div>

      <div className={styles.field}>
        <label>Mensaje</label>
        <textarea placeholder="Cuéntanos qué necesitas..." />
      </div>

      <button type="submit">Enviar mensaje</button>
    </form>
  );
};
