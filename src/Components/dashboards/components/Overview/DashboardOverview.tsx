import { Link } from "react-router-dom";
import {
  FiArrowUpRight,
  FiBriefcase,
  FiClipboard,
  FiDollarSign,
  FiLifeBuoy,
} from "react-icons/fi";
import { useAdmin } from "../../AdminContext";
import {
  financialSummary,
  money,
} from "../../businessModel";
import { RecentActivity } from "../RecentActivity/RecentActivity";
import styles from "./DashboardOverview.module.css";
export const DashboardOverview = () => {
  const { data } = useAdmin();
  const records = data.workspace.records;
  const totals = financialSummary(data.workspace);
  const activeProjects = records.projects.filter(
    (p) => p.values.status === "En curso",
  );
  const openQuotes = records.quotes.filter((q) =>
    ["Borrador", "Enviada"].includes(q.values.status),
  );
  const openTickets = records.supports.filter(
    (t) => t.values.status !== "Resuelto",
  );
  const pendingTasks = records.tasks
    .filter((t) => t.values.status !== "Completada")
    .sort((a, b) =>
      (a.values.due || "9999").localeCompare(b.values.due || "9999"),
    );
  const today = new Date().toLocaleDateString("en-CA");
  const stats = [
    {
      label: "Proyectos activos",
      value: String(activeProjects.length),
      trend: records.projects.length + " proyectos en total",
      href: "projects",
      Icon: FiBriefcase,
    },
    {
      label: "Cotizaciones pendientes",
      value: String(openQuotes.length),
      trend:
        records.quotes.filter((q) => q.values.status === "Aceptada").length +
        " aceptadas",
      href: "quotes",
      Icon: FiClipboard,
    },
    {
      label: "Pagos por cobrar",
      value: money(totals.receivable),
      trend:
        records.payments.filter((p) => p.values.status === "Pendiente").length +
        " cobros pendientes",
      href: "payments",
      Icon: FiDollarSign,
    },
    {
      label: "Tickets de soporte",
      value: String(openTickets.length),
      trend:
        records.supports.filter((t) => t.values.status === "En atención")
          .length + " en atención",
      href: "supports",
      Icon: FiLifeBuoy,
    },
  ];
  return (
    <div className={styles.overview}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>VISTA GENERAL · {today}</p>
        <h1 className={styles.title}>
          El día a día de {data.workspace.settings.company}.
        </h1>
        <p className={styles.subtitle}>
          Gestiona tus proyectos, tu contenido y la relación con tus clientes
          desde un solo lugar.
        </p>
      </header>
      <section className={styles.grid} aria-label="Resumen de la empresa">
        {stats.map(({ Icon, ...stat }) => (
          <Link
            key={stat.label}
            to={"/dashboard/" + stat.href}
            className={styles.card + " " + styles.statLink}
          >
            <div className={styles.cardTop}>
              <p className={styles.cardLabel}>{stat.label}</p>
              <Icon aria-hidden="true" />
            </div>
            <p className={styles.cardValue}>{stat.value}</p>
            <p className={styles.cardTrend}>{stat.trend}</p>
          </Link>
        ))}
      </section>
      <section
        className={styles.financeStrip}
        aria-label="Finanzas registradas"
      >
        <div>
          <span>Ingresos recibidos</span>
          <strong>{money(totals.income)}</strong>
        </div>
        <div>
          <span>Gastos pagados</span>
          <strong>{money(totals.expenses)}</strong>
        </div>
        <div>
          <span>Balance registrado</span>
          <strong>{money(totals.net)}</strong>
        </div>
        <Link to="/dashboard/reports">
          Ver reportes <FiArrowUpRight aria-hidden="true" />
        </Link>
      </section>
      <section className={styles.shortcutBar} aria-label="Acciones rápidas">
        <Link to="/dashboard/projects">
          Gestionar proyectos <span>↗</span>
        </Link>
        <Link to="/dashboard/quotes">
          Preparar cotización <span>↗</span>
        </Link>
        <Link to="/dashboard/posts">
          Crear publicación <span>↗</span>
        </Link>
        <Link to="/dashboard/clients">
          Ver clientes <span>↗</span>
        </Link>
      </section>
      <div className={styles.overviewColumns}>
        <section className={styles.sectionPanel}>
          <header className={styles.panelHeader}>
            <div className={styles.panelTitleGroup}>
              <h2 className={styles.panelTitle}>Tu próximo trabajo</h2>
              <p className={styles.panelSubtitle}>
                {pendingTasks.length} tareas por completar
              </p>
            </div>
            <Link to="/dashboard/tasks" className={styles.textLink}>
              Ver todas →
            </Link>
          </header>
          {pendingTasks.length ? (
            <ul className={styles.taskList}>
              {pendingTasks.slice(0, 5).map((task) => (
                <li key={task.id}>
                  <Link to="/dashboard/tasks">
                    <strong>{task.values.name}</strong>
                    <span>
                      {task.values.owner || "Sin responsable"} ·{" "}
                      {task.values.due || "Sin fecha"}
                    </span>
                  </Link>
                  <small
                    className={
                      task.values.due && task.values.due < today
                        ? styles.overdue
                        : ""
                    }
                  >
                    {task.values.due && task.values.due < today
                      ? "Vencida"
                      : task.values.priority}
                  </small>
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles.emptyState}>
              Todavía no hay tareas pendientes. Añade una tarea para organizar
              tu próxima entrega.
            </div>
          )}
        </section>
        <section className={styles.sectionPanel}>
          <h2 className={styles.panelTitle}>Contenido de tu web</h2>
          <p className={styles.panelSubtitle}>
            Prepara tus próximas novedades y fichas comerciales.
          </p>
          <Link to="/dashboard/posts" className={styles.contentRow}>
            <span>Publicaciones</span>
            <strong>
              {data.posts.length} <FiArrowUpRight aria-hidden="true" />
            </strong>
          </Link>
          <Link to="/dashboard/products" className={styles.contentRow}>
            <span>Productos</span>
            <strong>
              {data.products.length} <FiArrowUpRight aria-hidden="true" />
            </strong>
          </Link>
          <Link to="/dashboard/files" className={styles.contentRow}>
            <span>Archivos</span>
            <strong>
              {records.files.length} <FiArrowUpRight aria-hidden="true" />
            </strong>
          </Link>
        </section>
      </div>
      <RecentActivity
        subtitle="Últimos cambios guardados en el panel"
        items={data.activity
          .slice(0, 6)
          .map((a) => ({
            id: a.id,
            title: a.title,
            description: "Registro de actividad",
            time: new Date(a.date).toLocaleString("es-CO"),
          }))}
      />
    </div>
  );
};
