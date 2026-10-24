import { emptyWorkspace, parseWorkspace } from "./businessModel.ts";
import type { Workspace } from "./businessModel.ts";
import { defaultPresentation } from "../../config/publicPresentation.ts";
import type { PublicPresentation } from "../../config/publicPresentation.ts";
import { products as publicProducts } from "../../config/products.ts";
import { assertRecoveryShape } from "./models/recoveryModel.ts";
import type { HistoryEntry, TrashEntry } from "./models/recoveryModel";
export type EditorialStatus = "draft" | "ready";
export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  status: EditorialStatus;
  updatedAt: string;
}
export interface Product {
  id: string;
  name: string;
  slug: string;
  headline: string;
  description: string;
  icon: string;
  logo: string;
  sector: string;
  audience: string;
  billingModel: string;
  availability: string;
  status: string;
  questions: { question: string; answer: string }[];
  editorialStatus: EditorialStatus;
  updatedAt: string;
  buttonText: string;
  contactButtonText: string;
  entryType: "product" | "project";
  visibility: "visible" | "hidden";
  contactIntent?: "pilot" | "product" | "project";
  presentation: PublicPresentation;
}
export interface AdminData {
  trash?: TrashEntry[];
  history?: HistoryEntry[];
  version: 1;
  posts: Post[];
  products: Product[];
  publicProjects?: Product[];
  workspace: Workspace;
  activity: { id: string; title: string; date: string }[];
}
export const STORAGE_KEY = "ksoft-admin-content-v1";
export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
export function safeImage(value: string) {
  if (!value) return true;
  if (/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(value) && value.length < 700000) return true;
  if (/^\/(?!\/)[^\\\s]*$/.test(value)) return true;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}
export function normalizeProduct(product: Omit<Product, "buttonText" | "contactButtonText" | "entryType" | "visibility" | "presentation"> & Partial<Pick<Product, "buttonText" | "contactButtonText" | "entryType" | "visibility" | "presentation">>): Product {
  const original = publicProducts.find(p => p.slug === product.slug);
  const presentation = product.presentation ?? defaultPresentation(product.slug);
  return {
    ...product,
    buttonText: product.buttonText ?? original?.buttonText ?? "Conocer la solución",
    contactButtonText: product.contactButtonText ?? "Solicitar participar en el piloto",
    entryType: product.entryType ?? "product",
    visibility: product.visibility ?? "visible",
    contactIntent: product.contactIntent ?? (product.entryType === "project" ? "project" : "pilot"),
    questions: structuredClone(product.questions),
    presentation: {...presentation, cardButtonText: presentation.cardButtonText ?? defaultPresentation(product.slug).cardButtonText},
    editorialStatus: !product.presentation && product.editorialStatus === "ready" && !presentation.summary ? "draft" : product.editorialStatus,
  };
}
export function validatePresentation(item: Product): string {
  const p = item.presentation;
  const textFields = ["category", "summary", "detailSector", "challenge", "solution", "benefit", "galleryTitle", "galleryIntro", "galleryEyebrow", "galleryPanelLabel", "website"] as const;
  if (!p || textFields.some(key => typeof p[key] !== "string") || !Array.isArray(p.features) || p.features.some(v => typeof v !== "string") || !Array.isArray(p.images) || !Array.isArray(p.sections)) return "El contenido de la presentación no es válido.";
  if (p.cardButtonText !== undefined && typeof p.cardButtonText !== "string") return "Revisa el texto del botón de la tarjeta de inicio.";
  if (p.website && !/^https:\/\//.test(p.website)) return "El enlace del sitio debe comenzar por https://.";
  try { if (p.website) new URL(p.website); } catch { return "Revisa el enlace del sitio."; }
  for (const image of [...p.images, ...(p.cover ? [p.cover] : [])]) {
    if (!image || ["src", "title", "alt", "caption"].some(key => typeof image[key as keyof typeof image] !== "string") || !image.src.trim() || !safeImage(image.src) || !image.alt.trim() || !image.title.trim() || !Number.isInteger(image.width) || !Number.isInteger(image.height) || image.width <= 0 || image.height <= 0) return "Completa cada imagen con una dirección válida, título, texto alternativo y dimensiones positivas.";
  }
  const ids = new Set<string>();
  for (const section of p.sections) {
    if (!section || ["id", "type", "eyebrow", "title", "description"].some(key => typeof section[key as keyof typeof section] !== "string") || !/^[a-zA-Z0-9-]+$/.test(section.id) || ids.has(section.id) || !["audience", "modules", "flow", "architecture", "commercial"].includes(section.type) || !Array.isArray(section.paragraphs) || section.paragraphs.some(v => typeof v !== "string") || !Array.isArray(section.flowLabels) || section.flowLabels.some(v => typeof v !== "string") || !Array.isArray(section.items) || section.items.some(v => !v || typeof v.title !== "string" || typeof v.description !== "string")) return "Revisa el contenido de las secciones del detalle.";
    ids.add(section.id);
    if (item.editorialStatus === "ready" && (!section.title.trim() || section.items.some(v => !v.title.trim() || (section.type !== "audience" && !v.description.trim())) || section.paragraphs.some(v => !v.trim()))) return "Completa los títulos, textos y elementos de cada sección antes de preparar el contenido.";
  }
  if (item.editorialStatus === "ready" && ([item.buttonText, item.contactButtonText, p.cardButtonText ?? "", item.status, p.category, p.summary, p.detailSector, p.challenge, p.solution, p.benefit].some(v => !v.trim()) || p.features.some(v => !v.trim()))) return "Completa la tarjeta, el resumen, el público, el problema, la solución y los beneficios antes de preparar el contenido.";
  return "";
}
export function publicContactHref(item: Product): string {
  if (item.entryType === "project" || item.contactIntent === "project") return "/contact#contact-form";
  return "/contact?producto=" + encodeURIComponent(item.slug) + (item.contactIntent === "product" ? "" : "&motivo=piloto") + "#contact-form";
}
export function validateContent(
  item: Post | Product,
  siblings: (Post | Product)[],
) {
  if (!("title" in item ? item.title : item.name).trim())
    return "Escribe un nombre o título.";
  if (!item.slug || slugify(item.slug) !== item.slug)
    return "La dirección debe usar letras minúsculas, números y guiones.";
  if (
    siblings.some((other) => other.id !== item.id && other.slug === item.slug)
  )
    return "Ya existe contenido con esa dirección.";
  if (!safeImage("image" in item ? item.image : item.logo))
    return "Usa una imagen HTTPS o una ruta local que comience por /.";
  if ("content" in item) {
    if (
      item.status === "ready" &&
      (!item.excerpt.trim() || !item.content.trim())
    )
      return "Completa el resumen y el contenido para marcar la publicación como preparada.";
  } else {
    if (
      !item.description.trim() ||
      !item.audience.trim() ||
      (item.entryType !== "project" && !item.billingModel.trim())
    )
      return "Completa la descripción, el público y el modelo de cobro.";
    if (item.questions.some((q) => !q.question.trim() || !q.answer.trim()))
      return "Completa cada pregunta y respuesta, o elimina la pregunta vacía.";
    const presentationError = validatePresentation(item);
    if (presentationError) return presentationError;
  }
  return "";
}
export function parseAdminData(raw: string): AdminData {
  const data = JSON.parse(raw) as AdminData;
  const strings = (item: object, fields: string[]) =>
    fields.every(
      (field) => typeof (item as Record<string, unknown>)[field] === "string",
    );
  const status = (value: unknown) => value === "draft" || value === "ready";
  if (
    !data ||
    data.version !== 1 ||
    !Array.isArray(data.posts) ||
    !Array.isArray(data.products) ||
    !Array.isArray(data.activity)
  )
    throw new Error("Formato incompatible");
  for (const post of data.posts) {
    if (
      !post ||
      !strings(post, [
        "id",
        "title",
        "slug",
        "excerpt",
        "content",
        "image",
        "updatedAt",
      ]) ||
      !status(post.status) ||
      validateContent(post, data.posts)
    )
      throw new Error("Publicación inválida");
  }
  if (data.publicProjects !== undefined && !Array.isArray(data.publicProjects)) throw new Error("Proyectos públicos inválidos");
  data.products = data.products.map(p => p && normalizeProduct(p));
  if (data.publicProjects) data.publicProjects = data.publicProjects.map(p => p && normalizeProduct(p));
  const allPublicEntries = [...data.products, ...(data.publicProjects ?? [])];
  for (const product of allPublicEntries) {
    if (
      !product ||
      !strings(product, [
        "id",
        "name",
        "slug",
        "headline",
        "description",
        "icon",
        "logo",
        "sector",
        "audience",
        "billingModel",
        "availability",
        "status",
        "updatedAt",
      ]) ||
      !status(product.editorialStatus) ||
      !strings(product, ["buttonText", "contactButtonText"]) ||
      !["product", "project"].includes(product.entryType) ||
      !["visible", "hidden"].includes(product.visibility) ||
      !["pilot", "product", "project"].includes(product.contactIntent ?? "pilot") ||
      !Array.isArray(product.questions) ||
      product.questions.some(
        (q) => !q || !strings(q, ["question", "answer"]),
      ) ||
      validateContent(product, allPublicEntries)
    )
      throw new Error("Producto inválido");
  }
  if (
    new Set(data.posts.map((p) => p.id)).size !== data.posts.length ||
    new Set(data.products.map((p) => p.id)).size !== data.products.length ||
    new Set(allPublicEntries.map(p => p.id)).size !== allPublicEntries.length ||
    data.activity.some((a) => !a || !strings(a, ["id", "title", "date"]))
  )
    throw new Error("Registros inválidos");
  assertRecoveryShape(data);
  return {
    ...data,
    workspace: data.workspace
      ? parseWorkspace(data.workspace)
      : emptyWorkspace(),
  };
}
