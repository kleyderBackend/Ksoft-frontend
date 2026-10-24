import { useState } from "react";
import { safeImage } from "../../../adminModel";
import styles from "./MediaField.module.css";
import { cloudEnabled,requireSupabase } from "../../../../../lib/supabase";
export interface ImageAsset {src: string; width: number; height: number}
export function MediaField({label,value,onChange,onAsset,onBusy}: {label: string; value: string; onChange: (value: string) => void; onAsset: (asset: ImageAsset) => void; onBusy: (busy: boolean) => void}) {
  const [error,setError] = useState("");
  const upload = async (file?: File) => {
    if (!file) return;
    if (!["image/png","image/jpeg","image/webp"].includes(file.type) || file.size > 512000) {setError("Elige una imagen PNG, JPG o WebP de hasta 500 KB.");return;}
    setError("");onBusy(true);
    const url = URL.createObjectURL(file);
    try {
      const image = new Image(); image.src = url; await image.decode();
      let src:string;
      if(cloudEnabled){
        const client=requireSupabase();
        const path=crypto.randomUUID()+({"image/png":".png","image/jpeg":".jpg","image/webp":".webp"}[file.type]??"");
        const {error}=await client.storage.from("ksoft-media").upload(path,file,{contentType:file.type,upsert:false});
        if(error)throw error;
        src=client.storage.from("ksoft-media").getPublicUrl(path).data.publicUrl;
      }else src = await new Promise<string>((resolve,reject) => {const reader = new FileReader();reader.onload = () => resolve(String(reader.result));reader.onerror = () => reject(new Error());reader.readAsDataURL(file);});
      onAsset({src,width:image.naturalWidth,height:image.naturalHeight});
    } catch {setError(cloudEnabled?"No se pudo subir la imagen. Comprueba la conexión y los permisos del espacio ksoft-media.":"No se pudo leer la imagen. Selecciona otra imagen válida.");}
    finally {URL.revokeObjectURL(url);onBusy(false);}
  };
  return <div className={styles.field}><label>{label}<input value={value.startsWith("data:") ? "" : value} placeholder={value.startsWith("data:") ? "Imagen cargada desde tu equipo" : "https://… o /img/…"} onChange={e => onChange(e.target.value)} /></label><label>Cargar imagen desde el equipo<input type="file" accept="image/png,image/jpeg,image/webp" onChange={e => void upload(e.target.files?.[0])} /></label><small>PNG, JPG o WebP, hasta 500 KB. Puedes usar una dirección de imagen sin cargar un archivo.</small>{value && safeImage(value) && <div className={styles.preview}><img src={value} alt="Vista previa de la imagen seleccionada" /><button type="button" onClick={() => onChange("")}>Quitar imagen</button></div>}{error && <p role="alert">{error}</p>}</div>;
}

