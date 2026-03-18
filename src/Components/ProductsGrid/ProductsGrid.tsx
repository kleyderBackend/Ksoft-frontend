import styles from "./ProductsGrid.module.css";

interface Product {
  name: string;
  description: string;
  icon: string;
  buttonText: string;
}

interface ProductsGridProps {
  products: Product[];
}

export const ProductsGrid = ({ products }: ProductsGridProps) => {
  return (
    <section className={styles.container}>
      <h2>Nuestros productos</h2>

      <div className={styles.grid}>
        {products.map((product, index) => (
          <div key={index} className={styles.card}>
            <span className={styles.icon}>{product.icon}</span>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <button>{product.buttonText}</button>
          </div>
        ))}
      </div>
    </section>
  );
};
