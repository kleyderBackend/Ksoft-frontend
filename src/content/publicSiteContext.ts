import { createContext,useContext } from "react";
import { products } from "../config/products";
import type { CatalogProduct } from "../config/products";
import { projects } from "../config/projects";
import type { Project } from "../config/projects";
import type { Post,Product } from "../Components/dashboards/adminModel";
export interface PublicSite {
  products: CatalogProduct[]; projects: Project[]; entries: Product[]; posts: Post[];
  loading:boolean; error:string;
}
export const fallbackSite:PublicSite={products,projects,entries:[],posts:[],loading:false,error:""};
export const PublicSiteContext=createContext<PublicSite>(fallbackSite);
export const usePublicSite=()=>useContext(PublicSiteContext);
