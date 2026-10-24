import { ProductsManager } from "../../../Components/dashboards/components/Products/ProductsManager";
import styles from "./DashboardProducts.module.css";

export const DashboardProducts = () => {
  return (
    <>
      <header className={styles.header}>
        <h1 className={styles.title}>Productos</h1>
        <p className={styles.subtitle}>Trabaja sobre una copia del catálogo y revisa su presentación comercial.</p>
      </header>
      <ProductsManager />
    </>
  );
};
