import { useEffect,useState } from "react";
import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { cloudEnabled,requireSupabase } from "../lib/supabase";
import { PublicSiteContext,fallbackSite } from "./publicSiteContext";
import type { PublicSite } from "./publicSiteContext";
import { emptyWorkspace } from "../Components/dashboards/businessModel";
import { parseAdminData,publicContactHref } from "../Components/dashboards/adminModel";
import { toPublicProject } from "../config/publicPresentation";

export function PublicSiteProvider({children}:{children:ReactNode}) {
  const {pathname}=useLocation();
  const [site,setSite]=useState<PublicSite>(cloudEnabled?{products:[],projects:[],entries:[],posts:[],loading:true,error:""}:fallbackSite);
  const admin=pathname.startsWith("/dashboard");
  useEffect(()=>{
    if(!cloudEnabled||admin)return;
    let active=true;
    const load=async()=>{
      try {
        const {data,error}=await requireSupabase().from("ksoft_public_site").select("payload").eq("id",true).single();
        if(error)throw error;
        if(!data.payload){if(active)setSite(fallbackSite);return;}
        const parsed=parseAdminData(JSON.stringify({...data.payload,version:1,workspace:emptyWorkspace(),activity:[]}));
        const entries=[...parsed.products,...(parsed.publicProjects??[])];
        if(active)setSite({products:parsed.products.map(product=>({...product,comingSoon:true,href:"/products/"+product.slug,pilotHref:publicContactHref(product),logo:product.logo||undefined})),projects:entries.map(toPublicProject),entries,posts:parsed.posts,loading:false,error:""});
      }catch{if(active)setSite({products:[],projects:[],entries:[],posts:[],loading:false,error:"No pudimos cargar el contenido. Intenta recargar la página."});}
    };
    void load();
    const onFocus=()=>{if(document.visibilityState==="visible")void load();};
    window.addEventListener("focus",onFocus);
    return ()=>{active=false;window.removeEventListener("focus",onFocus);};
  },[admin,pathname]);
  return <PublicSiteContext.Provider value={site}>{children}</PublicSiteContext.Provider>;
}
