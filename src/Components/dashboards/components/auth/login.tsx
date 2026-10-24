import { useId,useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { FiEye,FiEyeOff,FiArrowLeft } from "react-icons/fi";
import styles from "./Login.module.css";
export const Login=({onLogin}:{onLogin?:(credentials:{email:string;password:string})=>Promise<void>})=>{
  const id=useId();
  const [email,setEmail]=useState(""),[password,setPassword]=useState(""),[visible,setVisible]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState("");
  const submit=async(event:FormEvent)=>{
    event.preventDefault();setError("");
    if(!email.trim()||!password.trim()){setError("Completa el correo y la contraseña.");return;}
    if(!onLogin){setError("El acceso privado todavía no está conectado.");return;}
    setBusy(true);
    try{await onLogin({email:email.trim(),password});setPassword("");}catch{setError("No se pudo iniciar sesión. Verifica tus datos e inténtalo nuevamente.");}finally{setBusy(false);}
  };
  return <section className={styles.panel}><div className={styles.brand}><span>K</span><div><strong>Ksoft Technology</strong><small>Espacio del equipo</small></div></div><p className={styles.eyebrow}>ACCESO AL PANEL</p><h1>Tu equipo, conectado.</h1><p className={styles.intro}>Inicia sesión para acceder a tu espacio de trabajo en Ksoft.</p>
    {!onLogin&&<div className={styles.notice} role="note"><strong>Vista previa del acceso privado</strong><p>El inicio de sesión aún no está conectado. Este formulario no envía ni guarda tus credenciales.</p></div>}
    <form onSubmit={event=>void submit(event)} aria-busy={busy}><label htmlFor={id+"-email"}>Correo electrónico</label><input id={id+"-email"} type="email" autoComplete="username" required value={email} onChange={event=>setEmail(event.target.value)} placeholder="nombre@empresa.com" disabled={busy}/><label htmlFor={id+"-password"}>Contraseña</label><div className={styles.password}><input id={id+"-password"} type={visible?"text":"password"} autoComplete="current-password" required value={password} onChange={event=>setPassword(event.target.value)} disabled={busy}/><button type="button" aria-label={visible?"Ocultar contraseña":"Mostrar contraseña"} aria-pressed={visible} onClick={()=>setVisible(!visible)}>{visible?<FiEyeOff/>:<FiEye/>}</button></div>{error&&<p className={styles.error} role="alert">{error}</p>}<button className={styles.submit} type="submit" disabled={busy||!onLogin}>{busy?"Iniciando sesión…":"Iniciar sesión"}</button></form><Link className={styles.back} to={onLogin?"/":"/dashboard"}><FiArrowLeft aria-hidden="true"/> {onLogin?"Volver al sitio web":"Volver al panel local"}</Link>
  </section>;
};

