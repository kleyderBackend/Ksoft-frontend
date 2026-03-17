import styles from "./Footer.module.css";

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* 🔹 BRAND */}
        <div className={styles.brand}>
          <h2>Ksoft</h2>
          <p>
            Innovamos, desarrollamos y escalamos soluciones digitales de alto
            impacto.
          </p>
        </div>

        {/* 🔹 LINKS */}
        <div className={styles.links}>
          <h4>Empresa</h4>
          <a href="#">Nosotros</a>
          <a href="#">Productos</a>
          <a href="#">Contacto</a>
        </div>

        <div className={styles.links}>
          <h4>Servicios</h4>
          <a href="#">Desarrollo Web</a>
          <a href="#">Apps móviles</a>
          <a href="#">Cloud</a>
          <a href="#">AI</a>
        </div>

        <div className={styles.links}>
          <h4>Soporte</h4>
          <a href="#">FAQ</a>
          <a href="#">Ayuda</a>
          <a href="#">Privacidad</a>
        </div>
      </div>

      {/* 🔹 BOTTOM */}
      <div className={styles.bottom}>
        <p>
          © {new Date().getFullYear()} Ksoft. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};
