import { projects } from "./projects.ts";
import type { Project } from "./projects.ts";
import { productSections } from "./productSections.ts";
import type { DetailSection } from "./productSections.ts";
export interface PublicPresentation {
  cardButtonText?: string;
  category: string; summary: string; detailSector: string;
  challenge: string; solution: string; benefit: string; features: string[];
  galleryTitle: string; galleryIntro: string; galleryEyebrow: string; galleryPanelLabel: string;
  images: Project["images"]; cover: Project["images"][number] | null;
  website: string; sections: DetailSection[];
}
export function defaultPresentation(slug: string): PublicPresentation {
  const project = projects.find(p => p.slug === slug);
  return structuredClone({
    cardButtonText: project ? "Conocer el producto" : "Ver proyecto",
    category: project?.category ?? "", summary: project?.summary ?? "", detailSector: project?.sector ?? "",
    challenge: project?.challenge ?? "", solution: project?.solution ?? "", benefit: project?.benefit ?? "",
    features: project?.features ?? [], galleryTitle: project?.galleryTitle ?? "", galleryIntro: project?.galleryIntro ?? "",
    galleryEyebrow: slug === "ksoft-travel" ? "ASÍ SE VE KSOFT TRAVEL" : "CONOCE LA SOLUCIÓN",
    galleryPanelLabel: slug === "ksoft-travel" ? "PANEL HOTEL" : "VISTA DEL PROYECTO",
    images: project?.images ?? [], cover: null, website: project?.href ?? "", sections: productSections[slug] ?? [],
  });
}
export interface PresentableEntry {
  slug: string; name: string; status: string; logo: string; icon: string; buttonText?: string; presentation: PublicPresentation;
}
export function toPublicProject(entry: PresentableEntry): Project {
  const p = entry.presentation;
  return {
    slug: entry.slug, name: entry.name, status: entry.status, logo: entry.logo || undefined, buttonText: p.cardButtonText ?? "Conocer el producto",
    category: p.category, summary: p.summary, sector: p.detailSector,
    challenge: p.challenge, solution: p.solution, benefit: p.benefit,
    features: p.features, images: p.images, cover: p.cover ?? undefined, icon: entry.icon,
    galleryTitle: p.galleryTitle, galleryIntro: p.galleryIntro,
    galleryEyebrow: p.galleryEyebrow, galleryPanelLabel: p.galleryPanelLabel, href: p.website || undefined,
  };
}

