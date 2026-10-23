import styles from "./ProductsGrid.module.css";
import { useNavigate } from "react-router-dom";

interface Product {
  name: string;
  description: string;
  icon: string;
  buttonText: string;
  href?: string;
  comingSoon?: boolean;
}

interface ProductsGridProps {
  products: Product[];
}

export const ProductsGrid = ({ products }: ProductsGridProps) => {
  const navigate = useNavigate();

  // Función para manejar la navegación
  const handleNavigation = (href: string) => {
    if (href.startsWith("http")) {
      // Si es un link externo (como Vercel), usamos window.location
      window.open(href, "_blank", "noopener,noreferrer");
    } else {
      // Si es una ruta interna (como /contacto), usamos navigate
      navigate(href);
    }
  };

  return (
    <section className={styles.container}>
      <div className={styles.grid}>
        {products.map((product, index) => (
          <div key={index} className={styles.card}>
            <div className={styles.icon} aria-hidden="true">{product.icon}</div>
            <h2 className={styles.title}>{product.name}</h2>
            <p className={styles.desc}>{product.description}</p>
            {product.comingSoon && <p className={styles.badge}>Acceso anticipado</p>}

            <div className={styles.actions}>
              {/* Si es comingSoon, mostramos el botón de lista de espera o el badge */}
              {product.comingSoon ? (
                <button
                  type="button"
                  className={styles.button}
                  onClick={() => product.href && handleNavigation(product.href)}
                >
                  {product.buttonText}
                </button>
              ) : (
                <button
                  type="button"
                  className={styles.button}
                  onClick={() => {
                    if (product.href) handleNavigation(product.href);
                  }}
                >
                  {product.buttonText}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
