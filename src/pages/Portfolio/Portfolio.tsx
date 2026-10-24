import { Link, useParams } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { Navbar } from "../../Components/Navbar/Navbar";
import { Footer } from "../../Components/Footer/Footer";
import { NotFound } from "../NotFound/NotFound";
import { usePublicSite } from "../../content/publicSiteContext";
import styles from "./Portfolio.module.css";
import { ProjectDetailContent } from "../../Components/ProjectDetailContent/ProjectDetailContent";
import { ProjectCard } from "../../Components/ProjectCard/ProjectCard";
import { productSections } from "../../config/productSections";
export { ProjectCard } from "../../Components/ProjectCard/ProjectCard";

export const ProductsPreview = () => {
  const {projects,posts,loading,error}=usePublicSite();
  return (
  <section className={styles.preview} aria-labelledby="portfolio-preview-title">
    <header className={styles.sectionHeader}>
      <div><p className={styles.eyebrow}>SOLUCIONES DE KSOFT</p><h2 id="portfolio-preview-title">Software para tu negocio</h2></div>
      <Link className={styles.textLink} to="/products">Ver todos los productos <FaArrowRight aria-hidden="true" /></Link>
    </header>
    <div className={styles.grid}>{projects.map((project) => <ProjectCard key={project.slug} project={project} />)}</div>
    {loading&&<p role="status">Cargando contenido…</p>}{error&&<p role="alert">{error}</p>}
    {posts.length>0&&<section className={styles.newsPreview} aria-label="Novedades de Ksoft"><header className={styles.sectionHeader}><h2>Novedades de Ksoft</h2><Link className={styles.textLink} to="/novedades">Todas las publicaciones →</Link></header><div className={styles.grid}>{posts.slice(0,3).map(post=><article className={styles.newsCard} key={post.id}>{post.image&&<img src={post.image} alt={post.title} loading="lazy"/>}<h3><Link to={"/novedades/"+post.slug}>{post.title}</Link></h3><p>{post.excerpt}</p><Link className={styles.textLink} to={"/novedades/"+post.slug}>Leer publicación →</Link></article>)}</div></section>}
  </section>
);};

export const ProjectDetail = () => {
  const {slug} = useParams();
  const {projects,products,entries,loading,error}=usePublicSite();
  if(loading||error)return <><Navbar title="Ksoft" imglogo="/img/logo.png"/><main id="main-content" style={{padding:"4rem"}}><p role={error?"alert":"status"}>{error||"Cargando producto…"}</p></main><Footer/></>;
  const project = projects.find(item=>item.slug===slug);
  if (!project) return <NotFound />;
  const product = products.find(item => item.slug === project.slug);
  const related = projects.filter(item => item.slug !== project.slug);
  return <><Navbar title="Ksoft" imglogo="/img/logo.png" /><main id="main-content" tabIndex={-1}><ProjectDetailContent project={project} product={product} sections={entries.find(item=>item.slug===slug)?.presentation.sections??productSections[project.slug]??[]} related={related} /></main><Footer /></>;
};
