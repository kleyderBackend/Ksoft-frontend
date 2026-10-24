import { Link } from "react-router-dom";
import { FaTooth, FaArrowRight } from "react-icons/fa";
import type { Project } from "../../config/projects";
import styles from "./ProjectCard.module.css";

export const ProjectVisual = ({ project, priority = false }: { project: Project; priority?: boolean }) => (
  (project.cover || project.images.length > 0) ? (
    <img className={styles.cover} src={(project.cover ?? project.images[0]).src} alt={(project.cover ?? project.images[0]).alt} width={(project.cover ?? project.images[0]).width} height={(project.cover ?? project.images[0]).height} loading={priority ? "eager" : "lazy"} />
  ) : (
    <div className={styles.productVisual}>
      {project.logo ? <img className={styles.productLogo} src={project.logo} alt={`Logo de ${project.name}`} width="256" height="256" /> : project.slug === "saas-dental" ? <FaTooth aria-hidden="true" /> : <span aria-hidden="true">{project.icon || "◇"}</span>}
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
      <h3 className={styles.brandTitle}>{project.logo && project.images.length > 0 && <img src={project.logo} alt="" width="36" height="36" />}{project.name}</h3>
      <p>{project.summary}</p>
      <Link className={styles.textLink} to={`/products/${project.slug}`} aria-label={`Conocer ${project.name}`}>{project.buttonText ?? "Conocer el producto"} <FaArrowRight aria-hidden="true" /></Link>
    </div>
  </article>
);
