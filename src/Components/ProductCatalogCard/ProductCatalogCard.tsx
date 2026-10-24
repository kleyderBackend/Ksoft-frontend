import { Link } from "react-router-dom";
import { FaArrowRight, FaArrowUp } from "react-icons/fa";
import type { CatalogProduct } from "../../config/products";
import styles from "./ProductCatalogCard.module.css";

export const ProductCatalogCard = ({product}: {product: CatalogProduct}) => (
          <article className={styles.productCard}>
            <div className={styles.productBrand}>
              <span className={styles.productSymbol} aria-hidden="true">{product.logo ? <img src={product.logo} alt="" width="82" height="82" /> : product.icon}</span>
              <p className={styles.eyebrow}>{product.sector}</p>
              <h3>{product.name}</h3>
              <p>Un producto de Ksoft Technology</p>
              <span className={styles.status}><i aria-hidden="true" />{product.status}</span>
            </div>
            <div className={styles.productInfo}>
              <p className={styles.cardLabel}>SOFTWARE PARA {product.sector.toUpperCase()}</p>
              <h4>{product.headline}</h4>
              <p>{product.description}</p>
              <dl className={styles.facts}>
                <div><dt>Dirigido a</dt><dd>{product.audience}</dd></div>
                <div><dt>Modalidad</dt><dd>Producto SaaS</dd></div>
                <div><dt>Modelo de cobro</dt><dd>{product.billingModel}</dd></div>
                <div><dt>Disponibilidad</dt><dd>{product.availability}</dd></div>
              </dl>
              <div className={styles.actions}>
                <Link className={styles.primaryLink} to={product.href}>{product.buttonText}<FaArrowUp className={styles.externalArrow} aria-hidden="true" /></Link>
                <Link className={styles.textLink} to={product.pilotHref} aria-label={`Solicitar participar en el piloto de ${product.name}`}>{product.contactButtonText ?? "Solicitar participar en el piloto"} <FaArrowRight aria-hidden="true" /></Link>
              </div>
            </div>
          </article>
);
