import { useEffect,useState } from "react";
import { Link } from "react-router-dom";
import { cloudEnabled,requireSupabase } from "../../../../lib/supabase";
import styles from "./LogoutPanel.module.css";

export function LogoutPanel() {
  const [state,setState]=useState(cloudEnabled?"pending":"done");
  useEffect(()=>{
    if(!cloudEnabled)return;
    let active=true;
    const signOut=async()=>{try{const {error}=await requireSupabase().auth.signOut({scope:"local"});if(active)setState(error?"error":"done");}catch{if(active)setState("error");}};
    void signOut();return ()=>{active=false;};
  },[]);
  return (
    <main id="main-content" className={styles.exitPage}>
      <div className={styles.container}>
        <section className={styles.panel}>
          <span className={styles.eyebrow}>EQUIPO KSOFT</span>
          <h1>{state==="pending"?"Cerrando sesión…":state==="error"?"No se pudo cerrar la sesión":cloudEnabled?"Sesión cerrada":"Has salido del panel local"}</h1>
          <p>{cloudEnabled?"Tus registros permanecen guardados en tu espacio de Ksoft.":"Los registros guardados siguen en este navegador."}</p>
          <p className={styles.count}>
            {cloudEnabled?state==="error"?"Comprueba la conexión y vuelve a intentarlo.":"Para volver a entrar necesitas tu cuenta autorizada.":"Esta versión local no utiliza cuentas ni sesiones de usuario."}
          </p>
          <div className={styles.actions}>
            <Link to="/">Ir al sitio web</Link>
            <Link to={cloudEnabled?"/dashboard/access":"/dashboard"}>{cloudEnabled?"Iniciar sesión":"Volver al panel"}</Link>
            {state==="error"&&<button onClick={()=>window.location.reload()}>Reintentar cierre</button>}
          </div>
        </section>
      </div>
    </main>
  );
}
