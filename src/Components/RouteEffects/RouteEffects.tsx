import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getProject } from "../../config/projects";

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

  useEffect(() => {
    const project = pathname.startsWith("/products/") ? getProject(pathname.slice("/products/".length)) : undefined;
    const page = project ? { title: project.name, description: project.summary } : pages[pathname];
    document.title = `${page?.title ?? "Página no encontrada"} | Ksoft`;
    document.querySelector('meta[name="description"]')?.setAttribute("content", page?.description ?? "Esta página no está disponible. Vuelve al inicio de Ksoft.");
    document.querySelector('meta[name="robots"]')?.setAttribute("content", page ? "index, follow" : "noindex, follow");
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", `https://ksoftdev.vercel.app${pathname === "/" ? "/" : pathname}`);

    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView();
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [pathname, hash]);

  return null;
};
