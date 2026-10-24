import { PostsManager } from "../../../Components/dashboards/components/Posts/PostsManager";
import styles from "./DashboardPosts.module.css";

export const DashboardPosts = () => {
  return (
    <>
      <header className={styles.header}>
        <h1 className={styles.title}>Publicaciones</h1>
        <p className={styles.subtitle}>Prepara novedades y artículos para compartir con tus clientes.</p>
      </header>
      <PostsManager />
    </>
  );
};
