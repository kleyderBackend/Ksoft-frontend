import { NavLink } from "react-router-dom";
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
          <NavLink to="/about">Nosotros</NavLink>
          <NavLink to="/products">Productos</NavLink>
          <NavLink to="/contact">Contacto</NavLink>
        </div>

        <div className={styles.links}>
          <h4>Servicios</h4>
          <a href="#">Desarrollo Web</a>
          <a href="#">Aplicaciones a medida</a>
          <a href="#">Interfaces Modernas</a>
          <a href="#">Mantemiento y Soporrte</a>
        </div>

        <div className={styles.links}>
          <h4>Soporte</h4>
          <NavLink to="/faq">FAQ</NavLink>
          <NavLink to="/contact">Ayuda</NavLink>
          <NavLink to="/privacity">Privacidad</NavLink>
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
