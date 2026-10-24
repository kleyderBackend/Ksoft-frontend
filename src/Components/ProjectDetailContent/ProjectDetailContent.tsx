import { Link } from "react-router-dom";
import { FaArrowRight, FaArrowLeft, FaExternalLinkAlt } from "react-icons/fa";
import type { Project } from "../../config/projects";
import type { CatalogProduct } from "../../config/products";
import type { DetailSection } from "../../config/productSections";
import { ProjectCard, ProjectVisual } from "../ProjectCard/ProjectCard";
import { ScreenshotGallery } from "../../pages/Portfolio/ScreenshotGallery";
import { ProductQuestions } from "../../pages/ProductPages/ProductQuestions";
import { ProductDetailSections } from "../ProductDetailSections/ProductDetailSections";
import styles from "./ProjectDetailContent.module.css";

const ProjectCTA = () => (
  <section className={styles.cta} aria-labelledby="project-cta-title">
    <div><p className={styles.eyebrow}>TU PROYECTO PUEDE SER EL SIGUIENTE</p><h2 id="project-cta-title">¿Qué necesita resolver tu empresa?</h2><p>Cuéntanos el problema y conversemos sobre una solución con un alcance definido para tu negocio.</p></div>
    <Link className={styles.primaryLink} to="/contact">Hablemos de tu proyecto <FaArrowRight aria-hidden="true" /></Link>
  </section>
);

export const ProjectDetailContent = ({project,product,sections = [],related = []}: {project: Project; product?: CatalogProduct; sections?: DetailSection[]; related?: Project[]}) => (
  <div className={styles.page}>
        <header className={styles.detailHero}>
          <Link className={styles.textLink} to="/products"><FaArrowLeft aria-hidden="true" />Volver a Productos</Link>
          <div className={styles.detailHeading}>
            <div><p className={styles.eyebrow}>{project.category}</p><h1 className={styles.brandTitle}>{project.logo && <img src={project.logo} alt="" width="36" height="36" />}{project.name}</h1><p className={styles.lead}>{project.summary}</p></div>
            <span className={styles.status}>{project.status}</span>
          </div>
          {product && <Link className={styles.primaryLink} to={product.pilotHref}>{product.contactButtonText ?? "Solicitar participar en el piloto"} <FaArrowRight aria-hidden="true" /></Link>}
          <dl className={styles.facts}>
            <div><dt>Pensado para</dt><dd>{project.sector}</dd></div>
            {product?.billingModel && <div><dt>Modelo de cobro</dt><dd>{product.billingModel}</dd></div>}
            <div><dt>Disponibilidad</dt><dd>{project.status}</dd></div>
            <div><dt>¿Quieres saber más?</dt><dd><Link className={styles.textLink} to={product?.pilotHref ?? "/contact"}>Consultar con Ksoft</Link></dd></div>
          </dl>
        </header>
        {project.images.length > 0 ? <ScreenshotGallery key={project.slug} project={project} /> : <div className={styles.detailVisual}><ProjectVisual project={project} priority /></div>}
        <div className={styles.storyGrid}>
          <section aria-labelledby="challenge-title"><p className={styles.eyebrow}>TU NEGOCIO</p><h2 id="challenge-title">Qué necesitas resolver</h2><p>{project.challenge}</p></section>
          <section aria-labelledby="solution-title"><p className={styles.eyebrow}>LA SOLUCIÓN</p><h2 id="solution-title">Cómo te ayuda</h2><p>{project.solution}</p></section>
          <section aria-labelledby="benefit-title"><p className={styles.eyebrow}>EN TU DÍA A DÍA</p><h2 id="benefit-title">Qué puedes organizar mejor</h2><p>{project.benefit}</p></section>
        </div>
        {sections.length > 0 && <ProductDetailSections sections={sections} contactHref={product?.pilotHref ?? "/contact"} contactText={product?.contactButtonText ?? "Solicitar participar en el piloto"} />}
        {project.features.length > 0 && (
          <section className={styles.features} aria-labelledby="features-title">
            <div><p className={styles.eyebrow}>FUNCIONES DEL PRODUCTO</p><h2 id="features-title">Herramientas para tu negocio</h2></div>
            <ul>{project.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
          </section>
        )}
        {project.href && <section className={styles.visit} aria-labelledby="visit-title">
          <div><h2 id="visit-title">Explora {project.name}</h2><p>Conoce el proyecto y su propuesta.</p></div>
          <Link className={styles.textLink} to={project.href}>Visitar la web <FaExternalLinkAlt aria-hidden="true" /></Link>
        </section>}
        {product && product.questions.length > 0 && <ProductQuestions product={product} />}
        {related.length > 0 && <section className={styles.related} aria-labelledby="related-title"><header className={styles.sectionHeader}><h2 id="related-title">Conoce otra solución de Ksoft</h2><Link className={styles.textLink} to="/products">Ver todos los productos <FaArrowRight aria-hidden="true" /></Link></header><div className={styles.grid}>{related.map((item) => <ProjectCard key={item.slug} project={item} />)}</div></section>}
        <ProjectCTA />
  </div>
);
