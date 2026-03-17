import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";

interface NavbarProps {
  title: string;
  imglogo: string;
}
export const Navbar = ({ title, imglogo }: NavbarProps) => {
  return (
    <nav className={styles.navContainer}>
      <div className={styles.dvContainer}>
        <div className={styles.logoAndtitleContainer}>
          <img src={imglogo} alt={`logo de ${title}`} />
        </div>
        <ul className={styles.ulCo}>
          <li>
            <NavLink to={"/"}>Inicio</NavLink>
          </li>
          <li>
            <NavLink to={"/about"}>Nosotros</NavLink>
          </li>
          <li>
            <NavLink to={"/products"}>Productos</NavLink>
          </li>
          <li>
            <NavLink to={"/contact"}>Contacto</NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};
