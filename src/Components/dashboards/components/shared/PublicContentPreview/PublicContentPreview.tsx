import { useState } from "react";
import { ProductCatalogCard } from "../../../../ProductCatalogCard/ProductCatalogCard";
import { ProjectCard } from "../../../../ProjectCard/ProjectCard";
import { ProjectDetailContent } from "../../../../ProjectDetailContent/ProjectDetailContent";
import { toPublicProject } from "../../../../../config/publicPresentation";
import { safeImage, publicContactHref } from "../../../adminModel";
import type { Product } from "../../../adminModel";
import styles from "./PublicContentPreview.module.css";
export function PublicContentPreview({value,related,onClose}: {value: Product; related: Product[]; onClose: () => void}) {
  const [view,setView] = useState(value.entryType === "project" ? "card" : "catalog");
  const [notice,setNotice] = useState("");
  const safeValue = {...value,logo:safeImage(value.logo)?value.logo:"",presentation:{...value.presentation,cover:value.presentation.cover && safeImage(value.presentation.cover.src) ? value.presentation.cover : null,images:value.presentation.images.filter(image=>image.src && safeImage(image.src)),website:value.presentation.website.startsWith("https://")?value.presentation.website:""}};
  const project = toPublicProject(safeValue);
  const product = {...safeValue,href:"/products/"+value.slug,pilotHref:publicContactHref(value),comingSoon:true};
  return <section className={styles.preview} aria-label="Vista previa pública"><div className={styles.toolbar}><div><span>VISTA PREVIA · {value.name}</span><p>La tarjeta y el detalle usan los mismos componentes de la web. Los cambios todavía son locales.</p></div><button type="button" onClick={onClose}>Cerrar vista previa pública</button></div><div className={styles.tabs} role="group" aria-label="Presentación a revisar">{value.entryType === "product" && <button type="button" aria-pressed={view==="catalog"} onClick={()=>setView("catalog")}>Tarjeta del catálogo</button>}<button type="button" aria-pressed={view==="card"} onClick={()=>setView("card")}>Tarjeta de inicio</button><button type="button" aria-pressed={view==="detail"} onClick={()=>setView("detail")}>Detalle completo</button></div>{notice && <p role="status" className={styles.notice}>{notice}</p>}
    <div className={styles.canvas} data-local-preview onClickCapture={event=>{const link=(event.target as Element).closest("a");if(!link)return;const href=link.getAttribute("href")||"";if(safeImage(href) && (safeValue.presentation.images.some(image=>image.src===href)||href.startsWith("data:image/")))return;event.preventDefault();event.stopPropagation();if(href==="/products/"+value.slug)setView("detail");else setNotice("Enlace de vista previa: "+href);}}>
      {view==="catalog" ? <ProductCatalogCard product={product} /> : view==="card" ? <div className={styles.singleCard}><ProjectCard project={project}/></div> : <ProjectDetailContent project={project} product={product} sections={value.presentation.sections} related={related.filter(item=>item.id!==value.id && item.visibility==="visible").map(toPublicProject)} />}
    </div>
  </section>;
}

