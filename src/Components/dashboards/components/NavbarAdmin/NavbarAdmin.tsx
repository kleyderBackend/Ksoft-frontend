import {TicketIndicator} from '../Tickets/TicketIndicator';
import {roleLabels} from '../../accessContext';
import { Link, useLocation } from "react-router-dom";
import { FiArrowUpRight, FiBell, FiChevronDown } from "react-icons/fi";
import { useAdmin } from "../../AdminContext";
import { getNotifications } from "../../notifications";
import styles from "./NavbarAdmin.module.css";
const names: Record<string, string> = { team:"Equipo",tickets:"Tickets internos",profile:"Mi perfil",requests:"Solicitudes",trash:"Papelera",history:"Historial",
  payments: "Pagos",
  expenses: "Gastos",
  reports: "Reportes",
  notifications: "Notificaciones",
  posts: "Publicaciones",
  products: "Productos",
  files: "Archivos",
  projects: "Proyectos",
  tasks: "Tareas",
  supports: "Soporte",
  contacts: "Contactos",
  clients: "Clientes",
  quotes: "Cotizaciones",
  settings: "Configuración",
};
export const NavbarAdmin = () => {
  const { data,role } = useAdmin();
  const { pathname } = useLocation();
  const unread = getNotifications(
    data,
    new Date().toLocaleDateString("en-CA"),
  ).filter((n) => !data.workspace.readNotifications.includes(n.id)).length;
  return (
    <header className={styles.navbar}>
      <div className={styles.breadcrumb}>
        {roleLabels[role]} <span>/</span>
        <strong>
          {names[pathname.split("/").at(-1) || ""] || "Dashboard"}
        </strong>
      </div>
      <div className={styles.controls}>
        <a
          className={styles.website}
          href="https://ksoftdev.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Ver web <FiArrowUpRight aria-hidden="true" />
        </a>
        <TicketIndicator/>{role==="admin"&&<Link
          className={styles.bell}
          to="/dashboard/notifications"
          aria-label={"Notificaciones: " + unread + " sin leer"}
        >
          <FiBell aria-hidden="true" />
          {unread > 0 && <span>{unread > 99 ? "99+" : unread}</span>}
        </Link>}
        <details className={styles.profile}>
          <summary>
            <span className={styles.avatar}>
              {(data.workspace.settings.owner || "Ksoft").slice(0, 1)}
            </span>
            <FiChevronDown aria-hidden="true" />
            <span className={styles.srOnly}>Menú de usuario</span>
          </summary>
          <div>
            <strong>{data.workspace.settings.owner}</strong><small>{roleLabels[role]} · Ksoft Technology</small><Link to="/dashboard/profile">Mi perfil</Link><Link to="/dashboard/tickets">Mis tickets</Link>
            {role==="admin"&&<Link to="/dashboard/settings">Configuración</Link>}
            <Link to="/dashboard/logout">Salir del panel</Link>
          </div>
        </details>
      </div>
    </header>
  );
};
