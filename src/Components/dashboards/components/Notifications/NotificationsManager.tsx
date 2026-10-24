import { useState } from "react";
import { Link } from "react-router-dom";
import { useAdmin } from "../../AdminContext";
import { getNotifications } from "../../notifications";
import styles from "./NotificationsManager.module.css";

export function NotificationsManager() {
  const { data, save } = useAdmin();
  const [onlyUnread, setOnlyUnread] = useState(false);
  const notifications = getNotifications(
    data,
    new Date().toLocaleDateString("en-CA"),
  );
  const read = data.workspace.readNotifications;
  const shown = notifications.filter(
    (n) => !onlyUnread || !read.includes(n.id),
  );
  const mark = (ids: string[]) => {
    const next = [...new Set([...read, ...ids])].slice(-500);
    save(
      { ...data, workspace: { ...data.workspace, readNotifications: next } },
      "Notificaciones marcadas como leídas",
      false,
    );
  };
  return (
    <>
      <div className={styles.container}>
        <div className={styles.toolbar}>
          <label className={styles.check}>
            <input
              type="checkbox"
              checked={onlyUnread}
              onChange={(e) => setOnlyUnread(e.target.checked)}
            />{" "}
            Solo sin leer
          </label>
          <button
            onClick={() => mark(notifications.map((n) => n.id))}
            disabled={!notifications.some((n) => !read.includes(n.id))}
          >
            Marcar todas como leídas
          </button>
        </div>
        {shown.length ? (
          shown.map((n) => (
            <article className={styles.row} key={n.id}>
              <div>
                <span className={styles.badge}>
                  {read.includes(n.id) ? "Leída" : "Sin leer"}
                </span>
                <h2>{n.title}</h2>
                <p>
                  {n.description} · {n.date}
                </p>
              </div>
              <div className={styles.actions}>
                <Link to={n.href}>Ver sección →</Link>
                {!read.includes(n.id) && (
                  <button onClick={() => mark([n.id])}>
                    Marcar como leída
                  </button>
                )}
              </div>
            </article>
          ))
        ) : (
          <section className={styles.empty}>
            <h2>Todo al día</h2>
            <p>
              No hay notificaciones {onlyUnread ? "sin leer " : ""}para mostrar.
            </p>
          </section>
        )}
      </div>
    </>
  );
}
