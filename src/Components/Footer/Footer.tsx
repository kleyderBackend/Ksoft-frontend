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
            Desarrollo de software a medida y productos SaaS propios para tu empresa.
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
          <NavLink to="/#servicios">Software a medida</NavLink>
          <NavLink to="/#servicios">Sitios web</NavLink>
          <NavLink to="/#servicios">Aplicaciones</NavLink>
          <NavLink to="/products">Productos SaaS</NavLink>
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
