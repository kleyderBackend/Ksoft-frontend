import { Fragment,useEffect,useState } from "react";
import type { ReactNode } from "react";
import { Link,Navigate,useLocation } from "react-router-dom";
import { cloudEnabled,requireSupabase } from "../../../../lib/supabase";
import {AccessContext} from "../../accessContext";
import type {DashboardAccess} from "../../accessContext";

export function RequireAdmin({children}:{children:ReactNode}) {
  const location=useLocation();
  const [state,setState]=useState<"loading"|"allowed"|"login"|"denied"|"error">("loading");
  const [access,setAccess]=useState<DashboardAccess>({role:"admin",userId:""});
  useEffect(()=>{
    if(!cloudEnabled)return;
    let active=true;
    let unsubscribe: (()=>void)|undefined;
    const check=async()=>{
      try {
        const client=requireSupabase();
        const {data:{session},error}=await client.auth.getSession();
        if(error)throw error;
        if(!session){if(active)setState("login");return;}
        const result=await client.rpc("ksoft_get_access");
        if(result.error)throw result.error;
        if(active){const valid=result.data&&["admin","developer","qa","employee"].includes(result.data.role);if(valid)setAccess(result.data as DashboardAccess);setState(valid?"allowed":"denied");}
      }catch{if(active)setState("error");}
    };
    void check();
    try {const {data}=requireSupabase().auth.onAuthStateChange(()=>{setTimeout(()=>void check(),0);});unsubscribe=()=>data.subscription.unsubscribe();}catch{/* configuration error shown by check */}
    return ()=>{active=false;unsubscribe?.();};
  },[location.pathname]);
  if(!cloudEnabled) return import.meta.env.DEV ? children : <Navigate to="/" replace/>;
  if(state==="login")return <Navigate to="/dashboard/access" state={{from:location.pathname+location.search}} replace/>;
  if(state==="allowed"){
    if(access.role!=="admin"&&!new RegExp("^/dashboard/?$|^/dashboard/(tickets|profile"+(access.role!=="employee"?"|projects|tasks":"")+")/?$").test(location.pathname))return <Navigate to="/dashboard" replace/>;
    return <AccessContext.Provider value={access}><Fragment key={access.userId+access.role}>{children}</Fragment></AccessContext.Provider>;
  }
  return <main id="main-content" tabIndex={-1} style={{padding:"4rem",color:"#dbeafe"}}><h1>{state==="loading"?"Comprobando acceso…":state==="denied"?"Esta cuenta no tiene acceso al panel":"No se pudo comprobar el acceso"}</h1>{state!=="loading"&&<><p>El acceso requiere una cuenta autorizada del equipo de Ksoft.</p><Link to="/dashboard/logout">Cerrar sesión</Link> · <Link to="/">Volver a la web</Link></>}</main>;
}
