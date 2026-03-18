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

  return (
    <section className={styles.container}>
      <h2>Nuestros productos</h2>

      <div className={styles.grid}>
        {products.map((product, index) => (
          <div key={index} className={styles.card}>
            <div className={styles.icon}>{product.icon}</div>
            <h3 className={styles.title}>{product.name}</h3>
            <p className={styles.desc}>{product.description}</p>

            <div className={styles.actions}>
              {product.comingSoon ? (
                <span className={styles.badge}>Próximamente</span>
              ) : (
                <button
                  type="button"
                  className={styles.button}
                  onClick={() => {
                    if (product.href) navigate(product.href);
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
