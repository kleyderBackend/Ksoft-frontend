import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FiGrid, FiFileText, FiPackage, FiDollarSign, FiTrendingDown, FiBarChart2, FiBell, FiFolder, FiBriefcase, FiCheckSquare, FiLifeBuoy, FiUsers, FiUserCheck, FiClipboard, FiSettings, FiLogOut, FiMenu, FiX, FiInbox, FiTrash2, FiClock } from "react-icons/fi";
import { useAdmin } from "../../AdminContext";
import styles from "./SidebarAdmin.module.css";
const groups = [
  {label: "GENERAL", items: [{path: "", label: "Dashboard", Icon: FiGrid}, {path: "payments", label: "Pagos", Icon: FiDollarSign}, {path: "expenses", label: "Gastos", Icon: FiTrendingDown}, {path: "reports", label: "Reportes", Icon: FiBarChart2}, {path: "notifications", label: "Notificaciones", Icon: FiBell}]},
  {label: "CONTENIDO", items: [{path: "posts", label: "Publicaciones", Icon: FiFileText}, {path: "products", label: "Productos", Icon: FiPackage}, {path: "files", label: "Archivos", Icon: FiFolder}]},
  {label: "TRABAJO", items: [{path: "projects", label: "Proyectos", Icon: FiBriefcase}, {path: "tasks", label: "Tareas", Icon: FiCheckSquare}, {path: "supports", label: "Soporte", Icon: FiLifeBuoy}]},
  {label: "RELACIÓN COMERCIAL", items: [{path:"requests",label:"Solicitudes",Icon:FiInbox},{path: "contacts", label: "Contactos", Icon: FiUsers}, {path: "clients", label: "Clientes", Icon: FiUserCheck}, {path: "quotes", label: "Cotizaciones", Icon: FiClipboard}]},
];
export const SidebarAdmin = () => {
  const [open, setOpen] = useState(false);
  const {data,role} = useAdmin();
  const visibleGroups=role!=="admin"?groups.map(group=>({...group,items:group.items.filter(item=>["",...(role!=="employee"?["projects","tasks"]:[])].includes(item.path))})).filter(group=>group.items.length):groups;
  return <aside className={styles.sidebar}>
    <div className={styles.brand}><span className={styles.mark}>K</span><div><strong>{role==="developer"?"Ksoft Development":role==="qa"?"Ksoft QA":role==="employee"?"Ksoft Team":"Ksoft Admin"}</strong><small>{role==="admin"?"Gestión de tu empresa":"Construimos soluciones juntos"}</small></div><button className={styles.mobileToggle} aria-label={open ? "Cerrar menú" : "Abrir menú"} aria-expanded={open} aria-controls="admin-menu" onClick={() => setOpen(!open)}>{open ? <FiX /> : <FiMenu />}</button></div>
    <nav id="admin-menu" aria-label="Administración" className={styles.nav} data-open={open}>
      {visibleGroups.map(group => <section key={group.label}><p className={styles.label}>{group.label}</p>{group.items.map(({path,label,Icon}) => <NavLink key={path} end={!path} to={"/dashboard" + (path ? "/" + path : "")} onClick={() => setOpen(false)}><Icon aria-hidden="true" /><span>{label}</span></NavLink>)}</section>)}
      <section className={styles.bottom}><NavLink to="/dashboard/tickets" onClick={()=>setOpen(false)}><FiLifeBuoy aria-hidden="true"/> Tickets internos</NavLink>{role==="admin"&&<NavLink to="/dashboard/team" onClick={()=>setOpen(false)}><FiUsers aria-hidden="true"/> Equipo</NavLink>}<NavLink to="/dashboard/profile" onClick={()=>setOpen(false)}><FiUserCheck aria-hidden="true"/> Mi perfil</NavLink>{role==="admin"&&<><NavLink to="/dashboard/trash" onClick={()=>setOpen(false)}><FiTrash2 aria-hidden="true"/> Papelera{(data.trash?.length??0)>0&&<span className={styles.counter}>{data.trash?.length}</span>}</NavLink><NavLink to="/dashboard/history" onClick={()=>setOpen(false)}><FiClock aria-hidden="true"/> Historial</NavLink><NavLink to="/dashboard/settings" onClick={() => setOpen(false)}><FiSettings aria-hidden="true" /> Configuración</NavLink></>}<NavLink to="/dashboard/logout" onClick={() => setOpen(false)}><FiLogOut aria-hidden="true" /> Salir del panel</NavLink></section>
    </nav>
    <div className={styles.footer}><span className={styles.avatar}>{(data.workspace.settings.owner || "Ksoft").slice(0,1)}</span><div><strong>{data.workspace.settings.owner || "Ksoft"}</strong><small>Ksoft Technology · Equipo</small></div></div>
  </aside>;
};

