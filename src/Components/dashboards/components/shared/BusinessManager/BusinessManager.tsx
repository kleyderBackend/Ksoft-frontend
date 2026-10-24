import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAdmin } from "../../../AdminContext";
import { useUnsavedChanges } from "../../../useUnsavedChanges";
import { modules, moduleKeys, validateRecord, money, csvCell, quoteTotals } from "../../../businessModel";
import { newBusinessRecord, requestToContact, contactToClient, acceptedQuoteToProject } from "../../../models/businessFlowModel";
import type { AdminData } from "../../../adminModel";
import type { ModuleKey, BusinessRecord } from "../../../businessModel";
import styles from "./BusinessManager.module.css";
import {DeveloperWorkManager} from "../../DeveloperWork/DeveloperWorkManager";
import {AssignmentsManager} from "../../Assignments/AssignmentsManager";

function downloadFile(record: BusinessRecord) {
  const binary = atob(record.values.base64);
  const buffer = Uint8Array.from(binary, character => character.charCodeAt(0));
  const url = URL.createObjectURL(new Blob([buffer], {type: "application/octet-stream"}));
  const link = document.createElement("a"); link.href = url; link.download = record.values.filename; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function BusinessManagerContent({module,search}: {module: ModuleKey; search: string}) {
  const navigate=useNavigate();
  const {data, save, trash,cloud} = useAdmin();
  const definition = modules[module], workspace = data.workspace;
  const records = workspace.records[module];
  const [initial] = useState(() => {
    const params=new URLSearchParams(search),recordId=params.get("record");
    try { return {form:params.get("action")==="new"?newBusinessRecord(data,module,search):null,detail:recordId?records.find(record=>record.id===recordId)??null:null,error:recordId&&!records.some(record=>record.id===recordId)?"El registro ya no está disponible. Revisa la papelera.":""}; }
    catch(cause) { return {form:null,detail:null,error:cause instanceof Error?cause.message:"No se pudo preparar el formulario."}; }
  });
  const [form, setForm] = useState<BusinessRecord | null>(initial.form);
  const [baseline, setBaseline] = useState(initial.form?JSON.stringify(initial.form):"");
  const [error, setError] = useState(initial.error);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("");
  const [selectedDetail, setDetail] = useState<BusinessRecord | null>(initial.detail);
  const detail=selectedDetail?records.find(record=>record.id===selectedDetail.id)??null:null;
  const [assignment,setAssignment]=useState<string|null>(null);
  const [readingFile, setReadingFile] = useState(false);
  const formRef=useRef<HTMLFormElement>(null),detailRef=useRef<HTMLElement>(null);
  const errorRef=useRef<HTMLParagraphElement>(null);
  useEffect(()=>{if(error){errorRef.current?.scrollIntoView({block:"center",behavior:"smooth"});errorRef.current?.focus({preventScroll:true});}},[error]);
  const formId=form?.id,detailId=detail?.id;
  useEffect(()=>{if(formId)formRef.current?.scrollIntoView({block:"start",behavior:"smooth"});},[formId]);
  useEffect(()=>{if(detailId){detailRef.current?.scrollIntoView({block:"start",behavior:"smooth"});detailRef.current?.focus({preventScroll:true});}},[detailId]);
  useUnsavedChanges(!!form && JSON.stringify(form) !== baseline);
  const discard = () => !form || JSON.stringify(form) === baseline || window.confirm("¿Descartar los cambios sin guardar?");
  const open = (record?: BusinessRecord) => {
    if (!discard()) return;
    const next=record?structuredClone(record):newBusinessRecord(data,module);
    setForm(next); setBaseline(JSON.stringify(next)); setError(""); setDetail(null);
  };
  const change=(key:string,value:string)=>setForm(previous=>{
    if(!previous)return previous;
    const values={...previous.values,[key]:value};
    if(key==="client"&&values.quote&&workspace.records.quotes.find(quote=>quote.id===values.quote)?.values.client!==value)values.quote="";
    if(key==="quote"&&value){const quote=workspace.records.quotes.find(record=>record.id===value);if(quote){values.client=quote.values.client;if(module==="payments"&&!values.amount)values.amount=String(Math.max(0,quoteTotals(workspace,value).unallocated));if(module==="projects"&&!values.scope)values.scope=quote.values.scope;}}
    return {...previous,values};
  });
  const commitRecords = (next: BusinessRecord[], message: string) => save({...data, workspace: {...workspace, records: {...workspace.records, [module]: next}}}, message);
  const submit = async (event: FormEvent) => {
    event.preventDefault(); if (!form || readingFile) return;
    const record = {...form, updatedAt: new Date().toISOString(), values: Object.fromEntries(Object.entries(form.values).map(([key,value]) => [key, value.trim()]))};
    const validation = validateRecord(module, record.values, workspace, record.id);
    if (validation) {setError(validation); return;}
    if (module === "files" && !record.values.base64) {setError("Selecciona un archivo antes de guardar."); return;}
    const exists = records.some(r => r.id === record.id);
    if (await commitRecords(exists ? records.map(r => r.id === record.id ? record : r) : [record, ...records], definition.title + ": " + record.values.name + (exists ? " actualizado" : " creado"))) {setForm(null); setDetail(record); setError("");navigate("/dashboard/"+module+"?record="+encodeURIComponent(record.id),{replace:true});}
  };
  const remove=async(record:BusinessRecord)=>{if(await trash(module,record.id)){if(form?.id===record.id)setForm(null);if(detail?.id===record.id)setDetail(null);setError("");}};
  const runAction=async(action:()=>AdminData,message:string)=>{try{if(await save(action(),message))setError("");}catch(cause){setError(cause instanceof Error?cause.message:"No se pudo completar la acción.");}};
  const convertRequest=(record:BusinessRecord)=>runAction(()=>requestToContact(data,record.id),"Solicitud asociada a contacto: "+record.values.name);
  const convertContact=(record:BusinessRecord)=>runAction(()=>contactToClient(data,record.id),"Contacto convertido en cliente: "+record.values.name);
  const createProject=(record:BusinessRecord)=>runAction(()=>acceptedQuoteToProject(data,record.id),"Proyecto creado desde cotización: "+record.values.name);
  const statusField = definition.fields.find(field => field.key === "status");
  const labelValue = (record: BusinessRecord, key: string) => {
    const field = definition.fields.find(f => f.key === key);
    const value = record.values[key] || "";
    if (field?.relation) return workspace.records[field.relation].find(r => r.id === value)?.values.name || "Sin asignar";
    if(module==="requests"&&key==="product")return data.products.find(product=>product.slug===value)?.name || (value?"Producto archivado: "+value:"Sin producto");
    if (key === "amount") return money(Number(value || 0));
    return value;
  };
  const visible = records.filter(record => (!filter || record.values.status === filter) && definition.fields.map(field => labelValue(record, field.key)).join(" ").toLocaleLowerCase("es").includes(query.toLocaleLowerCase("es")));
  const exportCsv = () => {
    const rows = [definition.fields.map(field => field.label), ...visible.map(record => definition.fields.map(field => labelValue(record, field.key)))];
    const url = URL.createObjectURL(new Blob(["\uFEFF" + rows.map(row => row.map(csvCell).join(";")).join("\r\n")], {type: "text/csv;charset=utf-8"}));
    const link = document.createElement("a"); link.href = url; link.download = module + ".csv"; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const fileSelected = async (file?: File) => {
    if (!file || !form) return;
    const targetFormId = form.id;
    if (file.size > 512000 || !/\.(pdf|png|jpg|jpeg|webp|txt|csv|docx|xlsx)$/i.test(file.name)) {setError("Usa PDF, imágenes PNG/JPG/WebP, texto, CSV, Word o Excel de hasta 500 KB."); return;}
    setReadingFile(true); setError("");
    try {
      const base64 = await new Promise<string>((resolve,reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result).split(",")[1]);
        reader.onerror = () => reject(new Error("No se pudo leer"));
        reader.readAsDataURL(file);
      });
        setForm(previous => previous?.id === targetFormId ? {...previous, values: {...previous.values, name: previous.values.name || file.name, filename: file.name, base64, size: String(file.size)}} : previous);
    } catch {setError("No se pudo leer el archivo. Inténtalo de nuevo.");} finally {setReadingFile(false);}
  };
  const related = detail ? moduleKeys.flatMap(key => modules[key].fields.filter(field => field.relation === module).flatMap(field => workspace.records[key].filter(record => record.values[field.key] === detail.id).map(record => ({module: key, record})))) : [];
  return <>

    <div className={styles.container}>
      <div className={styles.toolbar}><label className={styles.search}>Buscar en {definition.title.toLowerCase()}<input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Nombre, cliente o información…" /></label>
        {statusField && <label className={styles.field}>Filtrar por estado<select value={filter} onChange={e => setFilter(e.target.value)}><option value="">Todos los estados</option>{statusField.options?.map(option => <option key={option}>{option}</option>)}</select></label>}
        <button onClick={exportCsv}>Exportar CSV</button><button className={styles.primary} onClick={() => open()}>+ Crear {definition.singular}</button>
      </div>
      {error && <p ref={errorRef} tabIndex={-1} role="alert" className={styles.error}>{error}</p>}
      {assignment&&(module==="projects"||module==="tasks")&&<AssignmentsManager module={module} id={assignment} onClose={()=>setAssignment(null)}/>}
      {form && <form ref={formRef} className={styles.panel} onSubmit={submit}>
        <div className={styles.heading}><h2>{records.some(r => r.id === form.id) ? "Editar " : "Crear "}{definition.singular}</h2><button type="button" onClick={() => {if (discard()) {setForm(null); setError("");}}}>Cancelar</button></div>
        <div className={styles.formGrid}>
          {definition.fields.map(field => <label className={styles.field} key={field.key}>{field.label}{(field.required || module==="requests"&&field.key==="product"&&form.values.purpose==="Participación en piloto") ? " *" : ""}
            {field.type === "select" ? <select required={field.required || module==="requests"&&field.key==="product"&&form.values.purpose==="Participación en piloto"} value={form.values[field.key] || ""} onChange={e => change(field.key, e.target.value)}>
              <option value="">{field.relation ? "Sin asignar" : "Seleccionar"}</option>
              {module==="requests"&&field.key==="product"?<>{form.values.product&&!data.products.some(product=>product.slug===form.values.product)&&<option value={form.values.product}>Producto archivado: {form.values.product}</option>}{data.products.map(product=><option key={product.slug} value={product.slug}>{product.name}</option>)}</>:field.relation ? workspace.records[field.relation].filter(r => module !== "payments" || field.key !== "quote" || !form.values.client || r.values.client === form.values.client).map(record => <option key={record.id} value={record.id}>{record.values.name}</option>) : field.options?.map(option => <option key={option}>{option}</option>)}
            </select> : field.type === "textarea" ? <textarea required={field.required} rows={4} value={form.values[field.key] || ""} onChange={e => change(field.key,e.target.value)} /> : <input required={field.required} type={field.type || "text"} min={field.type === "number" ? "0" : undefined} max={field.key === "progress" ? "100" : undefined} step={field.type==="number"?(field.key==="progress"?"1":"0.01"):undefined} value={form.values[field.key] || ""} onChange={e => change(field.key,e.target.value)} />}
            {field.relation && !workspace.records[field.relation].length && <small>Primero crea un registro en <Link to={"/dashboard/" + field.relation}>{modules[field.relation].title}</Link>.</small>}
          </label>)}
        </div>
        {module === "files" && <label className={styles.field}>Archivo (hasta 500 KB)<input type="file" accept=".pdf,.png,.jpg,.jpeg,.webp,.txt,.csv,.docx,.xlsx" disabled={readingFile} onChange={e => void fileSelected(e.target.files?.[0])} /><small>{form.values.filename || "Selecciona un documento o imagen."} · {cloud?"Se guarda de forma privada en tu espacio de Ksoft.":"Se guarda en este navegador."}</small></label>}
        <div className={styles.actions}><button type="submit" disabled={readingFile} className={styles.primary}>{readingFile ? "Leyendo archivo…" : "Guardar " + definition.singular}</button><small>Los campos con * son obligatorios.</small></div>
      </form>}
      {detail && <article ref={detailRef} tabIndex={-1} className={styles.panel + " " + styles.printable}>
        <div className={styles.heading + " " + styles.noPrint}><h2>Detalle de {definition.singular}</h2><div className={styles.actions}>{module === "quotes" && <button onClick={() => window.print()}>Imprimir / PDF</button>}<button onClick={() => setDetail(null)}>Cerrar detalle</button></div></div>
        {module === "quotes" && <p className={styles.eyebrow}>{workspace.settings.company} · {workspace.settings.email}</p>}
        <h2>{detail.values.name}</h2>
        <dl className={styles.facts}>{definition.fields.filter(field => detail.values[field.key] && field.key !== "name").map(field => <div key={field.key}><dt>{field.label}</dt><dd>{field.relation&&detail.values[field.key]?<Link to={"/dashboard/"+field.relation+"?record="+encodeURIComponent(detail.values[field.key])}>{labelValue(detail,field.key)}</Link>:labelValue(detail,field.key)}</dd></div>)}</dl>
        {module==="quotes"&&<dl className={styles.facts}><div><dt>Pagos recibidos</dt><dd>{money(quoteTotals(workspace,detail.id).paid)}</dd></div><div><dt>Cobros pendientes</dt><dd>{money(quoteTotals(workspace,detail.id).pending)}</dd></div><div><dt>Saldo por recibir</dt><dd>{money(quoteTotals(workspace,detail.id).balance)}</dd></div><div><dt>Sin programar</dt><dd>{money(quoteTotals(workspace,detail.id).unallocated)}</dd></div></dl>}
        {related.length > 0 && <section className={styles.noPrint}><h3>Registros relacionados</h3><ul>{related.map(({module: key, record}) => <li key={key + record.id}><Link to={"/dashboard/"+key+"?record="+encodeURIComponent(record.id)}>{modules[key].title}: {record.values.name}</Link></li>)}</ul></section>}
      </article>}
      <p className={styles.count}>{visible.length} de {records.length} registros</p>
      {visible.length ? <div className={styles.list}>{visible.map(record => <article key={record.id} className={styles.row}><div>
        {record.values.status && <span className={styles.badge}>{record.values.status}</span>}
        <h2>{record.values.name}</h2><p>{definition.fields.filter(field => !["name","status","notes","scope","description","resolution","terms"].includes(field.key) && record.values[field.key]).slice(0,3).map(field => labelValue(record,field.key)).join(" · ")}</p>
        {module === "projects" && <label className={styles.progressLabel}>Avance: {record.values.progress || 0}%<progress max="100" value={Number(record.values.progress || 0)} /></label>}
      </div><div className={styles.actions}>
        <button onClick={() => setDetail(record)}>Ver detalle</button><button onClick={() => open(record)}>Editar</button>
        {module === "files" && <button onClick={() => downloadFile(record)}>Descargar</button>}
        {module === "contacts" && (!record.values.client || record.values.status !== "Convertido") && <button onClick={() => convertContact(record)}>Convertir en cliente</button>}
        {module === "quotes" && record.values.status === "Aceptada" && <button onClick={() => createProject(record)}>Crear proyecto</button>}
        {module==="requests"&&<button onClick={()=>convertRequest(record)}>Asociar a contacto</button>}
        {module==="clients"&&<><Link className={styles.actionLink} to={"/dashboard/quotes?action=new&client="+encodeURIComponent(record.id)}>Crear cotización</Link><Link className={styles.actionLink} to={"/dashboard/projects?action=new&client="+encodeURIComponent(record.id)}>Crear proyecto</Link><Link className={styles.actionLink} to={"/dashboard/supports?action=new&client="+encodeURIComponent(record.id)}>Registrar soporte</Link></>}
        {module==="projects"&&<><Link className={styles.actionLink} to={"/dashboard/tasks?action=new&project="+encodeURIComponent(record.id)}>Crear tarea</Link><Link className={styles.actionLink} to={"/dashboard/files?action=new&project="+encodeURIComponent(record.id)}>Adjuntar archivo</Link></>}
        {module==="quotes"&&record.values.status==="Aceptada"&&quoteTotals(workspace,record.id).unallocated>0&&<Link className={styles.actionLink} to={"/dashboard/payments?action=new&quote="+encodeURIComponent(record.id)}>Registrar cobro</Link>}
        {cloud&&!form&&(module==="projects"||module==="tasks")&&<button type="button" onClick={()=>setAssignment(record.id)}>Asignar equipo de trabajo</button>}
        <button className={styles.danger} onClick={() => remove(record)}>Enviar a papelera</button>
      </div></article>)}</div> : <section className={styles.empty}><h2>{records.length ? "No hay resultados" : "Comienza a organizar " + definition.title.toLowerCase()}</h2><p>{records.length ? "Cambia la búsqueda o el filtro de estado." : "Crea tu primer registro para verlo aquí. Los datos del resumen se actualizarán con tu actividad."}</p></section>}
    </div>
  </>;
}

export function BusinessManager({module}:{module:ModuleKey}){const {search}=useLocation();const {role}=useAdmin();if(role!=="admin")return module==="projects"||module==="tasks"?<DeveloperWorkManager module={module}/>:null;return <BusinessManagerContent key={module+search} module={module} search={search}/>;}

