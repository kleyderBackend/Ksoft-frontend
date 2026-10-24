import {Link} from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useAdmin } from "../../../AdminContext";
import { normalizeProduct,slugify,validateContent } from "../../../adminModel";
import type {SaveOptions} from "../../../AdminContext";
import type { Product } from "../../../adminModel";
import { useUnsavedChanges } from "../../../useUnsavedChanges";
import { PublicContentFields } from "../PublicContentFields/PublicContentFields";
import { PublicContentPreview } from "../PublicContentPreview/PublicContentPreview";
import { MediaField } from "../MediaField/MediaField";
import styles from "./PublicContentManager.module.css";
const blank = (entryType: Product["entryType"]): Product => normalizeProduct({id:crypto.randomUUID(),name:"",slug:"",headline:"",description:"",icon:"◇",logo:"",sector:"",audience:"",billingModel:"",availability:"",status:entryType==="product"?"Preparación de piloto":"",questions:[],editorialStatus:"draft",updatedAt:"",entryType,buttonText:entryType==="product"?"Conocer el producto":"Ver proyecto",contactButtonText:entryType==="product"?"Solicitar participar en el piloto":"Consultar con Ksoft"});
export function PublicContentManager({entryType}: {entryType: Product["entryType"]}) {
  const {data,save,trash,cloud} = useAdmin();
  const entries = entryType==="product"?data.products:data.publicProjects??[];
  const [form,setForm] = useState<Product|null>(null), [original,setOriginal] = useState(""), [manualSlug,setManualSlug] = useState(false);
  const [query,setQuery] = useState(""), [error,setError] = useState(""), [busy,setBusy] = useState(false), [preview,setPreview] = useState<Product|null>(null);
  const [filter,setFilter] = useState("all");
  const formRef = useRef<HTMLFormElement>(null);
  const editingId = form?.id;
  useEffect(() => { if (editingId) formRef.current?.scrollIntoView({block:"start",behavior:"smooth"}); },[editingId]);
  useUnsavedChanges(!!form && JSON.stringify(form)!==original);
  const noun = entryType==="product"?"producto":"proyecto";
  const discard = ()=>!form||JSON.stringify(form)===original||window.confirm("¿Descartar los cambios sin guardar?");
  const open = (entry:Product) => {if(!discard())return;const next=structuredClone(normalizeProduct(entry));setForm(next);setOriginal(JSON.stringify(next));setManualSlug(entries.some(item=>item.id===entry.id));setError("");setPreview(null);};
  const update = (updater:(previous:Product)=>Product) => setForm(previous=>previous?updater(previous):previous);
  const change = (key:keyof Product,value:string) => update(previous=>({...previous,[key]:value}));
  const saveEntries = (next:Product[],message:string,options?:SaveOptions)=>save({...data,...(entryType==="product"?{products:next}:{publicProjects:next})},message,true,options);
  const submit = async (event:FormEvent,intent:"publish"|"draft"="publish") => {
    event.preventDefault();if(!form||busy)return;
    const entry:Product={...form,...(cloud?{editorialStatus:intent==="publish"?"ready" as const:"draft" as const,...(intent==="publish"?{visibility:"visible" as const}:{})}:{}),...(entryType==="project"?{description:form.presentation.summary,audience:form.presentation.detailSector,sector:form.presentation.category}:{}),name:form.name.trim(),slug:form.slug.trim(),logo:form.logo.trim(),updatedAt:new Date().toISOString()};
    const validation=validateContent(entry,[...data.products,...(data.publicProjects??[])]);
    if(validation){setError(validation);return;}
    const exists=entries.some(item=>item.id===entry.id);
    if(await saveEntries(exists?entries.map(item=>item.id===entry.id?entry:item):[entry,...entries],"Ficha de "+noun+" guardada: "+entry.name,cloud&&intent==="publish"?{publication:{module:entryType==="product"?"products":"publicProjects",id:entry.id,action:"publish"}}:undefined)){setForm(null);setPreview(entry);setError("");}
  };
  const fields: {key:keyof Product;label:string;required?:boolean}[] = [
    {key:"sector",label:"Sector de la tarjeta"},{key:"audience",label:"Dirigido a",required:true},
    {key:"headline",label:"Título comercial de la tarjeta"},{key:"status",label:"Estado que verá el público"},
    {key:"availability",label:"Disponibilidad"},{key:"icon",label:"Símbolo o emoji"},
    {key:"buttonText",label:"Texto del botón para conocer el "+noun},{key:"contactButtonText",label:"Texto del botón de contacto"},
  ];
  const shown=entries.filter(item=>(item.name+" "+item.sector).toLocaleLowerCase("es").includes(query.toLocaleLowerCase("es"))&&(filter==="all"||item.editorialStatus===filter));
  return <><div className={styles.container}>
    <div className={styles.toolbar}><label className={styles.search}>Buscar {entryType==="product"?"productos":"proyectos públicos"}<input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Nombre o sector"/></label><label className={styles.field}>Estado editorial<select value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">Todos</option><option value="draft">Borradores</option><option value="ready">Preparados</option></select></label><button type="button" className={styles.primary} onClick={()=>open(blank(entryType))}>+ Nuevo {noun}{entryType==="project"?" público":""}</button></div>
    {form && <form ref={formRef} className={styles.panel} onSubmit={event=>void submit(event)}>
      <div className={styles.heading}><h2>{entries.some(item=>item.id===form.id)?"Editar":"Crear"} ficha de {noun}</h2><button type="button" disabled={busy} onClick={()=>{if(discard()){setForm(null);setError("");}}}>Cancelar edición</button></div>
      <p className={styles.count}>Completa la tarjeta y su detalle. Los textos de ejemplo existentes se conservan para que puedas editarlos. Publicar en la web guarda la ficha y actualiza su tarjeta y detalle. Guardar borrador conserva los cambios sin publicarlos.</p>
      <fieldset className={styles.editGroup} disabled={busy}><legend>Tarjeta e información comercial</legend><div className={styles.formGrid}>
        <label className={styles.field}>Nombre del {noun}<input required maxLength={160} value={form.name} onChange={e=>{const name=e.target.value;update(previous=>({...previous,name,slug:manualSlug?previous.slug:slugify(name)}));}}/></label>
        <label className={styles.field}>Dirección del contenido<input required value={form.slug} onChange={e=>{setManualSlug(true);change("slug",e.target.value);}}/><small>Identificador único. Los enlaces de detalle y contacto se generan a partir de él.</small></label>
        {fields.filter(field=>entryType==="product"||["status","icon","contactButtonText"].includes(field.key)).map(field=><label className={styles.field} key={field.key}>{field.label}<input required={field.required} value={form[field.key] as string} onChange={e=>change(field.key,e.target.value)}/></label>)}
        {entryType==="product"&&<><label className={styles.field}>Modelo de cobro<input required value={form.billingModel} onChange={e=>change("billingModel",e.target.value)}/></label><label className={styles.field}>Objetivo del contacto<select value={form.contactIntent ?? "pilot"} onChange={e=>change("contactIntent",e.target.value)}><option value="pilot">Solicitar participación en el piloto</option><option value="product">Consultar el producto</option></select></label></>}
      </div>{entryType==="product"&&<label className={styles.field}>Descripción comercial de la tarjeta<textarea required rows={4} value={form.description} onChange={e=>change("description",e.target.value)}/></label>}
      <MediaField label="Logo (opcional)" value={form.logo} onChange={logo=>change("logo",logo)} onAsset={asset=>change("logo",asset.src)} onBusy={setBusy}/>
      </fieldset>
      <PublicContentFields value={form} onChange={update} onBusy={setBusy} busy={busy}/>
      <fieldset className={styles.editGroup} disabled={busy}><legend>Preguntas frecuentes y publicación</legend>
        {form.questions.map((question,index)=><fieldset className={styles.question} key={index}><legend>Pregunta {index+1}</legend><label className={styles.field}>Pregunta<input value={question.question} onChange={e=>update(previous=>({...previous,questions:previous.questions.map((q,i)=>i===index?{...q,question:e.target.value}:q)}))}/></label><label className={styles.field}>Respuesta<textarea rows={3} value={question.answer} onChange={e=>update(previous=>({...previous,questions:previous.questions.map((q,i)=>i===index?{...q,answer:e.target.value}:q)}))}/></label><div className={styles.actions}><button type="button" onClick={()=>update(previous=>{const questions=[...previous.questions];if(index>0)[questions[index],questions[index-1]]=[questions[index-1],questions[index]];return {...previous,questions};})} disabled={index===0}>Subir pregunta {index+1}</button><button type="button" disabled={index===form.questions.length-1} onClick={()=>update(previous=>{const questions=[...previous.questions];if(index<questions.length-1)[questions[index],questions[index+1]]=[questions[index+1],questions[index]];return {...previous,questions};})}>Bajar pregunta {index+1}</button><button type="button" onClick={()=>update(previous=>({...previous,questions:previous.questions.filter((_,i)=>i!==index)}))}>Eliminar pregunta {index+1}</button></div></fieldset>)}
        <button type="button" onClick={()=>update(previous=>({...previous,questions:[...previous.questions,{question:"",answer:""}]}))}>Añadir pregunta frecuente</button>
        <div className={styles.formGrid}><label className={styles.field}>Estado editorial<select value={form.editorialStatus} onChange={e=>change("editorialStatus",e.target.value)}><option value="draft">Borrador</option><option value="ready">Preparado para publicar</option></select></label><label className={styles.field}>Visibilidad del catálogo de prueba<select value={form.visibility} onChange={e=>change("visibility",e.target.value)}><option value="visible">Visible</option><option value="hidden">Oculto</option></select></label></div><small>{cloud?"Publicar en la web actualiza esta ficha. Guardar borrador conserva la versión pública anterior hasta que decidas publicar o retirarla.":"La visibilidad se conserva en el respaldo local. Esta acción todavía no publica ni elimina contenido de la web online."}</small>
      </fieldset>
      {error&&<p role="alert" className={styles.error}>{error}</p>}
      <div className={styles.actions}><button type="submit" className={styles.primary} disabled={busy}>{busy?"Cargando imagen…":cloud?"Publicar en la web":"Guardar ficha completa"}</button>{cloud&&<button type="button" disabled={busy} onClick={event=>void submit(event,"draft")}>Guardar borrador</button>}<button type="button" disabled={busy} onClick={()=>setPreview(form)}>Ver tarjeta y detalle</button></div>
    </form>}
    {!form&&error&&<p role="alert" className={styles.error}>{error}</p>}
    {shown.length?<div className={styles.list}>{shown.map(entry=><article key={entry.id} className={styles.row}><div><span className={styles.eyebrow}>{entry.sector}</span><h2>{entry.name}</h2><p>{entry.status} · {entry.visibility==="hidden"?"Oculto":"Visible al publicar"}</p><span className={styles.badge}>{entry.editorialStatus==="ready"?"Contenido preparado":"Borrador editorial"}</span></div><div className={styles.actions}><button type="button" onClick={()=>open(entry)}>Editar ficha</button>{entryType==="product"&&<Link className={styles.actionLink} to={"/dashboard/projects?productId="+encodeURIComponent(entry.id)+(data.workspace.records.projects.some(project=>project.values.productId===entry.id)?"":"&action=new")}>Gestionar desarrollo</Link>}{entryType==="product"&&<Link className={styles.actionLink} to={"/dashboard/tasks?action=new&productId="+encodeURIComponent(entry.id)}>Crear tarea</Link>}<button type="button" onClick={()=>setPreview(entry)}>Ver tarjeta y detalle</button>{cloud&&<button type="button" onClick={()=>void saveEntries(entries.map(item=>item.id===entry.id?{...item,editorialStatus:"draft"}:item),"Ficha retirada: "+entry.name,{publication:{module:entryType==="product"?"products":"publicProjects",id:entry.id,action:"unpublish"}})}>Retirar de la web</button>}<button type="button" className={styles.danger} onClick={async()=>{if(await trash(entryType==="product"?"products":"publicProjects",entry.id)){if(form?.id===entry.id)setForm(null);if(preview?.id===entry.id)setPreview(null);}}}>Enviar ficha a papelera</button></div></article>)}</div>:<section className={styles.empty}><h2>{entries.length?"Sin resultados":"Todavía no hay proyectos públicos"}</h2><p>Crea una ficha para presentar su tarjeta, imágenes, beneficios y detalle completo.</p></section>}
  </div>{preview&&<PublicContentPreview key={preview.id} value={form?.id===preview.id?form:preview} related={entries} onClose={()=>setPreview(null)}/>}</>;
}



