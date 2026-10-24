import { useState } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import type { Project } from "../../config/projects";
import styles from "./ScreenshotGallery.module.css";

export const ScreenshotGallery = ({ project }: { project: Project }) => {
  const [selected, setSelected] = useState(0);
  const current = project.images[selected] ?? project.images[0];
  if (!current) return null;

  return (
    <section className={styles.gallery} aria-labelledby="gallery-title">
      <header className={styles.header}>
        <p className={styles.eyebrow}>{project.galleryEyebrow ?? (project.slug === "ksoft-travel" ? "ASÍ SE VE KSOFT TRAVEL" : "CONOCE LA SOLUCIÓN")}</p>
        <h2 id="gallery-title">{project.galleryTitle ?? "Conoce el producto por dentro"}</h2>
        {project.galleryIntro && <p className={styles.intro}>{project.galleryIntro}</p>}
      </header>
      <div className={styles.viewer}>
        <div className={styles.toolbar}>
          <div><span className={styles.panelLabel}>{project.galleryPanelLabel ?? (project.slug === "ksoft-travel" ? "PANEL HOTEL" : "VISTA DEL PROYECTO")}</span><h3>{current.title}</h3></div>
          <a href={current.src} target="_blank" rel="noopener noreferrer" className={styles.fullImage} aria-label={`Abrir captura completa de ${current.title} en otra pestaña`}>Abrir captura completa <FaExternalLinkAlt aria-hidden="true" /></a>
        </div>
        <figure className={styles.figure}>
          <a href={current.src} target="_blank" rel="noopener noreferrer" aria-label={`${current.alt}. Abrir captura completa en otra pestaña`}>
            <img className={styles.image} src={current.src} alt={current.alt} width={current.width} height={current.height} loading="lazy" />
          </a>
          <figcaption aria-live="polite">{current.caption}</figcaption>
        </figure>
      </div>
      <div className={styles.choices} role="group" aria-label={`Capturas de ${project.name}`}>
        {project.images.map((item, index) => (
          <button type="button" key={item.src} className={styles.choice} aria-pressed={selected === index} onClick={() => setSelected(index)} aria-label={`Mostrar ${item.title}`}>
            <img src={item.src} alt="" width={item.width} height={item.height} loading="lazy" />
            <span>{item.title}</span>
          </button>
        ))}
      </div>
    </section>
  );
};
