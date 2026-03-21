import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import styles from "./Navbar.module.css";

interface NavbarProps {
  title: string;
  imglogo: string;
}
export const Navbar = ({ title, imglogo }: NavbarProps) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [location.pathname]);

  const links = useMemo(
    () => [
      { to: "/", label: "Inicio" },
      { to: "/about", label: "Nosotros" },
      { to: "/products", label: "Productos" },
      { to: "/contact", label: "Contacto" },
    ],
    []
  );

  return (
    <nav className={styles.navContainer} data-open={open ? "true" : "false"}>
      <div className={styles.dvContainer}>
        <NavLink
          to="/"
          className={styles.logoAndtitleContainer}
          aria-label={title}
        >
          <img src={imglogo} alt={`logo de ${title}`} />
        </NavLink>
        <ul className={styles.ulCo}>
          {links.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to}>{l.label}</NavLink>
            </li>
          ))}
        </ul>

        <div className={styles.right}>
          <button
            type="button"
            className={styles.cta}
            onClick={() => navigate("/contact")}
          >
            Comenzar
          </button>

          <button
            type="button"
            className={styles.burger}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className={styles.mobilePanel} aria-hidden={!open}>
        <ul className={styles.mobileLinks}>
          {links.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to}>{l.label}</NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};
