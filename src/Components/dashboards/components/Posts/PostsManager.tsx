import { useState } from "react";
import type { FormEvent } from "react";
import { useAdmin } from "../../AdminContext";
import { useUnsavedChanges } from "../../useUnsavedChanges";
import { slugify, validateContent, safeImage } from "../../adminModel";
import type { Post } from "../../adminModel";
import styles from "./PostsManager.module.css";
import {MediaField} from "../shared/MediaField/MediaField";
const blank = (): Post => ({id: crypto.randomUUID(), title: "", slug: "", excerpt: "", content: "", image: "", status: "draft", updatedAt: ""});
export const PostsManager = () => {
  const {data, save, trash,cloud} = useAdmin();
  const [form, setForm] = useState<Post | null>(null);
  const [original, setOriginal] = useState("");
  const [manualSlug, setManualSlug] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");
  const [readingImage,setReadingImage]=useState(false);
  const [preview, setPreview] = useState<Post | null>(null);
  useUnsavedChanges(!!form && JSON.stringify(form) !== original);
  const discard = () => !form || JSON.stringify(form) === original || window.confirm("¿Descartar los cambios sin guardar?");
  const open = (post: Post) => {
    if (!discard()) return;
    setForm({...post}); setOriginal(JSON.stringify(post)); setManualSlug(data.posts.some(p => p.id === post.id)); setError(""); setPreview(null);
  };
  const close = () => { if (discard()) {setForm(null); setError("");} };
  const change = (field: keyof Post, value: string) => setForm(previous => previous ? {...previous, [field]: value} : previous);
  const submit = async (event: FormEvent,intent:"publish"|"draft"="publish") => {
    event.preventDefault(); if (!form||readingImage) return;
    const post:Post = {...form,status:cloud?(intent==="publish"?"ready":"draft"):form.status, title: form.title.trim(), slug: form.slug.trim(), image: form.image.trim(), updatedAt: new Date().toISOString()};
    const validation = validateContent(post, data.posts);
    if (validation) {setError(validation); return;}
    const exists = data.posts.some(p => p.id === post.id);
    const posts = exists ? data.posts.map(p => p.id === post.id ? post : p) : [post, ...data.posts];
    if (await save({...data, posts}, (exists ? "Publicación actualizada: " : "Publicación creada: ") + post.title,true,cloud&&intent==="publish"?{publication:{module:"posts",id:post.id,action:"publish"}}:undefined)) {setForm(null); setError("");}
  };
  const remove = async (post: Post) => {
    if (await trash("posts",post.id)) {
      if (form?.id === post.id) setForm(null);
      if (preview?.id === post.id) setPreview(null);
    }
  };
  const posts = data.posts.filter(p => (filter === "all" || p.status === filter) && (p.title + " " + p.excerpt).toLocaleLowerCase("es").includes(query.toLocaleLowerCase("es")));
  return <div className={styles.container}>
    <div className={styles.toolbar}><label className={styles.search}>Buscar publicaciones<input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar por título o resumen" /></label><label className={styles.field}>Estado<select value={filter} onChange={e => setFilter(e.target.value)}><option value="all">Todos los estados</option><option value="draft">Borradores</option><option value="ready">Preparadas</option></select></label><button className={styles.primary} onClick={() => open(blank())}>+ Nueva publicación</button></div>
    {form && <form className={styles.panel} onSubmit={event=>void submit(event)}>
      <div className={styles.heading}><h2>{data.posts.some(p => p.id === form.id) ? "Editar publicación" : "Nueva publicación"}</h2><button type="button" onClick={close}>Cancelar</button></div>
      <div className={styles.formGrid}>
        <label className={styles.field}>Título<input required maxLength={160} value={form.title} onChange={e => {const value = e.target.value; setForm({...form, title: value, slug: manualSlug ? form.slug : slugify(value)});}} /></label>
        <label className={styles.field}>Dirección del contenido<input required value={form.slug} onChange={e => {setManualSlug(true); change("slug", e.target.value);}} /><small>Se genera desde el título. Al publicar, el contenido tendrá su propia página en Novedades.</small></label>
      </div>
      <label className={styles.field}>Resumen<textarea rows={3} maxLength={400} value={form.excerpt} onChange={e => change("excerpt", e.target.value)} /></label>
      <MediaField label="Imagen de portada (opcional)" value={form.image} onChange={value=>change("image",value)} onAsset={asset=>change("image",asset.src)} onBusy={setReadingImage}/>
      <label className={styles.field}>Contenido<textarea rows={10} value={form.content} onChange={e => change("content", e.target.value)} /><small>Texto simple; los saltos de línea se conservan.</small></label>
      <label className={styles.field}>Estado editorial<select value={form.status} onChange={e => change("status", e.target.value)}><option value="draft">Borrador</option><option value="ready">Preparada para publicar</option></select></label>
      {error && <p role="alert" className={styles.error}>{error}</p>}
      <div className={styles.actions}><button type="submit" disabled={readingImage} className={styles.primary}>{cloud?"Publicar en la web":"Guardar publicación"}</button>{cloud&&<button type="button" disabled={readingImage} onClick={event=>void submit(event,"draft")}>Guardar borrador</button>}<button type="button" onClick={() => setPreview(form)}>Vista previa</button></div>
    </form>}
    {preview && <article className={styles.panel} aria-label="Vista previa de publicación"><div className={styles.heading}><span className={styles.eyebrow}>VISTA PREVIA · CONTENIDO LOCAL</span><button onClick={() => setPreview(null)}>Cerrar vista previa</button></div>{preview.image && safeImage(preview.image) && <img className={styles.cover} src={preview.image} alt="" />}<h2>{preview.title || "Título de la publicación"}</h2><p className={styles.lead}>{preview.excerpt}</p><div className={styles.prose}>{preview.content}</div></article>}
    {posts.length ? <div className={styles.list}>{posts.map(post => <article key={post.id} className={styles.row}><div><span className={styles.badge}>{post.status === "ready" ? "Publicada / preparada" : "Borrador"}</span><h2>{post.title}</h2><p>Actualizada {new Date(post.updatedAt).toLocaleDateString("es-CO")}</p></div><div className={styles.actions}><button onClick={() => open(post)}>Editar</button><button onClick={() => setPreview(post)}>Vista previa</button>{cloud&&<button onClick={()=>void save({...data,posts:data.posts.map(item=>item.id===post.id?{...item,status:"draft"}:item)},"Publicación retirada: "+post.title,true,{publication:{module:"posts",id:post.id,action:"unpublish"}})}>Retirar de la web</button>}<button className={styles.danger} onClick={() => remove(post)}>Enviar a papelera</button></div></article>)}</div> : <div className={styles.empty}><span aria-hidden="true">✎</span><h2>{data.posts.length ? "Sin resultados" : "Tu primera publicación empieza aquí"}</h2><p>{data.posts.length ? "Prueba con otra búsqueda o cambia el estado." : "Cuenta una novedad de Ksoft, presenta un producto o comparte una idea con tus clientes."}</p></div>}
  </div>;
};
