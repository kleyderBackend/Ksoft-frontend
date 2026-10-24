import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { usePublicSite } from "../../content/publicSiteContext";
import { cloudEnabled } from "../../lib/supabase";

const pages: Record<string, { title: string; description: string }> = {
  "/": { title: "Software a medida y productos SaaS", description: "En Ksoft Technology desarrollamos sitios web, aplicaciones y software a medida. Conoce nuestros productos SaaS propios o cotiza tu proyecto." },
  "/about": { title: "Nosotros", description: "Conoce Ksoft Technology: desarrollo de software a medida y productos SaaS propios. Descubre nuestro propósito, nuestros valores y cómo trabajamos." },
  "/products": { title: "Nuestros productos SaaS", description: "Conoce Ksoft Travel para turismo y SaaS Dental para clínicas dentales. Consulta el propósito y estado de los productos propios de Ksoft." },
  "/contact": { title: "Contacto", description: "Habla con Ksoft Technology sobre tu proyecto de software a medida o nuestros productos SaaS. Consulta nuestros canales de atención y envíanos tu mensaje." },
  "/faq": { title: "Preguntas frecuentes", description: "Resuelve tus dudas sobre los servicios, cotizaciones, desarrollo y soporte de Ksoft." },
  "/privacity": { title: "Política de privacidad", description: "Consulta cómo Ksoft utiliza los datos que compartes al contactarnos." },
};

export const RouteEffects = () => {
  const { pathname, hash } = useLocation();
  const {projects,posts}=usePublicSite();
  const post=pathname.startsWith("/novedades/")?posts.find(item=>item.slug===pathname.slice("/novedades/".length)):undefined;
  const project=pathname.startsWith("/products/")?projects.find(item=>item.slug===pathname.slice("/products/".length)):undefined;

  const detailTitle=project?.name??post?.title;
  const detailDescription=project?.summary??post?.excerpt;

  useEffect(() => {
    const adminNames: Record<string,string> = { team:"Equipo",tickets:"Tickets internos",profile:"Mi perfil",requests:"Solicitudes",trash:"Papelera",history:"Historial",access:"Acceso", dashboard: "Dashboard", payments: "Pagos", expenses: "Gastos", reports: "Reportes", notifications: "Notificaciones", posts: "Publicaciones", products: "Productos", files: "Archivos", projects: "Proyectos", tasks: "Tareas", supports: "Soporte", contacts: "Contactos", clients: "Clientes", quotes: "Cotizaciones", settings: "Configuración", logout: "Salir del panel" };
    const isAdmin = (import.meta.env.DEV||cloudEnabled) && (pathname === "/dashboard" || pathname.startsWith("/dashboard/"));
    const adminTitle = isAdmin ? adminNames[pathname.split("/").at(-1) || ""] : undefined;
    const page = adminTitle ? { title: adminTitle + " · Equipo Ksoft", description: "Panel privado de gestión de Ksoft." } : detailTitle?{title:detailTitle,description:detailDescription??""}:pathname==="/novedades"?{title:"Novedades",description:"Publicaciones y actualidad de Ksoft Technology."}:pages[pathname];
    document.title = `${page?.title ?? "Página no encontrada"} | Ksoft`;
    document.querySelector('meta[name="description"]')?.setAttribute("content", page?.description ?? "Esta página no está disponible. Vuelve al inicio de Ksoft.");
    document.querySelector('meta[name="robots"]')?.setAttribute("content", isAdmin ? "noindex, nofollow" : page ? "index, follow" : "noindex, follow");
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", `https://ksoftdev.vercel.app${pathname === "/" ? "/" : pathname}`);

    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView();
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      document.getElementById("main-content")?.focus({preventScroll:true});
    }
  }, [pathname, hash,detailTitle,detailDescription]);

  return null;
};
