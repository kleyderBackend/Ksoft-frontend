import {Link,useParams} from "react-router-dom";
import {Navbar} from "../../Components/Navbar/Navbar";
import {Footer} from "../../Components/Footer/Footer";
import {usePublicSite} from "../../content/publicSiteContext";
import {NotFound} from "../NotFound/NotFound";
import styles from "./Novedades.module.css";
export function Novedades(){
 const {posts,loading,error}=usePublicSite();
 return <><Navbar title="Ksoft" imglogo="/img/logo.png"/><main id="main-content" tabIndex={-1} className={styles.page}><header><p className={styles.eyebrow}>ACTUALIDAD DE KSOFT</p><h1>Novedades e ideas</h1><p>Conoce nuestras publicaciones, avances y noticias.</p></header>{loading&&<p role="status">Cargando publicaciones…</p>}{error&&<p role="alert">{error}</p>}<div className={styles.grid}>{posts.map(post=><article className={styles.card} key={post.id}>{post.image&&<img src={post.image} alt={post.title} loading="lazy"/>}<div><h2><Link to={"/novedades/"+post.slug}>{post.title}</Link></h2><p>{post.excerpt}</p><Link className={styles.link} to={"/novedades/"+post.slug}>Leer publicación →</Link></div></article>)}</div>{!loading&&!error&&!posts.length&&<p>Próximamente compartiremos nuevas publicaciones.</p>}</main><Footer/></>;
}
export function NovedadDetalle(){
 const {slug}=useParams();const {posts,loading,error}=usePublicSite();const post=posts.find(item=>item.slug===slug);
 if(!loading&&!error&&!post)return <NotFound/>;
 return <><Navbar title="Ksoft" imglogo="/img/logo.png"/><main id="main-content" tabIndex={-1} className={styles.page}><Link className={styles.link} to="/novedades">← Todas las publicaciones</Link>{loading?<p role="status">Cargando publicación…</p>:error?<p role="alert">{error}</p>:post&&<article className={styles.article}><p className={styles.eyebrow}>NOVEDADES DE KSOFT</p><h1>{post.title}</h1><p className={styles.lead}>{post.excerpt}</p>{post.image&&<img className={styles.cover} src={post.image} alt={post.title}/>}<div className={styles.prose}>{post.content}</div><Link className={styles.link} to="/contact">Conversemos sobre tu proyecto →</Link></article>}</main><Footer/></>;
}
