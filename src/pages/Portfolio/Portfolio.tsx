import { Link, useParams } from "react-router-dom";
import { FaArrowRight, FaArrowLeft, FaTooth, FaExternalLinkAlt } from "react-icons/fa";
import { Navbar } from "../../Components/Navbar/Navbar";
import { Footer } from "../../Components/Footer/Footer";
import { NotFound } from "../NotFound/NotFound";
import { getProject, projects } from "../../config/projects";
import type { Project } from "../../config/projects";
import styles from "./Portfolio.module.css";
import { DentalProductDetails } from "./DentalProductDetails";
import { TravelProductDetails } from "./TravelProductDetails";
import { products } from "../../config/products";
import { ProductQuestions } from "../ProductPages/ProductQuestions";

const ProjectVisual = ({ project, priority = false }: { project: Project; priority?: boolean }) => (
  project.images.length > 0 ? (
    <img className={styles.cover} src={project.images[0].src} alt={project.images[0].alt} width="1270" height="714" loading={priority ? "eager" : "lazy"} />
  ) : (
    <div className={styles.productVisual}>
      {project.logo ? <img className={styles.productLogo} src={project.logo} alt={`Logo de ${project.name}`} width="256" height="256" /> : <FaTooth aria-hidden="true" />}
      <span className={styles.visualName}>{project.name}</span>
      <span>{project.status}</span>
    </div>
  )
);

export const ProjectCard = ({ project }: { project: Project }) => (
  <article className={styles.card}>
    <div className={styles.cardVisual}><ProjectVisual project={project} /></div>
    <div className={styles.cardBody}>
      <div className={styles.cardMeta}><p className={styles.eyebrow}>{project.category}</p><span className={styles.status}>{project.status}</span></div>
      <h3>{project.name}</h3>
      <p>{project.summary}</p>
      <Link className={styles.textLink} to={`/products/${project.slug}`} aria-label={`Conocer ${project.name}`}>Conocer el producto <FaArrowRight aria-hidden="true" /></Link>
    </div>
  </article>
);

export const ProductsPreview = () => (
  <section className={styles.preview} aria-labelledby="portfolio-preview-title">
    <header className={styles.sectionHeader}>
      <div><p className={styles.eyebrow}>SOLUCIONES DE KSOFT</p><h2 id="portfolio-preview-title">Software para tu negocio</h2></div>
      <Link className={styles.textLink} to="/products">Ver todos los productos <FaArrowRight aria-hidden="true" /></Link>
    </header>
    <div className={styles.grid}>{projects.map((project) => <ProjectCard key={project.slug} project={project} />)}</div>
  </section>
);

const ProjectCTA = () => (
  <section className={styles.cta} aria-labelledby="project-cta-title">
    <div><p className={styles.eyebrow}>TU PROYECTO PUEDE SER EL SIGUIENTE</p><h2 id="project-cta-title">¿Qué necesita resolver tu empresa?</h2><p>Cuéntanos el problema y conversemos sobre una solución con un alcance definido para tu negocio.</p></div>
    <Link className={styles.primaryLink} to="/contact">Hablemos de tu proyecto <FaArrowRight aria-hidden="true" /></Link>
  </section>
);

export const ProjectDetail = () => {
  const { slug } = useParams();
  const project = getProject(slug ?? "");
  if (!project) return <NotFound />;
  const related = projects.filter((item) => item.slug !== project.slug);
  const product = products.find((item) => item.slug === project.slug);

  return (
    <>
      <Navbar title="Ksoft" imglogo="/img/logo.png" />
      <main id="main-content" tabIndex={-1} className={styles.page}>
        <header className={styles.detailHero}>
          <Link className={styles.textLink} to="/products"><FaArrowLeft aria-hidden="true" />Volver a Productos</Link>
          <div className={styles.detailHeading}>
            <div><p className={styles.eyebrow}>{project.category}</p><h1>{project.name}</h1><p className={styles.lead}>{project.summary}</p></div>
            <span className={styles.status}>{project.status}</span>
          </div>
          {product && <Link className={styles.primaryLink} to={product.pilotHref}>Solicitar participar en el piloto <FaArrowRight aria-hidden="true" /></Link>}
          <dl className={styles.facts}>
            <div><dt>Pensado para</dt><dd>{project.sector}</dd></div>
            {product && <div><dt>Modelo de cobro</dt><dd>{product.billingModel}</dd></div>}
            <div><dt>Disponibilidad</dt><dd>{project.status}</dd></div>
            <div><dt>¿Quieres saber más?</dt><dd><Link className={styles.textLink} to={product?.pilotHref ?? "/contact"}>Consultar con Ksoft</Link></dd></div>
          </dl>
        </header>
        <div className={styles.detailVisual}><ProjectVisual project={project} priority /></div>
        <div className={styles.storyGrid}>
          <section aria-labelledby="challenge-title"><p className={styles.eyebrow}>TU NEGOCIO</p><h2 id="challenge-title">Qué necesitas resolver</h2><p>{project.challenge}</p></section>
          <section aria-labelledby="solution-title"><p className={styles.eyebrow}>LA SOLUCIÓN</p><h2 id="solution-title">Cómo te ayuda</h2><p>{project.solution}</p></section>
          <section aria-labelledby="benefit-title"><p className={styles.eyebrow}>EN TU DÍA A DÍA</p><h2 id="benefit-title">Qué puedes organizar mejor</h2><p>{project.benefit}</p></section>
        </div>
        {project.slug === "saas-dental" && <DentalProductDetails />}
        {project.slug === "ksoft-travel" && <TravelProductDetails />}
        {project.features.length > 0 && (
          <section className={styles.features} aria-labelledby="features-title">
            <div><p className={styles.eyebrow}>FUNCIONES DEL PRODUCTO</p><h2 id="features-title">Herramientas para tu negocio</h2></div>
            <ul>{project.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
          </section>
        )}
        {project.images.length > 0 && (
          <section className={styles.gallery} aria-labelledby="gallery-title">
            <header className={styles.sectionHeader}><h2 id="gallery-title">Un vistazo al proyecto</h2><p>Capturas reales de la web</p></header>
            <div className={styles.grid}>{project.images.map((image) => (
              <figure key={image.src}><a href={image.src} target="_blank" rel="noopener noreferrer" aria-label={`${image.alt}. Abrir captura completa en otra pestaña`}><img src={image.src} alt={image.alt} width="1270" height="714" loading="lazy" /></a><figcaption>{image.caption}</figcaption></figure>
            ))}</div>
          </section>
        )}
        {project.href && <section className={styles.visit} aria-labelledby="visit-title">
          <div><h2 id="visit-title">Explora {project.name}</h2><p>Conoce el proyecto y su propuesta.</p></div>
          <Link className={styles.textLink} to={project.href}>Visitar la web <FaExternalLinkAlt aria-hidden="true" /></Link>
        </section>}
        {product && <ProductQuestions product={product} />}
        {related.length > 0 && <section className={styles.related} aria-labelledby="related-title"><header className={styles.sectionHeader}><h2 id="related-title">Conoce otra solución de Ksoft</h2><Link className={styles.textLink} to="/products">Ver todos los productos <FaArrowRight aria-hidden="true" /></Link></header><div className={styles.grid}>{related.map((item) => <ProjectCard key={item.slug} project={item} />)}</div></section>}
        <ProjectCTA />
      </main>
      <Footer />
    </>
  );
};
